import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getSignedInProfile() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase.from("profiles").select("id, display_name, avatar_url, app_role, onboarding_status, profile_visibility").eq("id", user.id).maybeSingle();
    return data;
  } catch {
    return null;
  }
}
