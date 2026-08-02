import { isSupabaseConfigured, restGet, restRpc } from './supabaseRest';

/**
 * Voting data layer for /q and /vote (plain fetch via supabaseRest).
 *
 * Backend lives in the check-in project's Supabase (Taichi_check_in/supabase/
 * schema.sql — single source of truth):
 *   - posters:      public select; each entry belongs to one vote round
 *   - vote_state(): every round's window, vote limit and open flag. Carries NO
 *                   tallies — live counts are staff-only (check-in admin page)
 *   - my_votes():   what this token voted for, so已投 state survives a device
 *                   change; the votes table itself is not readable
 *   - cast_vote():  all real constraints live server-side (token validity,
 *                   can_vote, round window, check-in requirement, per-round
 *                   vote limit, no duplicate entry)
 *
 * localStorage only mirrors "which entries this token voted for" so the UI can
 * restore已投 state after reload — it is NOT a security boundary.
 */

/**
 * Fallback vote limit, used only while vote_state has not loaded yet.
 * The real limit is per round and comes from the server.
 */
export const MAX_VOTES = 3;

export type Poster = {
	id: string;
	title: string;
	author: string | null;
	theme: string | null;
	conference: string | null;
	category: string | null; // 'poster' | 'demo'（舊資料可能為 null → 視為 poster）
	round_id: string | null; // 所屬投票回合；沒掛回合的作品不可投
};

/** One (category × day) voting unit: its own window and its own vote limit. */
export type VoteRound = {
	id: string;
	category: string; // 'poster' | 'demo'
	day: number;
	label: string | null;
	opens_at: string | null;
	closes_at: string | null;
	max_votes: number;
	require_checkin: boolean;
	open: boolean;
};

export type VoteState = {
	rounds: VoteRound[];
	/** Aggregates across rounds: any round open, earliest start, latest close. */
	open: boolean;
	opens_at: string | null;
	closes_at: string | null;
};

export type MyVote = { poster_id: string; round_id: string | null };

export type CastVoteResult =
	| { ok: true; votesUsed: number }
	| { ok: false; error: string; message: string };

const VOTE_ERROR_MESSAGES: Record<string, string> = {
	invalid_token: '通行碼無效，請使用報到 QR Code 上的連結進入',
	not_eligible: '此通行碼沒有投票資格',
	not_open: '投票尚未開放',
	closed: '投票已截止',
	invalid_poster: '找不到這張海報，請重新整理頁面',
	max_votes: `此類別的 ${MAX_VOTES} 票已用完`,
	duplicate_poster: '已投過這張海報',
	not_configured: '投票系統尚未設定完成，請稍後再試',
	network: '連線失敗，請確認網路後再試',
};

export const voteErrorMessage = (code: string): string => VOTE_ERROR_MESSAGES[code] ?? `投票失敗（${code}）`;

/** The four conferences running as one event; the /q lookup picks one of them. */
export const CONFERENCES = ['晶創人文', 'APMAR', 'TAICHI', 'ISAT'] as const;

export type PassInfo = {
	ok: true;
	token: string;
	name: string | null;
	ticket_type: string | null;
	/** Early registrants may collect a cookie — shown as a badge on the pass. */
	cookie_eligible: boolean;
	/** Whether this attendee has an email on file, which decides what stage two asks for. */
	has_email: boolean;
	checked_in: boolean;
};

export type LookupPassResult = PassInfo | { ok: false; error: string };

/**
 * Stage one of /q: conference + name → digital pass (lookup_pass RPC).
 *
 * The conference is matched against the attendee's conference list, so someone
 * registered for two of them can pick either. Names are compared with case,
 * spacing, hyphens and full-width forms normalised away. Several people can
 * share a name: the server then returns 'ambiguous' and hands back nobody until
 * an email narrows it down — it must never hand you someone else's pass.
 */
export async function lookupPass(conference: string, name: string, email?: string): Promise<LookupPassResult> {
	if (!isSupabaseConfigured) return { ok: false, error: 'not_configured' };
	try {
		return await restRpc<LookupPassResult>('lookup_pass', {
			p_conference: conference,
			p_name: name,
			p_email: email ?? null,
		});
	} catch {
		return { ok: false, error: 'network' };
	}
}

