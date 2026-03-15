import React from "react";
import { motion } from "motion/react";
import { FiExternalLink } from "react-icons/fi";

const experiences = [
  {
    company: "Enbridge",
    role: "Network Automation & Operations Intern",
    date: "Jan 2026 – Present",
    current: true,
    url: "https://www.enbridge.com",
    bullets: [],
    tags: ["Python", "Azure", "Terraform", "Ansible", "NetBox IPAM", "Agentic Workflows"],
  },
  {
    company: "Glendor",
    role: "Software Development Intern",
    date: "Jan 2024 – Apr 2024",
    current: false,
    url: "https://www.glendor.com",
    bullets: [
      "Utilized local LLM models to redact personal information in medical documents, achieving 99% accuracy.",
      "Designed automated Python scripts to evaluate model performance, reducing manual validation time by 20+ hours.",
      "Generated custom datasets in Python to test LLM accuracy, ensuring robust evaluation across 500+ files.",
    ],
    tags: ["Python", "LLMs", "NLP"],
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 32, filter: "blur(6px)" },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, delay: 0.15 * i, ease: "easeOut" },
  }),
};

const Experience = ({ experienceRef }) => {
  return (
    <section
      ref={experienceRef}
      id="experience"
      className="w-full text-[var(--text-primary)]"
    >
      <h2 className="section-heading mb-4 text-xl font-bold sm:text-3xl">Technical Experience</h2>
      <div className="flat-accent-line mb-6" />

      {/* Timeline container */}
      <div className="relative ml-4 border-l-2 border-[var(--border-soft)] pl-8 sm:ml-6 sm:pl-10">
        {experiences.map((exp, i) => (
          <motion.div
            key={exp.company}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className={`relative ${i < experiences.length - 1 ? "mb-12" : ""}`}
          >
            {/* Timeline dot */}
            <span
              className={`absolute -left-8 top-2 flex h-3 w-3 -translate-x-1/2 items-center justify-center sm:-left-10 ${
                exp.current ? "animate-pulse" : ""
              }`}
            >
              <span
                className={`block h-3 w-3 rounded-full border-2 border-[var(--accent-strong)] ${
                  exp.current
                    ? "bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]"
                    : "bg-[var(--surface)]"
                }`}
              />
            </span>

            {/* Date label */}
            <span className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
              {exp.date}
              {exp.current && (
                <span className="rounded-full bg-[var(--accent-strong)] px-2.5 py-0.5 text-[0.65rem] font-bold uppercase leading-none tracking-wider text-white">
                  Current
                </span>
              )}
            </span>

            {/* Card */}
            <div className="glass-panel mt-2 rounded-xl border px-5 py-5 transition-all duration-200 hover:border-[var(--border-strong)]">
              {/* Header: company + role */}
              <div className="mb-3">
                <a
                  href={exp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link inline-flex items-center gap-1.5 text-lg font-bold text-[var(--text-primary)] transition-colors duration-200 hover:text-[var(--accent-strong)]"
                >
                  {exp.company}
                  <FiExternalLink className="h-3.5 w-3.5 opacity-0 transition-opacity duration-200 group-hover/link:opacity-100" />
                </a>
                <p className="text-sm font-medium text-[var(--text-muted)]">
                  {exp.role}
                </p>
              </div>

              {/* Bullets or placeholder */}
              {exp.bullets.length > 0 ? (
                <ul className="mb-4 space-y-1.5">
                  {exp.bullets.map((bullet, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2 text-sm leading-relaxed text-[var(--text-muted)]"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mb-4 text-sm italic text-[var(--text-muted)]">
                  Currently contributing to network automation and cloud
                  infrastructure initiatives.
                </p>
              )}

              {/* Tech tags */}
              <div className="flex flex-wrap gap-1.5">
                {exp.tags.map((tag) => (
                  <motion.span
                    key={tag}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.18 }}
                    className="cursor-default rounded-lg border border-[var(--border-soft)] bg-[var(--surface-soft)] px-2 py-0.5 text-xs text-[var(--text-muted)] shadow-[0_4px_8px_rgba(47,69,80,0.06)] transition-colors duration-200 hover:border-[var(--border-strong)] sm:text-sm"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
