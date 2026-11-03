import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/config";

function previewCookieOptions(options: Record<string, unknown> = {}) {
  const preview = Boolean(process.env.MANUS_ADDON_PREVIEW_PUBLIC_ORIGIN);
  const sameSite: "none" | "lax" = preview ? "none" : "lax";
  return {
    ...options,
    sameSite,
    secure: preview || process.env.NODE_ENV === "production",
  };
}

export async function createSupabaseServerClient() {
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error("Supabase server configuration is missing.");
  }
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, previewCookieOptions(options)));
        } catch {
          // Server Components cannot always write cookies. Middleware refreshes the session.
        }
      },
    },
  });
}
