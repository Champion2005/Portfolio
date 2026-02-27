import React from "react";
import ChopChop from "/assets/ChopChop.png";
import EcoWatch from "/assets/EcoWatch.png";
import Orrery from "/assets/Orrery.png";
import Remora from "/assets/Remora.png";
import Datarai from "/assets/Datarai.png";
import AmICooked from "/assets/AmICooked.png";
import NbPull from "/assets/nbpull.png";

import { motion } from "motion/react";
import { FiGithub, FiVideo, FiPackage } from "react-icons/fi";
import { MdOutlineWebAsset } from "react-icons/md";

const ProjectCard = ({
  title,
  desc,
  techStack,
  githubLink,
  webappLink,
  videoLink,
  pypiLink,
  image,
  imageColor,
}) => {
  const [expanded, setExpanded] = React.useState(false);

  techStack = techStack.split(", ");

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.22 }}
      className="group glass-panel overflow-hidden rounded-xl border pb-4"
    >
      {image && (
        <div
          className={
            "relative mb-3 flex h-40 w-full justify-center overflow-hidden rounded-t-xl border-b border-[var(--border-soft)] " +
            imageColor
          }
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5" />
          <img
            src={image}
            alt={title}
            className="object-scale-down transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      )}
      <div className="flex flex-col px-5">
        <h3 className="text-lg font-bold text-[var(--text-primary)]">{title}</h3>
        <div className="min-h-14 pt-1.5">
          <div className="flex flex-wrap gap-1.5">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="cursor-default rounded-lg border border-[var(--border-soft)] bg-[var(--surface-soft)] px-2 py-0.5 text-xs text-[var(--text-muted)] shadow-[0_4px_8px_rgba(47,69,80,0.06)] transition-colors duration-200 hover:border-[var(--border-strong)] sm:text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <p
          className={`mt-3 text-sm text-[var(--text-primary)]/90 transition-all duration-300 ${
            expanded ? "" : "line-clamp-2"
          }`}
        >
          {desc}
        </p>
        <button
          className="mt-1.5 w-fit cursor-pointer text-sm font-medium text-[var(--text-muted)] underline decoration-[var(--border-strong)] underline-offset-4 transition-colors duration-200 hover:text-[var(--text-primary)]"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Show Less" : "Show More"}
        </button>

        <div className="mt-4 flex gap-4 justify-self-end">
          {githubLink && (
            <a
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--text-muted)] transition-all duration-200 hover:-translate-y-0.5 hover:text-[var(--text-primary)] sm:text-base"
            >
              <FiGithub />Code
            </a>
          )}
          {pypiLink && (
            <a
              href={pypiLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--text-muted)] transition-all duration-200 hover:-translate-y-0.5 hover:text-[var(--text-primary)] sm:text-base"
            >
              <FiPackage />PyPI
            </a>
          )}
          {webappLink && (
            <a
              href={webappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--text-muted)] transition-all duration-200 hover:-translate-y-0.5 hover:text-[var(--text-primary)] sm:text-base"
            >
              <MdOutlineWebAsset />Demo
            </a>
          )}
          {videoLink && (
            <a
              href={videoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--text-muted)] transition-all duration-200 hover:-translate-y-0.5 hover:text-[var(--text-primary)] sm:text-base"
            >
              <FiVideo />Video
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export const Projects = ({ projectRef }) => {
  return (
    <section
      ref={projectRef}
      className="w-full text-[var(--text-primary)]"
    >
      <h2 className="section-heading mb-5 text-xl font-bold sm:text-3xl">Personal Projects</h2>
      <div className="flat-accent-line mb-6" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
      >
        <ProjectCard
          index={0}
          title="AmICooked"
          desc="An AI-powered GitHub portfolio auditor designed to give developers a brutally honest reality check on their employability. By analyzing granular account data, the platform determines if a user's career prospects are 'cooked' and provides a personalized roadmap to recovery."
          techStack="React, Vite, Firebase, Tailwind CSS, Github API, OpenRouter API"
          githubLink="https://github.com/Champion2005/amicooked"
          webappLink="https://amicooked-b65b3.web.app/"
          videoLink="https://youtu.be/ahWcLSCP2qk"
          image={AmICooked}
          imageColor="bg-black"
        />
        <ProjectCard
          index={1}
          title="nbpull"
          desc="Read-only CLI tool to pull IPAM data from NetBox. Features async HTTP with automatic pagination, rich table output, batch queries from TOML files, and strict typing with Pydantic v2. Hardcoded to GET-only requests for guaranteed safety."
          techStack="Python, Typer, httpx, Pydantic, Rich"
          githubLink="https://github.com/Champion2005/nbpull"
          pypiLink="https://pypi.org/project/nbpull/"
          image={NbPull}
          imageColor="bg-gray-900"
        />
        <ProjectCard
          index={2}
          title="Datarai"
          desc="An AI-powered full-stack web app for analyzing and visualizing data."
          techStack="React, Vite, Firebase, Tailwind CSS, Gemini API, Google Cloud, Node.js"
          githubLink="https://github.com/Champion2005/Datarai"
          webappLink="https://prototype.datarai.com"
          image={Datarai}
          imageColor="bg-amber-50"
        />
        <ProjectCard
          index={3}
          title="Chop Chop"
          desc="Engaging fullstack web app designed for studying. With features like a flashcard tool (you can create flashcard sets and use them to study), as well as a todo list and challenging quizzes to help you prepare. Gain points by using the site and unlock achievements."
          techStack="React, Vite, Firebase, HTML, CSS"
          githubLink="https://github.com/Kataray/Winhacks2025"
          webappLink="https://winhacks-2025.web.app/"
          videoLink="https://youtu.be/n42aaKRyois"
          image={ChopChop}
          imageColor="bg-amber-100"
        />
        <ProjectCard
          index={4}
          title="Orrery, or Are We?"
          desc="Made for NASA Space Apps, this project is an interactive webapp with a to scale model of the solar system and accurate orbit simulation."
          techStack="ThreeJS, TypeScript, Vite, Firebase, HTML, CSS"
          githubLink="https://github.com/jwlebert/spaceapps-2024"
          webappLink="https://spaceapps-2024.web.app/"
          videoLink="https://youtu.be/dSeUayV1NOw"
          image={Orrery}
          imageColor="bg-amber-300"
        />
        <ProjectCard
          index={5}
          title="EcoWatch"
          desc="Made for Winhacks 2024, this is a social networking app with a focus on inspiring community oriented environmental activism by creating community challenges and leaderboards."
          techStack="React, Vite, Firebase, Tailwind CSS"
          githubLink="https://github.com/jwlebert/EcoWatch"
          webappLink="https://ecowatch-c3a72.web.app/"
          image={EcoWatch}
          imageColor="bg-amber-700"
        />
        <ProjectCard
          index={6}
          title="Remora"
          desc="Interpreted programming language with basic features such as strings, arrays and functions."
          techStack="Python"
          githubLink="https://github.com/Champion2005/Remora"
          image={Remora}
          imageColor="bg-amber-900"
        />
      </motion.div>
    </section>
  );
};
