import { createBrowserClient } from "@supabase/ssr";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/config";

export function createSupabaseBrowserClient() {
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error("Supabase browser configuration is missing.");
  }
  return createBrowserClient(supabaseUrl, supabasePublishableKey);
}
