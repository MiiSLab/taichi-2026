import { isSupabaseConfigured, restGet, restRpc } from './supabaseRest';

/**
 * Voting data layer for /q and /vote (plain fetch via supabaseRest).
 *
 * Backend lives in the check-in project's Supabase (Taichi_check_in/supabase/
 * schema.sql — single source of truth):
 *   - posters:      public select
 *   - vote_state(): window status + live tallies (polled every ~10s)
 *   - cast_vote():  all real constraints live server-side (token validity,
 *                   can_vote, time window, ≤3 votes, no duplicate poster)
 *
 * localStorage only mirrors "which posters this token voted for" so the UI can
 * restore已投 state after reload — it is NOT a security boundary.
 */

export const MAX_VOTES = 3;

export type Poster = {
	id: string;
	title: string;
	author: string | null;
	theme: string | null;
	image_url: string | null;
	conference: string | null;
};

export type VoteTally = { poster_id: string; votes: number };

export type VoteState = {
	opens_at: string | null;
	closes_at: string | null;
	open: boolean;
	tallies: VoteTally[];
};

export type CastVoteResult =
	| { ok: true; votesUsed: number }
	| { ok: false; error: string; message: string };

const VOTE_ERROR_MESSAGES: Record<string, string> = {
	invalid_token: '通行碼無效，請使用報到 QR Code 上的連結進入',
	not_eligible: '此通行碼沒有投票資格',
	not_open: '投票尚未開放',
	closed: '投票已截止',
	invalid_poster: '找不到這張海報，請重新整理頁面',
	max_votes: `已用完 ${MAX_VOTES} 票`,
	duplicate_poster: '已投過這張海報',
	not_configured: '投票系統尚未設定完成，請稍後再試',
	network: '連線失敗，請確認網路後再試',
};

export const voteErrorMessage = (code: string): string => VOTE_ERROR_MESSAGES[code] ?? `投票失敗（${code}）`;

/** All posters, loaded once (the list rarely changes during the event). */
export async function getPosters(): Promise<Poster[]> {
	if (!isSupabaseConfigured) return [];
	return restGet<Poster[]>('posters?select=id,title,author,theme,image_url,conference&order=id');
}

/** Window status + live tallies — poll this, and refetch right after casting. */
export async function getVoteState(): Promise<VoteState | null> {
	if (!isSupabaseConfigured) return null;
	return restRpc<VoteState | null>('vote_state');
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
