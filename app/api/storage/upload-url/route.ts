import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createEvidencePath, EVIDENCE_BUCKET, uploadRequestSchema } from "@/lib/storage";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const rate = checkRateLimit(request, "evidence-upload-url", 5, 60 * 1000);
    if (!rate.allowed) return rateLimitResponse(rate.retryAfter);
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

    const body = await request.json();
    const parsed = uploadRequestSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Unsupported file type, filename, or size." }, { status: 400 });

    const path = createEvidencePath(user.id, parsed.data.filename, parsed.data.contentType);
    const { data, error } = await supabase.storage.from(EVIDENCE_BUCKET).createSignedUploadUrl(path);
    if (error || !data) return NextResponse.json({ error: "Private upload storage is not ready yet." }, { status: 503 });

    return NextResponse.json({ bucket: EVIDENCE_BUCKET, path, token: data.token, signedUrl: data.signedUrl, expiresIn: 7200 });
  } catch {
    return NextResponse.json({ error: "Upload preparation failed." }, { status: 500 });
  }
}
