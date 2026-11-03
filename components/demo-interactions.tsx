"use client";

import { useState } from "react";
import { Check, ChevronRight, Send, Sparkles } from "lucide-react";

export function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("Product design");
  const [evidence, setEvidence] = useState("I have completed two course projects and want feedback on how to make the work stronger.");
  const [weeklyHours, setWeeklyHours] = useState("3–5 hours");
  const [nextOutcome, setNextOutcome] = useState("A portfolio piece I can stand behind");
  const [employerVisibility, setEmployerVisibility] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "auth" | "error">("idle");
  const options = [
    ["Product design", "Shape useful experiences and interfaces."],
    ["Software development", "Turn ideas into reliable products."],
    ["Growth & marketing", "Find the signal behind the story."],
  ];

  async function savePathway() {
    setSaveState("saving");
    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole: role, evidence, weeklyHours, nextOutcome, employerVisibility }),
      });
      if (response.status === 401) setSaveState("auth");
      else if (!response.ok) setSaveState("error");
      else setSaveState("saved");
    } catch {
      setSaveState("error");
    }
    setSubmitted(true);
  }

  if (submitted) return <div className="card card-pad animate-in"><span className={`pill ${saveState === "saved" ? "pill-mint" : "pill-amber"}`}>{saveState === "saved" ? <Check size={13} /> : <Sparkles size={13} />} {saveState === "saved" ? "Saved to your account" : "Demo pathway ready"}</span><h2 style={{ fontSize: 32, marginTop: 16 }}>{saveState === "auth" ? "Sign in to save this pathway." : saveState === "error" ? "The pathway could not be saved yet." : "Your first direction is clear enough to start."}</h2><p className="muted" style={{ marginTop: 10, lineHeight: 1.55 }}>{saveState === "saved" ? "Your private profile, pathway assignment, task sequence and consent preference were recorded in Supabase." : saveState === "auth" ? "The public walkthrough stays safe and does not create a user record. Sign in when you want to save the pathway to your private account." : saveState === "error" ? "Please try again or continue through the public demo while the account service recovers." : "The demo keeps the next step visible without creating a user record."}</p><div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 22 }}><a className="button button-primary" href={saveState === "auth" ? "/auth/sign-in" : "/dashboard"}>{saveState === "auth" ? "Sign in to save" : "Open your dashboard"} <ChevronRight size={16} /></a>{saveState === "auth" && <a className="button button-secondary" href="/auth/sign-up">Create account</a>}</div></div>;

  return <div className="card card-pad">
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}><span className="eyebrow">Step {step} of 3</span><span className="muted" style={{ fontSize: 12 }}>Demo mode or signed-in save</span></div>
    {step === 1 && <><h2 style={{ fontSize: 34, marginTop: 14 }}>What kind of work are you moving toward?</h2><p className="muted" style={{ marginTop: 9, lineHeight: 1.5 }}>Choose a direction, not a permanent identity. The platform uses it to shape your first evidence path.</p><div className="option-grid" style={{ marginTop: 22 }}>{options.map(([title, desc]) => <button type="button" key={title} className={`option ${role === title ? "selected" : ""}`} onClick={() => setRole(title)}><strong>{title}</strong><span>{desc}</span></button>)}</div></>}
    {step === 2 && <><h2 style={{ fontSize: 34, marginTop: 14 }}>What evidence do you already have?</h2><p className="muted" style={{ marginTop: 9, lineHeight: 1.5 }}>A real starting point helps the pathway meet you where you are.</p><div className="form-grid" style={{ marginTop: 22 }}><div className="field full"><label htmlFor="evidence">Tell us in a few sentences</label><textarea id="evidence" value={evidence} onChange={(event) => setEvidence(event.target.value)} /></div><div className="field"><label htmlFor="time">Time per week</label><select id="time" value={weeklyHours} onChange={(event) => setWeeklyHours(event.target.value)}><option>1–2 hours</option><option>3–5 hours</option><option>6+ hours</option></select></div><div className="field"><label htmlFor="goal">Your next outcome</label><input id="goal" value={nextOutcome} onChange={(event) => setNextOutcome(event.target.value)} /></div></div></>}
    {step === 3 && <><h2 style={{ fontSize: 34, marginTop: 14 }}>Make your visibility choice</h2><p className="muted" style={{ marginTop: 9, lineHeight: 1.5 }}>Employer visibility is opt-in. Nothing becomes shareable without your explicit consent.</p><div style={{ marginTop: 22, background: "var(--surface-soft)", borderRadius: 15, padding: 18 }}><strong style={{ fontSize: 13 }}>Private by default</strong><p className="muted" style={{ marginTop: 7, lineHeight: 1.5, fontSize: 13 }}>Your onboarding answers and draft work stay private. You can later choose which portfolio pieces and endorsements to share.</p></div><label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 18, fontSize: 13, lineHeight: 1.45 }}><input type="checkbox" checked={employerVisibility} onChange={(event) => setEmployerVisibility(event.target.checked)} /> <span>I want to allow future consent-scoped employer profile sharing.</span></label></>}
    <div className="form-actions"><button type="button" className="button button-quiet button-sm" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>Back</button><button type="button" className="button button-primary button-sm" disabled={saveState === "saving"} onClick={() => step === 3 ? savePathway() : setStep(step + 1)}>{saveState === "saving" ? "Saving…" : step === 3 ? "Save pathway" : "Continue"} <ChevronRight size={15} /></button></div>
  </div>;
}

export function ReviewActions() {
  const [state, setState] = useState<"idle" | "saved" | "endorsed">("idle");
  return <div style={{ display: "flex", gap: 9, flexWrap: "wrap", marginTop: 22 }}><button className="button button-secondary button-sm" onClick={() => setState("saved")}><Send size={14} /> Request changes</button><button className="button button-primary button-sm" onClick={() => setState("endorsed")}><Sparkles size={14} /> {state === "endorsed" ? "Endorsement drafted" : "Approve & endorse"}</button>{state === "saved" && <span className="pill pill-amber">Feedback saved for Amina</span>}{state === "endorsed" && <span className="pill pill-mint"><Check size={13} /> Skill-linked endorsement ready</span>}</div>;
}

export function ProgressPulse({ value }: { value: number }) {
  const [active, setActive] = useState(false);
  return <button type="button" aria-label="Preview progress motion" onClick={() => setActive(!active)} className="progress-bar" style={{ border: 0, width: "100%", cursor: "pointer" }}><span style={{ width: `${value}%`, transform: active ? "scaleX(1.03)" : undefined, transformOrigin: "left", transition: "transform .5s ease" }} /></button>;
}
