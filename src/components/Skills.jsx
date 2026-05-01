import React from "react";

import ReactIcon from "/assets/react.svg";
import TailwindIcon from "/assets/tailwind.svg";
import NodeIcon from "/assets/node.svg";
import FirebaseIcon from "/assets/firebase.svg";
import GitIcon from "/assets/git.svg";
import ViteIcon from "/assets/vite.svg";
import GCPIcon from "/assets/gcp.svg";
import PythonIcon from "/assets/python.svg";

import { motion } from "motion/react";
import { FaRobot, FaTerminal, FaWandMagicSparkles, FaMicrochip } from "react-icons/fa6";

const agenticSkills = [
  {
    tech: "Agentic AI",
    icon: <FaRobot className="m-4 h-10 w-10 text-[var(--accent-strong)]" />,
    description: "Building autonomous agents and complex LLM orchestrations."
  },
  {
    tech: "MCP Workflows",
    icon: <FaMicrochip className="m-4 h-10 w-10 text-[var(--accent-strong)]" />,
    description: "Standardizing tool-use via Model Context Protocol."
  },
  {
    tech: "CLI Automation",
    icon: <FaTerminal className="m-4 h-10 w-10 text-[var(--accent-strong)]" />,
    description: "Custom CLI workflows with Copilot and agentic triggers."
  },
  {
    tech: "Prompt Engineering",
    icon: <FaWandMagicSparkles className="m-4 h-10 w-10 text-[var(--accent-strong)]" />,
    description: "Advanced instructions, system prompts, and custom skills."
  },
];

const currentStack = [
  {
    tech: "Python",
    image: PythonIcon,
  },
  {
    tech: "React",
    image: ReactIcon,
  },
  {
    tech: "Tailwind CSS",
    image: TailwindIcon,
  },
  {
    tech: "Node.js",
    image: NodeIcon,
  },
  {
    tech: "Firebase",
    image: FirebaseIcon,
  },
  {
    tech: "Git",
    image: GitIcon,
  },
  {
    tech: "Vite",
    image: ViteIcon,
  },
  {
    tech: "Google Cloud Platform",
    image: GCPIcon,
  },
];

const skillsData = [
  {
    category: "Agentic AI",
    skills: ["Model Context Protocol (MCP)", "Copilot CLI", "Custom Workflows", "Prompt Engineering", "Agentic Skills", "Autonomous Agents", "OpenRouter API", "Gemini API", "Github API"],
  },
  {
    category: "Languages",
    skills: ["Python", "TypeScript", "JavaScript", "SQL", "Lua", "Rust"],
  },
  {
    category: "Frontend",
    skills: [
      "React",
      "Vite",
      "Tailwind CSS",
      "Three.js",
      "HTML",
      "CSS",
    ],
  },
  {
    category: "Backend & Cloud",
    skills: ["Node.js", "Express", "Firebase", "Google Cloud", "Pydantic", "Discord.js", "Bun"],
  },
  {
    category: "Dev Tools",
    skills: ["Git", "Docker", "Azure", "Terraform", "Vitest", "Pyodide"],
  },
];

const Skills = ({ skillRef }) => {
  return (
    <section
      ref={skillRef}
      id="skills"
      className="w-full text-[var(--text-primary)]"
    >
      <h2 className="section-heading mb-4 text-xl font-bold sm:text-3xl">Technical Skills</h2>
      <div className="flat-accent-line mb-6" />
      
      <h3 className="text-lg font-bold sm:text-xl">Agentic AI & LLM Workflows</h3>
      <p className="mb-4 text-[var(--text-muted)]">
        Experience in building autonomous agents and standardizing tool-use via MCP
      </p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        {agenticSkills.map((skill, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="glass-panel flex w-full items-center rounded-xl border px-1"
          >
            {skill.icon}
            <div className="flex flex-col py-4 pr-4">
              <h3 className="text-xl font-semibold text-[var(--text-primary)]">{skill.tech}</h3>
              <p className="text-sm text-[var(--text-muted)]">{skill.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <h3 className="mt-8 text-lg font-bold sm:text-xl">Main Skills</h3>
      <p className="mb-4 text-[var(--text-muted)]">
        These are my most used technologies
      </p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08 }}
        viewport={{ once: true }}
        className="flex flex-wrap justify-center gap-4"
      >
        {currentStack.map((tech, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="glass-panel flex w-full items-center rounded-xl border px-1 sm:basis-[calc(50%-0.5rem)] md:basis-[calc(33.333%-0.75rem)]"
          >
            <img
              src={tech.image}
              alt={tech.tech}
              className="m-4 h-10 w-10 justify-self-start"
            />
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">{tech.tech}</h3>
          </motion.div>
        ))}
      </motion.div>
      <h3 className="mt-6 text-lg font-bold sm:text-xl">All Skills</h3>
      <p className="mb-4 text-[var(--text-muted)]">
        These are all the technologies I am familiar with
      </p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {skillsData.map((skillCategory, index) => (
          <div
            key={skillCategory.category}
            className="glass-panel rounded-xl border px-6 py-4"
          >
            <h3 className="mb-2 text-xl font-semibold text-[var(--text-primary)]">
              {skillCategory.category}
            </h3>

            <ul className="list-disc list-inside space-y-0.5">
              {skillCategory.skills.map((skill, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx, duration: 0.3 }}
                  viewport={{ once: true }}
                  className="text-[var(--text-muted)]"
                >
                  {skill}
                </motion.li>
              ))}
            </ul>
          </div>
        ))}
      </motion.div>
    </section>
  );
};

export default Skills;
