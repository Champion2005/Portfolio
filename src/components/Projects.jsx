import React from "react";
import { useAnalytics } from "../hooks/useAnalytics";
import ChopChop from "/assets/ChopChop.png";
import EcoWatch from "/assets/EcoWatch.png";
import Orrery from "/assets/Orrery.png";
import Remora from "/assets/Remora.png";
import Datarai from "/assets/Datarai.png";
import AmICooked from "/assets/AmICooked.png";
import NbPull from "/assets/nbpull.png";
import BotBlocks from "/assets/botblocks.png";
import Reforge from "/assets/reforge.png";
import Gork from "/assets/Gork.png";
import Microtools from "/assets/Microtools.png";

import { motion, AnimatePresence } from "motion/react";
import { FiGithub, FiVideo, FiPackage, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { MdOutlineWebAsset } from "react-icons/md";

const ProjectCard = ({
  title,
  desc,
  techStack,
  githubLink,
  webappLink,
  videoLink,
  pypiLink,
  npmLink,
  image,
  imageColor,
  imageFit = "object-contain",
}) => {
  const { trackEvent } = useAnalytics();
  const [expanded, setExpanded] = React.useState(false);

  const stack = techStack.split(", ");

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
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
            className={`h-full w-full ${imageFit} transition-transform duration-500 group-hover:scale-[1.03]`}
          />
        </div>
      )}
      <div className="flex flex-col px-5">
        <h3 className="text-lg font-bold text-[var(--text-primary)]">{title}</h3>
        <div className="h-16 overflow-hidden pt-1.5">
          <div className="flex flex-wrap content-start gap-1.5">
            {stack.map((tech) => (
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
              onClick={() => trackEvent('project_link_click', { project: title, link_type: 'github' })}
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
              onClick={() => trackEvent('project_link_click', { project: title, link_type: 'pypi' })}
            >
              <FiPackage />PyPI
            </a>
          )}
          {npmLink && (
            <a
              href={npmLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--text-muted)] transition-all duration-200 hover:-translate-y-0.5 hover:text-[var(--text-primary)] sm:text-base"
              onClick={() => trackEvent('project_link_click', { project: title, link_type: 'npm' })}
            >
              <FiPackage />npm
            </a>
          )}
          {webappLink && (
            <a
              href={webappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--text-muted)] transition-all duration-200 hover:-translate-y-0.5 hover:text-[var(--text-primary)] sm:text-base"
              onClick={() => trackEvent('project_link_click', { project: title, link_type: 'website' })}
            >
              <MdOutlineWebAsset />Website
            </a>
          )}
          {videoLink && (
            <a
              href={videoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--text-muted)] transition-all duration-200 hover:-translate-y-0.5 hover:text-[var(--text-primary)] sm:text-base"
              onClick={() => trackEvent('project_link_click', { project: title, link_type: 'video' })}
            >
              <FiVideo />Video
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
};

