import './App.css'

import React from 'react'

import { Intro } from './components/Intro'
import { AboutMe } from './components/AboutMe'
import { Projects } from './components/Projects'
import Skills from './components/Skills'

function App() {
  const aboutRef = React.useRef(null);
  const skillRef = React.useRef(null);
  const projectRef = React.useRef(null);
  return (
    <div className='flex flex-col items-center'>
      <>
      <div className="lg:flex justify-center sm:w-10/12 mb-12">
        <Intro aboutRef={aboutRef} projectRef={projectRef} skillRef={skillRef}/>
        <div className="">
          <AboutMe className="" aboutRef={aboutRef} />
        </div>
      </div>
      <div className="flex justify-center sm:w-10/12 mb-12">
        <Skills skillRef={skillRef} />
      </div>
      <div className="flex justify-center sm:w-10/12 mb-12">
        <Projects projectRef={projectRef} />
      </div>
      <div className="flex justify-center">
        <p className="text-white/40 ">© 2025 Aditya Patel ❤️</p>
      </div>
      </>
    </div>
  )
}

export default App
