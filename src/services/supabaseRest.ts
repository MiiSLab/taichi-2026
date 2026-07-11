/**
 * Minimal Supabase (PostgREST) REST helper for the voting flow (/q + /vote).
 *
 * Deliberately fetch-based instead of @supabase/supabase-js: the flow only
 * needs one table read and two RPCs — no auth, no realtime (tallies are
 * polled), no storage — so the client library would add ~30 KB gzipped for a
 * query builder we don't use.
 *
 * Points at the SAME Supabase project as the check-in app (Taichi_check_in) —
 * posters / votes / vote_window all live there. The anon key is safe to ship
 * in the bundle: RLS + SECURITY DEFINER RPCs are the actual security boundary.
 */
const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL ?? '').replace(/\/+$/, '');
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const HEADERS: Record<string, string> = {
	apikey: SUPABASE_ANON_KEY,
	Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
	'Content-Type': 'application/json',
};

/** GET /rest/v1/<pathAndQuery> — e.g. `posters?select=id,title&order=id` */
export async function restGet<T>(pathAndQuery: string): Promise<T> {
	const res = await fetch(`${SUPABASE_URL}/rest/v1/${pathAndQuery}`, { headers: HEADERS });
	if (!res.ok) throw new Error(`supabase GET ${res.status}`);
	return (await res.json()) as T;
}

/** POST /rest/v1/rpc/<fn> — returns the function's json result */
export async function restRpc<T>(fn: string, args: Record<string, unknown> = {}): Promise<T> {
	const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
		method: 'POST',
		headers: HEADERS,
		body: JSON.stringify(args),
	});
	if (!res.ok) throw new Error(`supabase RPC ${fn} ${res.status}`);
	return (await res.json()) as T;
}
