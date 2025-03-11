import React from "react";

import ReactIcon from "/assets/react.svg";
import TailwindIcon from "/assets/tailwind.svg";
import NodeIcon from "/assets/node.svg";
import FirebaseIcon from "/assets/firebase.svg";
import GitIcon from "/assets/git.svg";
import ViteIcon from "/assets/vite.svg";
import GCPIcon from "/assets/gcp.svg";
import PythonIcon from "/assets/python.svg";

import { motion } from "framer-motion";

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
    skills: ["Python", "Java", "C++", "C", "Rust", "Lua", "PHP"],
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
    skills: ["Git", "Linux", "Google Cloud", "AWS", "Firebase", "Supabase"],
  },
];

const Skills = ({ skillRef }) => {
  return (
    <section
      ref={skillRef}
      id="skills"
      className="mt-16 px-6 sm:flex-col sm:justify-center w-full text-primaryText"
    >
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Technical Skills</h2>
      <h3 className="text-lg sm:text-xl font-bold">Main Skills</h3>
      <p className="text-primaryText/50 mb-4">
        These are my most used technologies
      </p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 * 0.1 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
      >
        {currentStack.map((tech, index) => (
          <div
            key={index}
            className="bg-background2/30 shadow-md rounded-2xl flex w-full items-center"
          >
            <img
              src={tech.image}
              alt={tech.tech}
              className="h-10 w-10 justify-self-start m-4"
            />
            <h3 className="text-xl font-semibold">{tech.tech}</h3>
          </div>
        ))}
      </motion.div>
      <h3 className="text-lg sm:text-xl font-bold mt-4">All Skills</h3>
      <p className="text-primaryText/50 mb-4">
        These are all the technologies I am familiar with
      </p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 * 0.1 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {skillsData.map((skillCategory, index) => (
          <div className="bg-background2/30 shadow-md rounded-2xl px-6 py-4 h-60">
            <h3 className="text-xl font-semibold mb-2">
              {skillCategory.category}
            </h3>

            <ul className="list-disc list-inside">
              {skillCategory.skills.map((skill, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx, duration: 0.3 }}
                  viewport={{ once: true }}
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
