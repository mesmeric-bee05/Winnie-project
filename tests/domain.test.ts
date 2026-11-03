import { describe, expect, it } from "vitest";
import { mentee, milestones, tasks } from "@/lib/demo";

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
});
