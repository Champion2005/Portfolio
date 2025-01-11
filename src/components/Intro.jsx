import React from 'react';

export const Intro = () => {
    return (
        <section id="leftMenu" className="mt-16 px-6 sm:flex sm:min-w-2/5 sm:justify-center text-primaryText">
            <div className="sm:min-w-3/4">
                
                <h1 className="text-4xl sm:text-5xl font-extrabold pb-2">Aditya Patel</h1>
                <p className="text-l sm:text-xl text-primaryText">
                    <b>2nd</b> year CS student, aspiring SWE
                </p>

                <p className="mt-6 text-sm sm:text-base text-primaryText/75">
                    📍Based in Windsor, ON. 🍁
                </p>

                <div className="flex flex-col gap-0">
                    <a href="https://github.com/Champion2005" target="none" className="mt-3 text-m sm:text-l text-secondaryText/60 hover:text-secondaryText underline">-{'>'} Github</a>
                    <a href="https://www.linkedin.com/in/aditya-patel52/" target="none" className="text-m sm:text-l text-secondaryText/60 hover:text-secondaryText underline">-{'>'} LinkedIn</a>
                    <a href="Aditya_Patel_resume.pdf" target="none" className="text-m sm:text-l text-secondaryText/60 hover:text-secondaryText underline">-{'>'} Resume</a>
                </div>
            </div>
        </section>
    );
};