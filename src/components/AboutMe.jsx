import React from "react";
import { motion } from "framer-motion";

export const AboutMe = ({ aboutRef }) => {
  return (
    <section
      ref={aboutRef}
      id="aboutme"
      className="mt-16 px-6 sm:flex-col sm:justify-center w-full text-primaryText"
    >
      <h2 className="text-xl sm:text-2xl font-bold mb-4">About Me</h2>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 * 0.1 }}
        viewport={{ once: true }}
        className="text-sm sm:text-lg text-primaryText/60"
      >
        I am a student at the University of Windsor, and my goal is to explore
        the world of computer science and software development through practical
        experience. I welcome challenging problems and am always working on
        solving something, whether it be for school or for a personal project. I
        am always looking for new opportunites and experiences to learn and grow
        as a developer.
        <br />
        <br />I have considerable experience with{" "}
        <span className=" text-primaryText">Python, Java and React. </span>
        During my time at <span className=" text-primaryText">Glendor</span>, I
        completed a variety of tasks using Python extensively. I have also
        worked on a few personal projects using React and Java. I am currently
        working on improving my skills in{" "}
        <span className="text-primaryText">React and Full-Stack Web Dev</span>{" "}
        by making{" "}
        <a
          href="https://prototype.datarai.com"
          target="none"
          className="text-primaryText underline"
        >
          Datarai
        </a>{" "}
        as well as future projects.
        <br />
        <br />
        My interests include{" "}
        <span className="text-primaryText">
          Machine Learning/Artificial Intelligence, Web Development, and
          Robotics
        </span>
        . My goals are to work on projects that involve these fields and to
        learn as much as I can about them. I am also looking for startup
        opportunites and ideas.
        <br />
        <br />
        Check out my{" "}
        <a
          href="Aditya_Patel_resume.pdf"
          target="none"
          className="text-m sm:text-lg text-secondaryText/60 hover:text-secondaryText underline"
        >
          resume
        </a>{" "}
        for more information on my skills and experience.
      </motion.div>
    </section>
  );
};
