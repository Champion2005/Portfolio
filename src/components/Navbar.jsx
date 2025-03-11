import { FiGithub, FiLinkedin } from "react-icons/fi";
import { LuFileText } from "react-icons/lu";

const Navbar = () => {
    return (
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-sm z-50 border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-center">
          {/* <div className="text-xl font-bold bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-500 bg-clip-text text-transparent">AP</div> */}
          <div className="flex items-center gap-4">
            <button className="shadow-md flex border-1 border-primaryText/50 hover:bg-primaryText/10 rounded-3xl p-2 items-center" >
              <a href="https://github.com/Champion2005" target="_blank" rel="noopener noreferrer">
                <FiGithub className="h-5 w-5" />
              </a>
            </button>
            <button className="shadow-md border-1 border-primaryText/50 rounded-3xl gap-1 px-2 hover:bg-primaryText/10" >
              <a className="flex p-2 gap-1 justify-center items-center" href="/Aditya_Patel_resume.pdf" target="_blank" rel="noopener noreferrer">
                <LuFileText className="h-4 w-4"/>
                Resume
              </a>
            </button>
            <button className="shadow-md flex border-1 border-primaryText/50 hover:bg-primaryText/10 rounded-3xl p-2 items-center" >
              <a href="https://www.linkedin.com/in/aditya-patel52/" target="_blank" rel="noopener noreferrer">
                <FiLinkedin className="h-5 w-5" />
              </a>
            </button>
          </div>
        </div>
      </nav>
    );
  };
  
  export default Navbar;