import './App.css'

import { Intro } from './components/Intro'
import { AboutMe } from './components/AboutMe'
import { Projects } from './components/Projects'

function App() {

  return (
    <div className='flex flex-col items-center'>
      <>
      <div className="md:flex max-w-screen">
        <Intro className="w-1/2"/>
        <div className="mb-16">
          <AboutMe className="" />
        </div>
      </div>
      <div className="flex justify-center sm:w-10/12 mb-12">
        <Projects />
      </div>
      <div className="flex justify-center">
        <p className="text-white/40 ">© 2025 Aditya Patel ❤️</p>
      </div>
      </>
    </div>
  )
}

export default App
