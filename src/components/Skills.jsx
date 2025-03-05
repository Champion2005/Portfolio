import React from "react";

import ReactIcon from "/assets/react.svg";
import TailwindIcon from "/assets/tailwind.svg";
import NodeIcon from "/assets/node.svg";
import FirebaseIcon from "/assets/firebase.svg";
import GitIcon from "/assets/git.svg";
import ViteIcon from "/assets/vite.svg";
import GCPIcon from "/assets/gcp.svg";
import PythonIcon from "/assets/python.svg";

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
      className="mt-4 px-6 sm:flex-col sm:justify-center w-screen text-primaryText"
    >
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Technical Skills</h2>
      <h3 className="text-lg sm:text-xl font-bold">Main Skills</h3>
      <p className="text-primaryText/50 mb-4">
        These are my most used technologies
      </p>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
      </section>
      <h3 className="text-lg sm:text-xl font-bold mt-4">All Skills</h3>
      <p className="text-primaryText/50 mb-4">
        These are all the technologies I am familiar with
      </p>
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {skillsData.map((skillCategory, index) => (
          <div
            key={index}
            className="bg-background2/30 shadow-md rounded-2xl px-6 py-4 h-60"
          >
            <h3 className="text-xl font-semibold mb-2">
              {skillCategory.category}
            </h3>
            <ul className="list-disc list-inside">
              {skillCategory.skills.map((skill, idx) => (
                <li key={idx}>{skill}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </section>
  );
};

export default Skills;
