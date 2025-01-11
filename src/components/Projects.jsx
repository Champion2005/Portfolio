import React from "react";

export const Projects = () => {
    return (
        <section
            id="projects"
            className="mt-16 px-6 sm:flex-col sm:justify-center max-w-11/12 text-primaryText"
        >
            <h2 className="text-lg sm:text-2xl font-bold mb-4">Projects</h2>

            <section className="grid grid-cols-2 gap-4">
                <div className="bg-background2/30 p-8 rounded-2xl hover:scale-[102%] hover:bg-background2/40">
                    <h3 className="text-lg font-bold">Orrery, Or Are We?</h3>
                    <p className="text-primaryText/75">Typescript, Three.js, Firebase</p>
                    <p className="text-primaryText/40 mt-8">Made for NASA Space Apps, this project is an interactive 
                    webapp with a to scale model of the solar system and accurate orbit simulation.</p>

                    <div className="flex flex-col gap-0">
                        <a href="https://github.com/jwlebert/spaceapps-2024" target="none" className="mt-3 text-m sm:text-l text-secondaryText/60 hover:text-secondaryText underline">-{'>'} Github</a>
                        <a href="https://spaceapps-2024.web.app/" target="none" className="text-m sm:text-l text-secondaryText/60 hover:text-secondaryText underline">-{'>'} Webapp</a>
                    </div>
                </div>
                <div className="bg-background2/30 p-8 rounded-2xl hover:scale-[102%] hover:bg-background2/40">
                    <h3 className="text-lg font-bold">EcoWatch</h3>
                    <p className="text-primaryText/75">React, TailwindCSS, Firebase</p>
                    <p className="text-primaryText/40 mt-8">Made for Winhacks 2024, this is a social networking app with 
                    a focus on inspiring community oriented enviormental activism by creating community challenges and
                    leaderboards.</p>

                    <div className="flex flex-col gap-0">
                        <a href="https://github.com/jwlebert/EcoWatch" target="none" className="mt-3 text-m sm:text-l text-secondaryText/60 hover:text-secondaryText underline">-{'>'} Github</a>
                        <a href="https://ecowatch-c3a72.web.app/" target="none" className="text-m sm:text-l text-secondaryText/60 hover:text-secondaryText underline">-{'>'} Webapp</a>
                    </div>
                </div>
                <div className="bg-background2/30 p-8 rounded-2xl hover:scale-[102%] hover:bg-background2/40">
                    <h3 className="text-lg font-bold">Remora</h3>
                    <p className="text-primaryText/75">Python</p>
                    <p className="text-primaryText/40 mt-8">Interpreted programming language with basic features such as 
                    strings, arrays and functions.</p>

                    <div className="flex flex-col gap-0">
                        <a href="https://github.com/Champion2005/Remora" target="none" className="mt-3 text-m sm:text-l text-secondaryText/60 hover:text-secondaryText underline">-{'>'} Github</a>
                    </div>
                </div>
            </section>
        </section>
    );
};
