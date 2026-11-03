import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const onboardingSchema = z.object({
  targetRole: z.enum(["Product design", "Software development", "Growth & marketing"]),
  evidence: z.string().trim().min(10).max(2000),
  weeklyHours: z.enum(["1–2 hours", "3–5 hours", "6+ hours"]),
  nextOutcome: z.string().trim().min(5).max(250),
  employerVisibility: z.boolean(),
});

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    const parsed = onboardingSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Please complete every onboarding field." }, { status: 400 });

    const { data: profile, error: profileError } = await supabase.from("profiles").update({ onboarding_status: "complete", profile_visibility: parsed.data.employerVisibility ? "consented" : "private" }).eq("id", user.id).select("id, onboarding_status, profile_visibility").single();
    if (profileError) throw profileError;

    const { data: pathway, error: pathwayError } = await supabase.from("pathways").select("id, slug, title").eq("slug", "product-designer-v1").eq("status", "active").single();
    if (pathwayError || !pathway) throw pathwayError ?? new Error("Active pathway not found");

    const { data: menteePathway, error: menteePathwayError } = await supabase.from("mentee_pathways").upsert({ mentee_id: user.id, pathway_id: pathway.id, baseline_state: { evidence: parsed.data.evidence, weekly_hours: parsed.data.weeklyHours }, target_state: { next_outcome: parsed.data.nextOutcome, target_role: parsed.data.targetRole }, status: "active" }, { onConflict: "mentee_id,pathway_id" }).select("id, pathway_id, status").single();
    if (menteePathwayError) throw menteePathwayError;

    const { data: tasks, error: tasksError } = await supabase.from("tasks").select("id, milestone_id, position").eq("pathway_id", pathway.id).eq("active", true).order("position").limit(50);
    if (tasksError) throw tasksError;
    if (tasks?.length) {
      const assignments = tasks.map((task, index) => ({ mentee_pathway_id: menteePathway.id, task_id: task.id, state: index === 0 ? "available" : "locked", unlocked_at: index === 0 ? new Date().toISOString() : null }));
      const { error: assignmentError } = await supabase.from("task_assignments").upsert(assignments, { onConflict: "mentee_pathway_id,task_id" });
      if (assignmentError) throw assignmentError;
    }

    if (parsed.data.employerVisibility) {
      await supabase.from("consents").insert({ user_id: user.id, consent_type: "data_sharing", version: "2026-11-03", purpose: "Future consent-scoped employer profile sharing", granted: true, scope: { portfolio: true, milestones: true, endorsements: true }, granted_at: new Date().toISOString() });
    }
    await supabase.rpc("record_audit_event", { p_action: "onboarding_completed", p_entity_type: "mentee_pathway", p_entity_id: menteePathway.id, p_metadata: { target_role: parsed.data.targetRole, employer_visibility: parsed.data.employerVisibility } });
    return NextResponse.json({ profile, pathway, menteePathway }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Onboarding could not be saved. Please try again." }, { status: 503 });
  }
}