/** The pass is the URL, so opening /q?t=… straight up still needs these fields. */
export async function getPassInfo(token: string): Promise<LookupPassResult> {
	if (!isSupabaseConfigured) return { ok: false, error: 'not_configured' };
	try {
		return await restRpc<LookupPassResult>('pass_info', { p_token: token });
	} catch {
		return { ok: false, error: 'network' };
	}
}

export type VerifyResult = { ok: true; via: string } | { ok: false; error: string };

/**
 * Stage two of /q: prove you are the person on the pass before voting opens up.
 * Accepts the attendee's email; for the attendees with no email on file it also
 * accepts the shared passphrase, and staff can unlock someone from the admin.
 */
export async function verifyVoteAccess(token: string, secret: string): Promise<VerifyResult> {
	if (!isSupabaseConfigured) return { ok: false, error: 'not_configured' };
	try {
		return await restRpc<VerifyResult>('verify_vote_access', { p_token: token, p_secret: secret });
	} catch {
		return { ok: false, error: 'network' };
	}
}

// ─── 已驗證狀態：同一台裝置回到 /q 不必重打 email ─────────────────────────────
const verifiedKey = (token: string) => `vote-verified:${token}`;

export function isVoteVerified(token: string): boolean {
	if (!token) return false;
	try {
		return window.localStorage.getItem(verifiedKey(token)) === '1';
	} catch {
		return false;
	}
}

export function rememberVoteVerified(token: string): void {
	if (!token) return;
	try {
		window.localStorage.setItem(verifiedKey(token), '1');
	} catch {
		// storage full / privacy mode — 使用者重打一次 email 就好，cast_vote 仍以伺服器為準
	}
}

/** All entries (posters + demos), loaded once (the list rarely changes during the event). */
export async function getPosters(): Promise<Poster[]> {
	if (!isSupabaseConfigured) return [];
	return restGet<Poster[]>('posters?select=id,title,author,theme,conference,category,round_id&order=id');
}

/** Every round's window and vote limit — poll this, and refetch right after casting. */
export async function getVoteState(): Promise<VoteState | null> {
	if (!isSupabaseConfigured) return null;
	return restRpc<VoteState | null>('vote_state');
}

/**
 * This token's own votes, via my_votes(). The votes table is not readable —
 * live counts are staff-only — but a voter still needs已投 state to follow them
 * across devices, which localStorage alone cannot do.
 */
export async function getMyVotes(token: string): Promise<MyVote[]> {
	if (!isSupabaseConfigured || !token) return [];
	return restRpc<MyVote[]>('my_votes', { p_token: token });
}

/** Convenience wrapper: just the entry ids this token has voted for. */
export async function getVotedPosterIdsFromServer(token: string): Promise<string[]> {
	return (await getMyVotes(token)).map((row) => row.poster_id);
}

export async function castVote(token: string, posterId: string): Promise<CastVoteResult> {
	if (!isSupabaseConfigured) return { ok: false, error: 'not_configured', message: voteErrorMessage('not_configured') };
	let result: { ok: boolean; error?: string; votes_used?: number };
	try {
		result = await restRpc('cast_vote', { p_token: token, p_poster_id: posterId });
	} catch {
		return { ok: false, error: 'network', message: voteErrorMessage('network') };
	}
	if (!result?.ok) {
		const code = result?.error ?? 'unknown';
		return { ok: false, error: code, message: voteErrorMessage(code) };
	}
	addVotedPosterId(token, posterId);
	return { ok: true, votesUsed: result.votes_used ?? getVotedPosterIds(token).length };
}

export { isSupabaseConfigured };

// ─── localStorage mirror of已投 posters（per token）────────────────────────────
const votedKey = (token: string) => `voted:${token}`;

export function getVotedPosterIds(token: string): string[] {
	if (!token) return [];
	try {
		const raw = window.localStorage.getItem(votedKey(token));
		const parsed = raw ? JSON.parse(raw) : [];
		return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
	} catch {
		return [];
	}
}

export function addVotedPosterId(token: string, posterId: string): void {
	if (!token) return;
	try {
		const ids = getVotedPosterIds(token);
		if (!ids.includes(posterId)) {
			window.localStorage.setItem(votedKey(token), JSON.stringify([...ids, posterId]));
		}
	} catch {
		// storage full / privacy mode — server still enforces the real limits
	}
}
