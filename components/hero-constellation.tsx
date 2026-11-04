"use client";

import { useState, type CSSProperties, type PointerEvent } from "react";

type Tilt = { x: number; y: number };

export function HeroConstellation() {
  const [tilt, setTilt] = useState<Tilt>({ x: 9, y: -12 });

  function move(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * -16;
    setTilt({ x: Math.max(-8, Math.min(18, 9 + y)), y: Math.max(-22, Math.min(8, -12 + x)) });
  }

  return <div className="constellation-wrap" aria-label="Interactive 3D progression constellation" role="img" onPointerMove={move} onPointerLeave={() => setTilt({ x: 9, y: -12 })}>
    <div className="constellation" style={{ "--tilt-x": `${tilt.x}deg`, "--tilt-y": `${tilt.y}deg` } as CSSProperties}>
      <div className="node node-1" /><div className="node node-2" /><div className="node node-3" /><div className="node node-4" /><div className="node node-5" />
      <div className="orbit-card card-a"><span className="eyebrow">Start here</span><strong>Find the gap</strong><span>Current state → target role</span></div>
      <div className="orbit-card card-b"><span className="eyebrow">Evidence</span><strong>Show the work</strong><span>Projects, not promises</span></div>
      <div className="orbit-card card-c"><span className="eyebrow">Human signal</span><strong>Earn the nod</strong><span>Feedback with context</span></div>
      <div className="orbit-card card-d"><span className="eyebrow">Visibility</span><strong>Choose the audience</strong><span>Consent before sharing</span></div>
    </div>
  </div>;
}
