import "./App.css";

import React from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import { AboutMe } from "./components/AboutMe";
import { Projects } from "./components/Projects";
import Skills from "./components/Skills";

import { LuFileText } from "react-icons/lu";
import { FaXTwitter } from "react-icons/fa6";

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
        <div className="w-full flex flex-col justify-between items-center bg-red/80 z-50 border-t h-36">
          <div className="flex grow items-center gap-4">
            <button className="shadow-md border-1 border-primaryText/50 rounded-3xl gap-1 px-2 hover:bg-primaryText/10">
              <a
                className="flex p-2 gap-1 justify-center items-center"
                href="https://x.com/adityapatel0905"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaXTwitter className="h-4 w-4" />
                Contact Me
              </a>
            </button>
          </div>
          <p className="w-full text-primaryText text-center h-6 self-end">
            © {new Date().getFullYear()} Aditya Patel ❤️
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
