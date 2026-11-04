import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { containsMalwareTestMarker, EVIDENCE_BUCKET, evidenceSignatureMatches, isOwnedEvidencePath, verifyRequestSchema } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const rate = checkRateLimit(request, "evidence-verify", 10, 60 * 1000);
    if (!rate.allowed) return rateLimitResponse(rate.retryAfter);
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

    const parsed = verifyRequestSchema.safeParse(await request.json());
    if (!parsed.success || !isOwnedEvidencePath(parsed.data.path, user.id)) return NextResponse.json({ error: "Evidence path is invalid." }, { status: 400 });

    const { data, error } = await supabase.storage.from(EVIDENCE_BUCKET).download(parsed.data.path);
    if (error || !data) return NextResponse.json({ error: "Evidence object was not found." }, { status: 404 });
    const bytes = new Uint8Array(await data.arrayBuffer());
    const reject = async (reason: string) => {
      await supabase.storage.from(EVIDENCE_BUCKET).remove([parsed.data.path]);
      return NextResponse.json({ verified: false, error: reason }, { status: 422 });
    };

    if (bytes.byteLength === 0 || bytes.byteLength > 10 * 1024 * 1024) return reject("Evidence size is outside the allowed range.");
    if (containsMalwareTestMarker(bytes)) return reject("The object was rejected by the malware-safety check.");
    if (!evidenceSignatureMatches(parsed.data.contentType, bytes)) return reject("The file bytes do not match the declared file type.");

    return NextResponse.json({ verified: true, bucket: EVIDENCE_BUCKET, path: parsed.data.path, contentType: parsed.data.contentType, size: bytes.byteLength });
  } catch {
    return NextResponse.json({ error: "Evidence verification failed." }, { status: 500 });
  }
}
