import { motion, useMotionValue, useSpring } from "motion/react";
import { FaArrowDown } from "react-icons/fa";
import { useRef } from "react";

const Hero = () => {
  const buttonRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 220, damping: 16, mass: 0.25 });
  const smoothY = useSpring(mouseY, { stiffness: 220, damping: 16, mass: 0.25 });

  const handleMouseMove = (event) => {
    if (!buttonRef.current) {
      return;
    }

    const rect = buttonRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    mouseX.set(x * 0.12);
    mouseY.set(y * 0.12);
  };

  const resetMouse = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden pt-24 sm:pt-28">
      <div className="mx-auto w-full py-20">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,var(--hero-glow),transparent_70%)]" />

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="relative z-10 mx-auto max-w-4xl text-center"
        >
          <h1 className="section-heading pb-6 text-4xl font-extrabold md:text-6xl lg:text-7xl text-[var(--text-primary)]">
            Hi, I'm Aditya Patel
          </h1>

          <div className="mx-auto mb-6 h-1 w-24 rounded-full bg-[var(--accent)]/85" />

          <p className="mb-4 text-xl text-[var(--text-primary)]/85 md:text-2xl">
            3rd year CS student, aspiring Full-Stack Engineer
          </p>

          <p className="mb-10 text-lg text-[var(--text-muted)]">
            Based in Windsor, ON <span className="text-[var(--text-primary)]">🍁</span>
          </p>

          <div className="flex justify-center">
            <motion.button
              ref={buttonRef}
              style={{ x: smoothX, y: smoothY }}
              onMouseMove={handleMouseMove}
              onMouseLeave={resetMouse}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group relative inline-flex items-center gap-2 rounded-lg border border-[var(--border-soft)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.07em] text-[var(--text-primary)] shadow-[0_10px_20px_rgba(47,69,80,0.12)] transition-all duration-300 hover:border-[var(--border-strong)]"
              onClick={() => {
                document
                  .getElementById("projects")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span className="absolute inset-0 -z-10 rounded-lg bg-[var(--accent)]/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              View my work
              <FaArrowDown className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-[2px]" />
            </motion.button>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {[
              "React",
              "Full-Stack",
              "AI Projects",
              "Cloud",
            ].map((tag, index) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.3 + index * 0.08 }}
                className="rounded-md border border-[var(--border-soft)] bg-[var(--surface-soft)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)] shadow-[0_6px_10px_rgba(47,69,80,0.06)]"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
