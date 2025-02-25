import React from "react";
import ChopChop from "../assets/ChopChop.png";
import EcoWatch from "../assets/EcoWatch.png";
import Orrery from "../assets/Orrery.png";
import Remora from "../assets/Remora.png";
import Datarai from "../assets/Datarai.png";

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

  return (
    <div className="bg-background2/30 rounded-2xl pb-4">
      {image && (
        <>
          <div
            className={
              "flex justify-center h-48 w-full mb-4 rounded-t-2xl " +
              imageColor
            }
          >
            <img src={image} alt={title} className="object-scale-down" />
          </div>
        </>
      )}
      <div className="px-8 py-2">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-primaryText/75">{techStack}</p>
        {showDesc ? (
          <>
            <p className="text-primaryText/40 mt-8">{desc}</p>
            <p
              className="test-primaryText underline hover:cursor-pointer"
              onClick={toggleDesc}
            >
              Show Less
            </p>
          </>
        ) : (
          <>
            <p className="text-primaryText/40 mt-8">{shortDesc}</p>
            <p
              className="test-primaryText underline hover:cursor-pointer"
              onClick={toggleDesc}
            >
              Show More
            </p>
          </>
        )}

        <div className="flex flex-col gap-0 mt-4">
          {githubLink && (
            <a
              href={githubLink}
              target="none"
              className="text-m sm:text-l text-secondaryText/60 hover:text-secondaryText underline"
            >
              -{">"} Github
            </a>
          )}
          {webappLink && (
            <a
              href={webappLink}
              target="none"
              className="text-m sm:text-l text-secondaryText/60 hover:text-secondaryText underline"
            >
              -{">"} Webapp
            </a>
          )}
          {videoLink && (
            <a
              href={videoLink}
              target="none"
              className="text-m sm:text-l text-secondaryText/60 hover:text-secondaryText underline"
            >
              -{">"} Demo Video
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export const Projects = () => {
  return (
    <section
      id="projects"
      className="mt-16 px-6 sm:flex-col sm:justify-center w-full text-primaryText"
    >
      <h2 className="text-lg sm:text-2xl font-bold mb-4">Projects</h2>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ProjectCard
          title="Datarai"
          desc="An AI powered web app for analyizing and visualizing data. (In progress)"
          shortDesc="An AI powered web app..."
          techStack="React, Vite, Firebase, Tailwind CSS, Git, Gemini API, Google Cloud"
          githubLink="https://github.com/Champion2005/Datarai"
          webappLink="https://datarai.com"
          image={Datarai}
          imageColor="bg-amber-50"
        />
        <ProjectCard
          title="Chop Chop"
          desc="Engaging fullstack web app designed for studying. With a features like a flashcard tool (you can create flashcard sets and use them to study), as well as a todo list and challenging quizzes to help you prepare. Gain points by using the site and unlock achievements."
          shortDesc="Engaging fullstack web app..."
          techStack="React, Vite, Firebase, HTML/CSS, Git"
          githubLink="https://github.com/Kataray/Winhacks2025"
          webappLink="https://winhacks-2025.web.app/"
          videoLink="https://youtu.be/n42aaKRyois"
          image={ChopChop}
          imageColor="bg-amber-100"
        />
        <ProjectCard
          title="Orrery, or Are We?"
          desc="Made for NASA Space Apps, this project is an interactive webapp with a to scale model of the solar system and accurate orbit simulation."
          shortDesc="Made for NASA Space Apps..."
          techStack="ThreeJS, TypeScript, Vite, Firebase, HTML/CSS, Git"
          githubLink="https://github.com/jwlebert/spaceapps-2024"
          webappLink="https://spaceapps-2024.web.app/"
          videoLink="https://youtu.be/dSeUayV1NOw"
          image={Orrery}
          imageColor="bg-amber-300"
        />
        <ProjectCard
          title="EcoWatch"
          desc="Made for Winhacks 2024, this is a social networking app with a focus on inspiring community oriented enviormental activism by creating community challenges and leaderboards."
          shortDesc="Made for Winhacks 2024..."
          techStack="React, Vite, Firebase, Tailwind CSS, Git"
          githubLink="https://github.com/jwlebert/EcoWatch"
          webappLink="https://ecowatch-c3a72.web.app/"
          image={EcoWatch}
          imageColor="bg-amber-700"
        />
        <ProjectCard
          title="Remora"
          desc="Interpreted programming language with basic features such as strings, arrays and functions."
          shortDesc="Interpreted programming language..."
          techStack="Python"
          githubLink="https://github.com/Champion2005/Remora"
          image={Remora}
          imageColor="bg-amber-900"
        />
      </section>
    </section>
  );
};
