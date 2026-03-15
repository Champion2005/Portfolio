import "./App.css";

import React from "react";
import { useAnalytics } from "./hooks/useAnalytics";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import { AboutMe } from "./components/AboutMe";
import { Projects } from "./components/Projects";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import ParticleBackdrop from "./components/ParticleBackdrop";
import { useTheme } from "./hooks/useTheme";

import { FaXTwitter } from "react-icons/fa6";
import { motion } from "motion/react";

const ContactFooterLink = () => {
  const { trackEvent } = useAnalytics();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className="glass-panel flex min-h-28 flex-col items-center justify-between gap-4 rounded-xl border px-6 py-4 sm:flex-row"
    >
      <a
        className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--surface-soft)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-primary)] shadow-[0_8px_14px_rgba(47,69,80,0.1)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent-strong)] hover:bg-[var(--surface)]"
        href="https://x.com/adityapatel0905"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent('social_link_click', { platform: 'twitter', location: 'footer' })}
      >
        <FaXTwitter className="h-4 w-4" />
        Contact Me
      </a>

      <p className="text-center text-sm text-[var(--text-muted)]">
        © {new Date().getFullYear()} Aditya Patel ❤️
      </p>
    </motion.div>
  );
};

function App() {
  const { theme, toggleTheme } = useTheme();
  const aboutRef = React.useRef(null);
  const experienceRef = React.useRef(null);
  const skillRef = React.useRef(null);
  const projectRef = React.useRef(null);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-transparent text-[var(--text-primary)] transition-colors duration-300">
      <div className="pointer-events-none fixed inset-0 z-0">
        <ParticleBackdrop theme={theme} />
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-[var(--orb-purple)] blur-3xl opacity-45" />
        <div className="absolute -right-48 top-44 h-[26rem] w-[26rem] rounded-full bg-[var(--orb-cyan)] blur-3xl opacity-45" />
        <div className="absolute left-1/2 top-[70%] h-80 w-80 -translate-x-1/2 rounded-full bg-[var(--orb-rose)] blur-3xl opacity-30" />
      </div>

      <div className="relative z-10">
        <Navbar theme={theme} onToggleTheme={toggleTheme} />

        <main className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 pb-16 pt-8 sm:px-6 lg:px-8">
          <Hero />

          <motion.div
            id="about"
            className="mb-14 mt-10 w-full scroll-mt-28"
            initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.24 }}
            transition={{ duration: 0.5 }}
          >
            <AboutMe aboutRef={aboutRef} />
          </motion.div>

          <motion.div
            id="experience"
            className="mb-14 w-full scroll-mt-28"
            initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            <Experience experienceRef={experienceRef} />
          </motion.div>

          <motion.div
            id="projects"
            className="mb-14 w-full scroll-mt-28"
            initial={{ opacity: 0, y: 34, scale: 0.985 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.55 }}
          >
            <Projects projectRef={projectRef} />
          </motion.div>

          <motion.div
            id="skills"
            className="mb-12 w-full scroll-mt-28"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.48 }}
          >
            <Skills skillRef={skillRef} />
          </motion.div>
        </main>

        <footer className="mx-auto w-full max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
          <ContactFooterLink />
        </footer>
      </div>
      
      <button
        className="fixed bottom-5 right-5 z-40 rounded-lg border border-[var(--border-soft)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] shadow-[0_8px_14px_rgba(47,69,80,0.14)] transition-all duration-200 hover:-translate-y-1 hover:border-[var(--border-strong)]"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        Top ↑
      </button>
    </div>
  );
}

export default App;
