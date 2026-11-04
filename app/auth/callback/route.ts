import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function redirect(path: string) {
  return new NextResponse(null, { status: 303, headers: { Location: path, "Cache-Control": "no-store" } });
}

function safeNext(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") && !value.includes("\\") ? value : "/dashboard";
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  if (!code || code.length > 2048) {
    return redirect("/auth/sign-in?error=invalid_callback");
  }
  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;
    return redirect(safeNext(requestUrl.searchParams.get("next")));
  } catch {
    return redirect("/auth/sign-in?error=callback_failed");
  }
}
