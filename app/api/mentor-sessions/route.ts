import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

const requestSchema = z.object({
  mentorId: z.string().uuid(),
  milestoneId: z.string().uuid().optional(),
  requestNote: z.string().trim().min(10).max(1000),
});

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    const { data, error } = await supabase.from("mentor_sessions").select("id, mentor_id, milestone_id, request_note, scheduled_start, scheduled_end, status, created_at").eq("mentee_id", user.id).order("created_at", { ascending: false }).limit(20);
    if (error) return NextResponse.json({ error: "Mentor sessions could not be loaded." }, { status: 500 });
    return NextResponse.json({ sessions: data ?? [] });
  } catch {
    return NextResponse.json({ error: "Mentor sessions could not be loaded." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const rate = checkRateLimit(request, "mentor-session-request", 5, 60 * 1000);
    if (!rate.allowed) return rateLimitResponse(rate.retryAfter);
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    const parsed = requestSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Provide a mentor, optional milestone, and a useful request note." }, { status: 400 });

    const { data: mentor } = await supabase.from("mentors").select("id, verification_status").eq("id", parsed.data.mentorId).eq("verification_status", "verified").maybeSingle();
    if (!mentor) return NextResponse.json({ error: "That mentor is not currently available for requests." }, { status: 409 });

    const { data, error } = await supabase.from("mentor_sessions").insert({ mentee_id: user.id, mentor_id: parsed.data.mentorId, milestone_id: parsed.data.milestoneId ?? null, request_note: parsed.data.requestNote, status: "requested" }).select("id, status, created_at").single();
    if (error || !data) return NextResponse.json({ error: "The mentor request could not be created." }, { status: 500 });
    return NextResponse.json({ session: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Mentor request failed." }, { status: 500 });
  }
}
