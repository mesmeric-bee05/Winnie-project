import { describe, expect, it } from "vitest";
import { mentee, milestones, tasks } from "@/lib/demo";
import { containsMalwareTestMarker, createEvidencePath, evidenceSignatureMatches, isOwnedEvidencePath } from "@/lib/storage";

describe("Winnie MVP progression model", () => {
  it("has a target role and visible progress", () => {
    expect(mentee.target.length).toBeGreaterThan(10);
    expect(mentee.progress).toBeGreaterThan(0);
    expect(mentee.progress).toBeLessThan(100);
  });

  it("keeps milestone ordering and task evidence visible", () => {
    expect(milestones.map((milestone) => milestone.id)).toEqual(["01", "02", "03", "04"]);
    expect(tasks.some((task) => task.deliverable.includes("flow"))).toBe(true);
  });

  it("keeps evidence paths scoped to the authenticated owner", () => {
    const owner = "11111111-1111-4111-8111-111111111111";
    const path = createEvidencePath(owner, "case study.pdf", "application/pdf");
    expect(isOwnedEvidencePath(path, owner)).toBe(true);
    expect(isOwnedEvidencePath(path, "22222222-2222-4222-8222-222222222222")).toBe(false);
  });

  it("rejects mismatched evidence bytes and the antivirus test marker", () => {
    expect(evidenceSignatureMatches("application/pdf", new TextEncoder().encode("%PDF-1.7"))).toBe(true);
    expect(evidenceSignatureMatches("image/png", new TextEncoder().encode("%PDF-1.7"))).toBe(false);
    expect(containsMalwareTestMarker(new TextEncoder().encode("$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*"))).toBe(true);
  });
});
