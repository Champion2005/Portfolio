import React from "react";

const skillsData = [
  {
    category: "Languages",
    skills: ["Python", "Java", "C++", "C", "Rust", "Lua", "PHP"],
  },
  {
    category: "Frontend",
    skills: [
      "React",
      "HTML",
      "CSS",
      "Tailwind CSS",
      "JavaScript",
      "TypeScript",
    ],
  },
  {
    category: "Backend",
    skills: ["Firebase Authentication", "Firebase Functions", "Node.js"],
  },
  {
    category: "Database",
    skills: ["Firestore Database", "Firebase Real-time Database", "SQL"],
  },
  { category: "Dev Tools", skills: ["Git", "Linux", "Google Cloud", "AWS"] },
];

const Skills = () => {
  return (
    <section
      id="skills"
      className="mt-4 px-6 sm:flex-col sm:justify-center w-screen text-primaryText"
    >
      <h2 className="text-lg sm:text-2xl font-bold mb-4">Technical Skills</h2>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skillsData.map((skillCategory, index) => (
          <div
            key={index}
            className="bg-background2/30 shadow-md rounded-2xl p-4"
          >
            <h3 className="text-xl font-semibold mb-2">
              {skillCategory.category}
            </h3>
            <ul className="list-disc list-inside">
              {skillCategory.skills.map((skill, idx) => (
                <li key={idx}>{skill}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </section>
  );
};

export default Skills;
