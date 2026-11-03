import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/config";

export async function proxy(request: NextRequest) {
  if (!supabaseUrl || !supabasePublishableKey) return NextResponse.next();

  let response = NextResponse.next({ request });
  const preview = Boolean(process.env.MANUS_ADDON_PREVIEW_PUBLIC_ORIGIN);
  const cookieOptions = { sameSite: preview ? "none" : "lax", secure: preview || process.env.NODE_ENV === "production" } as const;
  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response = NextResponse.next({ request });
          response.cookies.set(name, value, { ...options, ...cookieOptions });
        });
      },
    },
  });

  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manus-routes.json|brand/|api/health).*)"],
};
