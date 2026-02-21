import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const ParticleBackdrop = ({ theme = "light" }) => {
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));

    if (typeof window !== "undefined") {
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      const update = () => setReducedMotion(media.matches);
      update();
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    }
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <Particles
      id="site-particles"
      className="fixed inset-0 h-full w-full"
      options={{
        background: { color: "transparent" },
        fpsLimit: 60,
        detectRetina: true,
        fullScreen: { enable: false },
        particles: {
          color: {
            value:
              theme === "dark"
                ? ["#66a6c4", "#88bdd3", "#a6d2e2"]
                : ["#5a6f79", "#8ec6c3", "#2f4550"],
          },
          links: {
            color: theme === "dark" ? "#7eb4cc" : "#6d828b",
            distance: 140,
            enable: true,
            opacity: theme === "dark" ? 0.34 : 0.34,
            width: 1,
          },
          move: {
            enable: true,
            speed: reducedMotion ? 0.12 : 0.62,
            outModes: { default: "bounce" },
          },
          number: {
            value: reducedMotion ? 40 : 78,
            density: { enable: true, area: 800 },
          },
          opacity: {
            value: { min: 0.18, max: 0.55 },
          },
          shape: { type: ["circle"] },
          size: {
            value: { min: 2.5, max: 4 },
          },
        },
        interactivity: {
          detectsOn: "window",
          events: {
            onHover: {
              enable: !reducedMotion,
              mode: "repulse",
            },
            resize: { enable: true },
          },
          modes: {
            repulse: {
              distance: 95,
              duration: 0.25,
            },
          },
        },
      }}
    />
  );
};

export default ParticleBackdrop;
