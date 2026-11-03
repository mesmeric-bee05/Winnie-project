import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  if (!code || code.length > 2048) {
    return NextResponse.redirect(new URL("/auth/sign-in?error=invalid_callback", requestUrl.origin));
  }
  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;
    return NextResponse.redirect(new URL("/dashboard", requestUrl.origin));
  } catch {
    return NextResponse.redirect(new URL("/auth/sign-in?error=callback_failed", requestUrl.origin));
  }
}
