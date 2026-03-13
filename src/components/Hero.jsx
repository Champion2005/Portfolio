import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { FaArrowDown } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";

const Hero = () => {
  const roles = [
    "Full-Stack Engineer",
    "AI Engineer",
    "Founder",
    "Network Engineer",
    "Automation Engineer",
  ];

  const [roleIndex, setRoleIndex] = useState(0);
  const [isRoleHovered, setIsRoleHovered] = useState(false);
  const buttonRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 220, damping: 16, mass: 0.25 });
  const smoothY = useSpring(mouseY, { stiffness: 220, damping: 16, mass: 0.25 });

  useEffect(() => {
    if (isRoleHovered) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2000);

    return () => window.clearInterval(intervalId);
  }, [isRoleHovered, roles.length]);

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
          <h1 className="section-heading pb-6 text-3xl font-extrabold md:text-4xl lg:text-6xl text-[var(--text-primary)]">
            Hi, I'm Aditya Patel
          </h1>

          <div className="mx-auto mb-6 h-1 w-[75%] rounded-full bg-[var(--accent)]/40" />

          <p className="mb-4 text-2xl md:text-3xl lg:text-4xl">
            <p className="text-sm text-[var(--text-primary)]/85 md:text-lg">
              Aspiring
            </p>
            <span
              className="relative inline-block h-[1.6em] min-w-[20ch] overflow-hidden align-top text-center leading-[1.25]"
              onMouseEnter={() => setIsRoleHovered(true)}
              onMouseLeave={() => setIsRoleHovered(false)}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={roles[roleIndex]}
                  initial={{ y: -16, opacity: 0, filter: "blur(4px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: 16, opacity: 0, filter: "blur(4px)" }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap bg-clip-text pb-[0.08em] font-semibold leading-[1.25] text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(95deg, var(--accent-strong) 0%, var(--accent) 52%, #74aecd 100%)",
                  }}
                >
                  {roles[roleIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </p>

          <div className="mb-2 space-y-1">
            <p className="text-xl text-[var(--text-primary)]/85 md:text-2xl">
              3rd year CS student
            </p>
          </div>

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

        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
