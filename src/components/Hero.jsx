import { motion } from "framer-motion";
import { FaArrowDown } from "react-icons/fa";

const Hero = () => {
  return (
    <section className="min-h-screen pt-16 overflow-hidden relative w-full">
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 70 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-3xl mx-auto text-center relative z-10"
        >
          <h1 className="text-4xl md:text-6xl font-bold pb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Hi, I'm Aditya Patel
          </h1>
          <p className="text-xl md:text-2xl text-primaryText/80 mb-4">
            2nd year CS student, aspiring Full-Stack Engineer
          </p>
          <p className="text-lg text-primaryText/60 mb-8">
            Based in Windsor, ON <span className="text-primaryText">🍁</span>
          </p>
          <button
            className="group border-1 border-primaryText/50 rounded-3xl p-3 flex justify-self-center items-center"
            onClick={() => {
              document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            View my work
            <FaArrowDown className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;