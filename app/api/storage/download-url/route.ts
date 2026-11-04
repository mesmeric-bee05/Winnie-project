import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { downloadRequestSchema, EVIDENCE_BUCKET, isOwnedEvidencePath } from "@/lib/storage";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const rate = checkRateLimit(request, "evidence-download-url", 30, 60 * 1000);
    if (!rate.allowed) return rateLimitResponse(rate.retryAfter);
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

    const parsed = downloadRequestSchema.safeParse(await request.json());
    if (!parsed.success || !isOwnedEvidencePath(parsed.data.path, user.id)) return NextResponse.json({ error: "Evidence path is not accessible." }, { status: 403 });

    const { data, error } = await supabase.storage.from(EVIDENCE_BUCKET).createSignedUrl(parsed.data.path, 3600);
    if (error || !data?.signedUrl) return NextResponse.json({ error: "Evidence file is not available." }, { status: 404 });
    return NextResponse.json({ signedUrl: data.signedUrl, expiresIn: 3600 });
  } catch {
    return NextResponse.json({ error: "Download preparation failed." }, { status: 500 });
  }
}
