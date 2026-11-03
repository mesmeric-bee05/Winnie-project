import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: pathways, error: pathwayError } = await supabase
      .from("pathways")
      .select("id, slug, title, version, description, role_id")
      .eq("status", "active")
      .order("title")
      .limit(20);
    if (pathwayError) throw pathwayError;

    const pathwayIds = (pathways ?? []).map((pathway) => pathway.id);
    const [{ data: milestones, error: milestoneError }, { data: tasks, error: taskError }] = await Promise.all([
      supabase.from("milestones").select("id, pathway_id, position, slug, title, description, unlock_rules, reviewer_requirements").in("pathway_id", pathwayIds.length ? pathwayIds : ["00000000-0000-0000-0000-000000000000"]).order("position").limit(200),
      supabase.from("tasks").select("id, milestone_id, pathway_id, slug, title, description, instructions, rubric, expected_artifact_types, due_date_policy, position").in("pathway_id", pathwayIds.length ? pathwayIds : ["00000000-0000-0000-0000-000000000000"]).eq("active", true).order("position").limit(200),
    ]);
    if (milestoneError) throw milestoneError;
    if (taskError) throw taskError;

    return NextResponse.json({ pathways: pathways ?? [], milestones: milestones ?? [], tasks: tasks ?? [] }, { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } });
  } catch {
    return NextResponse.json({ error: "Pathway data is temporarily unavailable." }, { status: 503 });
  }
}
