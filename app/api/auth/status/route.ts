import { NextResponse } from "next/server";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/config";

export async function GET() {
  if (!supabaseUrl || !supabasePublishableKey) {
    return NextResponse.json({ configured: false, emailEnabled: false, googleEnabled: false }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/settings`, { headers: { apikey: supabasePublishableKey }, cache: "no-store" });
    if (!response.ok) throw new Error("Auth settings unavailable");
    const settings = await response.json() as { disable_signup?: boolean; mailer_autoconfirm?: boolean; external?: { email?: boolean; google?: boolean } };
    return NextResponse.json({
      configured: true,
      signupEnabled: settings.disable_signup !== true,
      emailEnabled: settings.external?.email !== false,
      emailConfirmationRequired: settings.mailer_autoconfirm !== true,
      googleEnabled: settings.external?.google === true,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ configured: true, signupEnabled: true, emailEnabled: true, emailConfirmationRequired: true, googleEnabled: false, statusUnknown: true }, { headers: { "Cache-Control": "no-store" } });
  }
}
