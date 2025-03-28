import React from "react";
import ChopChop from "/assets/ChopChop.png";
import EcoWatch from "/assets/EcoWatch.png";
import Orrery from "/assets/Orrery.png";
import Remora from "/assets/Remora.png";
import Datarai from "/assets/Datarai.png";

import { motion } from "framer-motion";
import { FiGithub, FiVideo } from "react-icons/fi";
import { MdOutlineWebAsset } from "react-icons/md";

const ProjectCard = ({
  title,
  desc,
  shortDesc,
  techStack,
  githubLink,
  webappLink,
  videoLink,
  image,
  imageColor,
}) => {
  const [showDesc, setShowDesc] = React.useState(false);

  const toggleDesc = () => {
    setShowDesc(!showDesc);
  };

  techStack = techStack.split(", ");

  return (
    <div className="bg-background2/10 shadow-md rounded-2xl pb-4">
      {image && (
        <>
          <div
            className={
              "flex justify-center h-48 w-full mb-4 rounded-t-2xl " + imageColor
            }
          >
            <img src={image} alt={title} className="object-scale-down" />
          </div>
        </>
      )}
      <div className="flex flex-col px-6">
        <h3 className="text-lg font-bold">{title}</h3>
        <div className="min-h-18">
          {
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="text-xs sm:text-sm border-1 shadow-xs border-primaryText/10 px-2 py-1 rounded-xl hover:border-primaryText/20 hover:shadow-sm cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>
          }
        </div>
        {showDesc ? (
          <>
            <p className="text-primaryText mt-4">{desc}</p>
            <p
              className="text-primaryText/40 underline hover:cursor-pointer hover:text-secondaryText"
              onClick={toggleDesc}
            >
              Show Less
            </p>
          </>
        ) : (
          <>
            <p className="text-primaryText mt-4">{shortDesc}</p>
            <p
              className="text-primaryText/40 underline hover:cursor-pointer hover:text-secondaryText"
              onClick={toggleDesc}
            >
              Show More
            </p>
          </>
        )}

        <div className="flex gap-4 mt-4 justify-self-end">
          {githubLink && (
            <a
              href={githubLink}
              target="none"
              className="flex items-center gap-1 text-m sm:text-l text-secondaryText/60 hover:text-secondaryText"
            >
              <FiGithub/>Code
            </a>
          )}
          {webappLink && (
            <a
              href={webappLink}
              target="none"
              className="flex items-center gap-1 text-m sm:text-l text-secondaryText/60 hover:text-secondaryText"
            >
              <MdOutlineWebAsset/>Demo
            </a>
          )}
          {videoLink && (
            <a
              href={videoLink}
              target="none"
              className="flex items-center gap-1 text-m sm:text-l text-secondaryText/60 hover:text-secondaryText"
            >
              <FiVideo/>Video
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export const Projects = ({ projectRef }) => {
  return (
    <section
      ref={projectRef}
      className="mt-16 px-6 sm:flex-col sm:justify-center w-full text-primaryText"
    >
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Personal Projects</h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 * 0.1 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <ProjectCard
          index={0}
          title="Datarai (Prototype)"
          desc="An AI-powered full-stack web app for analyzing and visualizing data."
          shortDesc="An AI-powered full-stack web app..."
          techStack="React, Vite, Firebase, Tailwind CSS, Gemini API, Google Cloud, Node.js"
          githubLink="https://github.com/Champion2005/Datarai"
          webappLink="https://prototype.datarai.com"
          image={Datarai}
          imageColor="bg-amber-50"
        />
        <ProjectCard
          index={1}
          title="Chop Chop"
          desc="Engaging fullstack web app designed for studying. With a features like a flashcard tool (you can create flashcard sets and use them to study), as well as a todo list and challenging quizzes to help you prepare. Gain points by using the site and unlock achievements."
          shortDesc="Engaging web app designed for..."
          techStack="React, Vite, Firebase, HTML, CSS"
          githubLink="https://github.com/Kataray/Winhacks2025"
          webappLink="https://winhacks-2025.web.app/"
          videoLink="https://youtu.be/n42aaKRyois"
          image={ChopChop}
          imageColor="bg-amber-100"
        />
        <ProjectCard
          index={2}
          title="Orrery, or Are We?"
          desc="Made for NASA Space Apps, this project is an interactive webapp with a to scale model of the solar system and accurate orbit simulation."
          shortDesc="Made for NASA Space Apps..."
          techStack="ThreeJS, TypeScript, Vite, Firebase, HTML, CSS"
          githubLink="https://github.com/jwlebert/spaceapps-2024"
          webappLink="https://spaceapps-2024.web.app/"
          videoLink="https://youtu.be/dSeUayV1NOw"
          image={Orrery}
          imageColor="bg-amber-300"
        />
        <ProjectCard
          index={3}
          title="EcoWatch"
          desc="Made for Winhacks 2024, this is a social networking app with a focus on inspiring community oriented enviormental activism by creating community challenges and leaderboards."
          shortDesc="Made for Winhacks 2024..."
          techStack="React, Vite, Firebase, Tailwind CSS"
          githubLink="https://github.com/jwlebert/EcoWatch"
          webappLink="https://ecowatch-c3a72.web.app/"
          image={EcoWatch}
          imageColor="bg-amber-700"
        />
        <ProjectCard
          index={4}
          title="Remora"
          desc="Interpreted programming language with basic features such as strings, arrays and functions."
          shortDesc="Interpreted programming language..."
          techStack="Python"
          githubLink="https://github.com/Champion2005/Remora"
          image={Remora}
          imageColor="bg-amber-900"
        />
      </motion.div>
    </section>
  );
};
