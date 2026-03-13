import React from "react";
import { motion } from "motion/react";

export const AboutMe = ({ aboutRef }) => {
  return (
    <section
      ref={aboutRef}
      id="aboutme"
      className="w-full text-[var(--text-primary)]"
    >
      <h2 className="section-heading mb-4 text-xl font-bold sm:text-3xl">About Me</h2>
      <div className="flat-accent-line mb-5" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08 }}
        viewport={{ once: true }}
        className="glass-panel rounded-xl border p-6 text-sm leading-7 text-[var(--text-muted)] sm:p-8 sm:text-lg"
      >
        I am a student at the University of Windsor, and my goal is to explore
        the world of computer science and software development through practical
        experience. I welcome challenging problems and am always working on
        solving something, whether it be for school or for a personal project. I
        am always looking for new opportunities and experiences to learn and grow
        as a developer.
        <br />
        <br />I have considerable experience with{" "}
        <span className="font-semibold text-[var(--text-primary)]">Python, React, and Automation. </span>
        Currently, I am working as a Network Automation & Operations Intern at <span className="font-semibold text-[var(--text-primary)]">Enbridge</span>, 
        where I focus on agentic workflows and network automation.
        Previously, during my time at <span className="font-semibold text-[var(--text-primary)]">Glendor</span>, I
        worked extensively with Python and LLMs. I am also continuously working on improving my skills in{" "}
        <span className="font-semibold text-[var(--text-primary)]">React and Full-Stack Web Dev</span>{" "}
        by building out modern, interactive personal projects.
        <br />
        <br />
        My interests include{" "}
        <span className="font-semibold text-[var(--text-primary)]">
          Agentic Workflows, Machine Learning/Artificial Intelligence, and Web Development
        </span>
        . My goals are to work on projects that involve these fields and to
        learn as much as I can about them. I am also looking for startup
        opportunities and ideas.
        <br />
        <br />
        Check out my{" "}
        <a
          href="Aditya_Patel_resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-m text-[var(--text-muted)] underline decoration-[var(--accent-strong)] decoration-2 underline-offset-4 transition-colors duration-200 hover:text-[var(--text-primary)] sm:text-lg"
        >
          resume
        </a>{" "}
        for more information on my skills and experience.
      </motion.div>
    </section>
  );
};
