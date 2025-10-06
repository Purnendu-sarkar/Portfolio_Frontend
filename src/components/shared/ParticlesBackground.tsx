"use client";

import { useTheme } from "next-themes";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useEffect, useState } from "react";
import { loadSlim } from "@tsparticles/slim";

export default function ParticlesBackground() {
  const { resolvedTheme } = useTheme();
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (!init) return null;

  const particleColor = resolvedTheme === "dark" ? "#ffffff" : "#000000";

  return (
    <Particles
      id="tsparticles"
      options={{
        background: { color: { value: "transparent" } },
        fpsLimit: 120,
        interactivity: {
          events: {
            onClick: { enable: true, mode: "push" },
            onHover: { enable: true, mode: "repulse" },
          },
          modes: {
            push: { quantity: 2 },
            repulse: { distance: 120, duration: 0.4 },
          },
        },
        particles: {
          number: {
            value: 60,
            density: { enable: true, width: 800, height: 800 },
          },
          color: { value: particleColor },
          links: {
            color: particleColor,
            distance: 150,
            enable: true,
            opacity: 0.4,
            width: 1,
          },
          move: {
            enable: true,
            speed: 2,
            outModes: { default: "bounce" },
          },
          opacity: { value: 0.5 },
          shape: { type: "circle" },
          size: { value: { min: 1, max: 5 } },
        },
        detectRetina: true,
      }}
      className="fixed inset-0 -z-10"
    />
  );
}
