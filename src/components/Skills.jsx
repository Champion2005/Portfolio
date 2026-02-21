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
    category: "Languages",
    skills: ["Python", "Java", "C++", "C", "Rust", "Lua", "Terraform"],
  },
  {
    category: "Frontend",
    skills: [
      "React",
      "HTML",
      "CSS",
      "Tailwind CSS",
      "JavaScript",
      "TypeScript",
    ],
  },
  {
    category: "Backend",
    skills: ["Node.js", "Express", "Cors", "Axios", "SQL"],
  },
  {
    category: "Dev Tools",
    skills: ["Git", "Linux", "Google Cloud", "Azure", "Firebase", "Docker", "Ansible"],
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
      <h3 className="text-lg font-bold sm:text-xl">Main Skills</h3>
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
