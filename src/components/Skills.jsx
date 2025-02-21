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
  { category: "Backend", skills: ["Firebase Auth", "Supabase Auth"] },
  { category: "Database", skills: ["Firebase Real-time Database", "Supabase", "SQL"] },
  { category: "Dev Tools", skills: ["Git", "Linux", 'Google Cloud', 'AWS'] },
  // Add more categories and skills as needed
];

const Skills = () => {
  return (
    <div id="skills" className="mt-4 px-6 sm:flex-col sm:justify-center w-full text-primaryText">
      <h2 className="text-2xl font-bold mb-4">Technical Skills</h2>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {skillsData.map((skillCategory, index) => (
          <div
            key={index}
            className="w-full bg-background2/30 shadow-md rounded-2xl p-4"
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
      </div>
    </div>
  );
};

export default Skills;
