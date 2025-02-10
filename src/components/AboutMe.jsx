import React from 'react';

export const AboutMe = () => {
    return (
        <section id="aboutme" className="mt-16 px-6 sm:flex-col sm:justify-center w-full text-primaryText">
            <h2 className="text-lg sm:text-2xl font-bold mb-4">About Me</h2>
            <p className="text-sm sm:text-lg text-primaryText/40">
                I am a student at the University of Windsor, and my goal is to explore the world of computer science and 
                software development through practical experience. I welcome challenging problems and am always working 
                on solving something, whether it be for school or for a personal project. I am always looking for new 
                opportunites and experiences to learn and grow as a developer. 

                <br/><br/>

                I have considerable experience with <span className=" text-primaryText">Python, Java and React. </span> 
                During my time at <span className=" text-primaryText">Glendor</span>, I completed a variety of tasks using Python
                extensively. I have also worked on a few personal projects using React and Java. I am currently working on improving
                my skills in <span className="text-primaryText">React and Web Dev</span> by making this personal website.

                <br/><br/>

                Check out my <a href="Aditya_Patel_resume.pdf" target="none" className="text-m sm:text-lg text-secondaryText/60 hover:text-secondaryText underline">resume</a> for more information on my skills and experience. 
                
            </p>
        </section>
    );
};