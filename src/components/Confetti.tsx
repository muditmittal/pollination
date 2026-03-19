"use client";

import { useEffect, useState } from "react";

const COLORS = [
  "#bef264", // lime
  "#a78bfa", // violet
  "#f472b6", // pink
  "#38bdf8", // sky
  "#fbbf24", // amber
  "#34d399", // emerald
  "#fb923c", // orange
];

interface Particle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  shape: "square" | "circle" | "line";
}

export default function Confetti({ trigger }: { trigger: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!trigger) return;

    const newParticles: Particle[] = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.8,
      duration: 1.5 + Math.random() * 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 6 + Math.random() * 8,
      shape: (["square", "circle", "line"] as const)[
        Math.floor(Math.random() * 3)
      ],
    }));

    setParticles(newParticles);

    const timer = setTimeout(() => setParticles([]), 4000);
    return () => clearTimeout(timer);
  }, [trigger]);

  if (particles.length === 0) return null;

  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            top: `-10px`,
            width: p.shape === "line" ? `${p.size * 0.4}px` : `${p.size}px`,
            height: p.shape === "line" ? `${p.size * 1.5}px` : `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: p.shape === "circle" ? "50%" : "2px",
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </>
  );
}
