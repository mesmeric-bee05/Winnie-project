// These are intentionally browser-safe Supabase values. RLS, not key secrecy,
// protects application data. Environment variables remain the preferred override.
const publicProjectUrl = "https://fnzfemarufeeiwgubrut.supabase.co";
const publicProjectKey = "sb_publishable_p_SdEJ1GqUo0ufKY4tZjnA_zdwA0IiF";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? publicProjectUrl;
export const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? publicProjectKey;

export function hasSupabaseBrowserConfig() {
  return Boolean(supabaseUrl && supabasePublishableKey);
}
