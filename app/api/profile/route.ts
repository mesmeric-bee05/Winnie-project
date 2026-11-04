import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

const profileSchema = z.object({
  displayName: z.string().trim().min(2).max(80),
  locale: z.string().trim().min(2).max(20).optional(),
  timezone: z.string().trim().min(2).max(80).optional(),
});

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    const { data, error } = await supabase.from("profiles").select("id, display_name, avatar_url, locale, timezone, app_role, onboarding_status, profile_visibility").eq("id", user.id).single();
    if (error) throw error;
    return NextResponse.json({ profile: data });
  } catch {
    return NextResponse.json({ error: "Profile is temporarily unavailable." }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  try {
    const rate = checkRateLimit(request, "profile-patch", 20, 15 * 60 * 1000);
    if (!rate.allowed) return rateLimitResponse(rate.retryAfter);
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    const parsed = profileSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid profile fields." }, { status: 400 });
    const { data, error } = await supabase.from("profiles").update({ display_name: parsed.data.displayName, locale: parsed.data.locale, timezone: parsed.data.timezone }).eq("id", user.id).select("id, display_name, avatar_url, locale, timezone, app_role, onboarding_status, profile_visibility").single();
    if (error) throw error;
    return NextResponse.json({ profile: data });
  } catch {
    return NextResponse.json({ error: "Profile could not be updated." }, { status: 503 });
  }
}
