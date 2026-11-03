import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "winnie-career-platform",
    mode: "demo",
    timestamp: new Date().toISOString(),
  });
}