const projectsData = [
  {
    title: "AmICooked",
    desc: "An AI-powered GitHub portfolio auditor designed to give developers a brutally honest reality check on their employability. By analyzing granular account data, the platform determines if a user's career prospects are 'cooked' and provides a personalized roadmap to recovery.",
    techStack: "React, Vite, Firebase, Tailwind CSS, Github API, OpenRouter API",
    githubLink: "https://github.com/Champion2005/amicooked",
    webappLink: "https://amicooked-b65b3.web.app/",
    videoLink: "https://youtu.be/ahWcLSCP2qk",
    image: AmICooked,
    imageColor: "bg-black",
  },
  {
    title: "Microtools & MCP Server",
    desc: "A suite of browser-local utilities designed for privacy and speed, featuring JSON diffing, image batch-resizing, and CSV conversions. Extended with a standalone Model Context Protocol (MCP) server, exposing these capabilities directly to AI agents. Built to eliminate external API reliance, demonstrating expertise in secure, offline-first architectures and emerging AI integration standards.",
    techStack: "React, Node.js, MCP SDK, Vite, Tailwind CSS",
    githubLink: "https://github.com/Champion2005/microtools",
    webappLink: "https://microtools.apatel.xyz",
    image: Microtools,
    imageColor: "bg-slate-900",
    imageFit: "object-cover",
  },
  {
    title: "Gork",
    desc: "A comprehensive orchestration dashboard for our agentic discord bot that provides real-time telemetry, model usage tracking, and automated audit logging. Features a rich UI for managing AI-driven personas, personal user memories (facts), and usage-based analytics across multiple LLM providers. Built to centralize bot operations with a focus on deep observability and robust AI integrations.",
    techStack: "React, Vite, Discord.js, OpenRouter API, Bun, Tailwind CSS",
    githubLink: "https://github.com/Champion2005/gork",
    webappLink: "https://gork.apatel.xyz",
    image: Gork,
    imageColor: "bg-blue-900",
    imageFit: "object-cover",
  },
  {
    title: "Reforge",
    desc: "An agentic orchestration engine that converts probabilistic LLM outputs into deterministic behavior via native JSON repair (<5ms), semantic clamping, circuit breakers, and multi-hop telemetry. Provides guard() for instant repair and forge() for end-to-end orchestration with auto-retry across 10+ providers. Built with zero dependencies, sub-millisecond performance, and edge-ready runtime support.",
    techStack: "TypeScript, Zod, Vitest, Vite, Node.js, Edge Runtime",
    githubLink: "https://github.com/Champion2005/reforge",
    webappLink: "https://reforge.apatel.xyz",
    npmLink: "https://www.npmjs.com/package/reforge-ai",
    image: Reforge,
    imageColor: "bg-zinc-900",
  },
  {
    title: "BotBlocks",
    desc: "Browser-based robotics simulator with zero-setup, in-browser execution using Three.js and Pyodide. Robots can be given LLM-powered brains via OpenRouter that observe, reason, and act autonomously using tool-calling loops. Includes built-in tools (navigation, vision, motor control), custom tool support, and live AI activity logging.",
    techStack: "React, Three.js, Pyodide, CodeMirror, Tailwind CSS, Vite, OpenRouter API",
    githubLink: "https://github.com/Champion2005/botblocks",
    webappLink: "https://botblocks.apatel.xyz/",
    image: BotBlocks,
    imageColor: "bg-slate-700",
  },
  {
    title: "nbpull",
    desc: "Read-only CLI tool to pull IPAM data from NetBox. Features async HTTP with automatic pagination, rich table output, batch queries from TOML files, and strict typing with Pydantic v2. Hardcoded to GET-only requests for guaranteed safety.",
    techStack: "Python, Typer, httpx, Pydantic, Rich",
    githubLink: "https://github.com/Champion2005/nbpull",
    pypiLink: "https://pypi.org/project/nbpull/",
    image: NbPull,
    imageColor: "bg-taupe-700",
  },
  {
    title: "Datarai",
    desc: "An AI-powered full-stack web app for data analysis and visualization that lets users talk directly to their datasets. Upload CSV or spreadsheet files, ask natural-language questions for statistics and insights, and generate customizable Python visualizations or ready-to-use charts in seconds.",
    techStack: "React, Vite, Firebase, Tailwind CSS, Gemini API, Google Cloud, Node.js",
    githubLink: "https://github.com/Champion2005/Datarai",
    webappLink: "https://prototype.datarai.com",
    image: Datarai,
    imageColor: "bg-amber-50",
  },
  {
    title: "Chop Chop",
    desc: "Engaging fullstack web app designed for studying. With features like a flashcard tool (you can create flashcard sets and use them to study), as well as a todo list and challenging quizzes to help you prepare. Gain points by using the site and unlock achievements.",
    techStack: "React, Vite, Firebase, HTML, CSS",
    githubLink: "https://github.com/Kataray/Winhacks2025",
    webappLink: "https://winhacks-2025.web.app/",
    videoLink: "https://youtu.be/n42aaKRyois",
    image: ChopChop,
    imageColor: "bg-amber-100",
  },
  {
    title: "Orrery, or Are We?",
    desc: "Made for NASA Space Apps, this project is an interactive webapp with a to scale model of the solar system and accurate orbit simulation.",
    techStack: "ThreeJS, TypeScript, Vite, Firebase, HTML, CSS",
    githubLink: "https://github.com/jwlebert/spaceapps-2024",
    webappLink: "https://spaceapps-2024.web.app/",
    videoLink: "https://youtu.be/dSeUayV1NOw",
    image: Orrery,
    imageColor: "bg-amber-500",
  },
  {
    title: "EcoWatch",
    desc: "Made for Winhacks 2024, this is a social networking app with a focus on inspiring community oriented environmental activism by creating community challenges and leaderboards.",
    techStack: "React, Vite, Firebase, Tailwind CSS",
    githubLink: "https://github.com/jwlebert/EcoWatch",
    webappLink: "https://ecowatch-c3a72.web.app/",
    image: EcoWatch,
    imageColor: "bg-amber-700",
  },
  {
    title: "Remora",
    desc: "Interpreted programming language with basic features such as strings, arrays and functions.",
    techStack: "Python",
    githubLink: "https://github.com/Champion2005/Remora",
    image: Remora,
    imageColor: "bg-amber-900",
  },
];

export const Projects = ({ projectRef }) => {
  const [showAll, setShowAll] = React.useState(false);
  const visibleProjects = showAll ? projectsData : projectsData.slice(0, 9);

  return (
    <section
      ref={projectRef}
      id="projects"
      className="w-full text-[var(--text-primary)]"
    >
      <h2 className="section-heading mb-5 text-xl font-bold sm:text-3xl">Personal Projects</h2>
      <div className="flat-accent-line mb-6" />

      <motion.div
        layout
        className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {visibleProjects.map((project, index) => (
            <ProjectCard
              key={project.title}
              {...project}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {projectsData.length > 9 && (
        <div className="mt-10 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAll(!showAll)}
            className="group flex items-center gap-2 rounded-lg border border-[var(--border-soft)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.07em] text-[var(--text-primary)] shadow-[0_10px_20px_rgba(47,69,80,0.12)] transition-all duration-300 hover:border-[var(--border-strong)]"
          >
            {showAll ? (
              <>
                Show Less <FiChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Show More <FiChevronDown className="h-4 w-4" />
              </>
            )}
          </motion.button>
        </div>
      )}
    </section>
  );
};
