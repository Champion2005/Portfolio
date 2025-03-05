import './App.css'

import { Intro } from './components/Intro'
import { AboutMe } from './components/AboutMe'
import { Projects } from './components/Projects'
import Skills from './components/Skills'

function App() {

  return (
    <div className='flex flex-col items-center'>
      <>
      <div className="lg:flex justify-center sm:w-10/12 mb-12">
        <Intro className=""/>
        <div className="">
          <AboutMe className="" />
        </div>
      </div>
      <div className="flex justify-center sm:w-10/12 mb-12">
        <Projects />
      </div>
      <div className="flex justify-center sm:w-10/12 mb-12">
        <Skills />
      </div>
      <div className="flex justify-center">
        <p className="text-white/40 ">© 2025 Aditya Patel ❤️</p>
      </div>
      </>
    </div>
  )
}

export default App
