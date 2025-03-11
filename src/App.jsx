import "./App.css";

import React from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import { AboutMe } from "./components/AboutMe";
import { Projects } from "./components/Projects";
import Skills from "./components/Skills";

function App() {
  const aboutRef = React.useRef(null);
  const skillRef = React.useRef(null);
  const projectRef = React.useRef(null);
  return (
    <div className="">
      <Navbar />
      <div className="flex flex-col items-center cursor-default">
        <Hero />
        <div className="flex justify-center sm:w-10/12 mb-12">
          <AboutMe className="" aboutRef={aboutRef} />
        </div>
        <div id="projects" className="flex justify-center sm:w-10/12 mb-12">
          <Projects projectRef={projectRef} />
        </div>
        <div className="flex justify-center sm:w-10/12 mb-12">
          <Skills skillRef={skillRef} />
        </div>
        <div className="flex justify-center">
          <p className="text-primaryText ">© {new Date().getFullYear()} Aditya Patel ❤️</p>
        </div>
      </div>
    </div>
  );
}

export default App;
