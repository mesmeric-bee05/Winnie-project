export type Status = "complete" | "in-progress" | "locked" | "review";

export type Milestone = {
  id: string;
  label: string;
  title: string;
  description: string;
  status: Status;
  progress: number;
  accent: string;
  tasks: number;
  completedTasks: number;
};

export type Task = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  skill: string;
  time: string;
  status: Status;
  due: string;
  deliverable: string;
};

export const mentee = {
  name: "Amina",
  role: "Product designer",
  target: "Product designer at a mission-led company",
  initials: "AM",
  progress: 42,
  pathway: "From curiosity to craft",
  nextStep: "Turn one user insight into a testable interface",
};

export const milestones: Milestone[] = [
  { id: "01", label: "01", title: "Name the direction", description: "Clarify your target role, context and evidence gap.", status: "complete", progress: 100, accent: "mint", tasks: 3, completedTasks: 3 },
  { id: "02", label: "02", title: "Build the evidence", description: "Complete small, practical projects that prove your craft.", status: "in-progress", progress: 58, accent: "teal", tasks: 5, completedTasks: 3 },
  { id: "03", label: "03", title: "Work with a mentor", description: "Bring your work to someone who has done the job.", status: "review", progress: 12, accent: "amber", tasks: 2, completedTasks: 0 },
  { id: "04", label: "04", title: "Show your progression", description: "Curate a portfolio that gives employers a fuller signal.", status: "locked", progress: 0, accent: "lavender", tasks: 4, completedTasks: 0 },
];

export const tasks: Task[] = [
  { id: "task-01", eyebrow: "Milestone 02 · Research", title: "Map one user tension", description: "Translate a real observation into a concise problem statement and evidence plan.", skill: "Product thinking", time: "45 min", status: "complete", due: "Completed yesterday", deliverable: "A one-page insight map" },
  { id: "task-02", eyebrow: "Milestone 02 · Interface", title: "Turn the insight into a flow", description: "Sketch the smallest useful path from user intent to a meaningful outcome.", skill: "Interaction design", time: "90 min", status: "in-progress", due: "Due in 2 days", deliverable: "A clickable low-fidelity flow" },
  { id: "task-03", eyebrow: "Milestone 02 · Reflection", title: "Write the design rationale", description: "Explain what changed, why it changed and what you would test next.", skill: "Communication", time: "30 min", status: "locked", due: "Unlocks after task 02", deliverable: "A 300-word case note" },
];

export const reviewers = [
  { name: "Wanjiku K.", role: "Senior product designer · Maji Labs", initials: "WK", status: "Available this week", tone: "mint" },
  { name: "David O.", role: "Design lead · Nuru Health", initials: "DO", status: "2 slots open", tone: "teal" },
];

export const endorsements = [
  { skill: "Product thinking", issuer: "Wanjiku K.", note: "Strong instinct for finding the real user tension before reaching for a solution.", date: "18 Oct 2026", tone: "mint" },
  { skill: "Communication", issuer: "Awaiting next review", note: "Complete your design rationale to unlock this evidence review.", date: "Next milestone", tone: "amber" },
];
