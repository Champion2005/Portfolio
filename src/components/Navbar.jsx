import { FiGithub, FiLinkedin } from "react-icons/fi";
import { LuFileText } from "react-icons/lu";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { motion } from "motion/react";

const sections = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
];

const Navbar = ({ theme, onToggleTheme }) => {
  return (
    <nav className="fixed top-4 z-50 w-full px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between rounded-xl border border-[var(--border-soft)] bg-[var(--surface)]/95 px-3 shadow-[0_12px_24px_rgba(47,69,80,0.12)]"
      >
        <div className="hidden items-center gap-1 rounded-lg border border-[var(--border-soft)] bg-[var(--surface-soft)] px-2 py-1 sm:flex">
          {sections.map((section) => (
            <a
              key={section.href}
              href={section.href}
              className="rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)] transition-all duration-200 hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
            >
              {section.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            className="icon-button"
            href="https://github.com/Champion2005"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <FiGithub className="h-5 w-5" />
          </a>

          <a
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-soft)] bg-[var(--surface-soft)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-primary)] shadow-[0_7px_12px_rgba(47,69,80,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-[var(--surface)]"
            href="/Aditya_Patel_resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LuFileText className="h-4 w-4" />
            <span className="hidden sm:inline">Resume</span>
          </a>

          <a
            className="icon-button"
            href="https://www.linkedin.com/in/aditya-patel52/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <FiLinkedin className="h-5 w-5" />
          </a>

          <button
            onClick={onToggleTheme}
            className="icon-button"
            aria-label="Toggle color theme"
            type="button"
          >
            {theme === "dark" ? (
              <MdLightMode className="h-5 w-5" />
            ) : (
              <MdDarkMode className="h-5 w-5" />
            )}
          </button>
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;