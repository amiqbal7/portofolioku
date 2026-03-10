import { useEffect, useRef, useState } from "react";
import bcr from "../assets/bcr.jpeg";
import netplig from "../assets/netplig.jpeg";
import bcr22 from "../assets/bcr-dsbrd.jpeg";
import tiketku from "../assets/tiketku.png";
import library from "../assets/library.jpeg";
import porto from "../assets/porto.jpg";
import setara from "../assets/setara.jpeg";
import shs from "../assets/shs.png";
import ppni from "../assets/ppni.png";

const projects = [
  {
    src: tiketku,
    title: "Tiketku Flight Booking",
    category: "Web App · React",
    techs: ["React", "Typescript", "Tailwind", "Redux"],
    link: "https://perpustakaan-laravel90.vercel.app/login",
    year: "2024",
  },
  {
    src: setara,
    title: "SETARA Internet Banking",
    category: "Web App · Accessibility",
    techs: ["React", "Typescript", "Tailwind", "Context", "Ant Design"],
    link: "",
    year: "2024",
  },
  {
    src: bcr,
    title: "Binar Car Rental",
    category: "Web App · E-Commerce",
    techs: ["React", "Typescript", "Tailwind", "Express", "Ant Design"],
    link: "https://24001118-synrgy7-ars-bcr-ch7.vercel.app/",
    year: "2023",
  },
  {
    src: bcr22,
    title: "BCR Dashboard",
    category: "Dashboard · Admin",
    techs: ["React", "Typescript", "Tailwind", "Express", "Ant Design"],
    link: "https://web-backoffice-service-spgw.vercel.app/login",
    year: "2023",
  },
  {
    src: netplig,
    title: "Netplig Movie Web",
    category: "Web App · Entertainment",
    techs: ["React", "Typescript", "Tailwind"],
    link: "https://movie-app-binar.vercel.app/",
    year: "2023",
  },
  {
    src: library,
    title: "Library Web",
    category: "Web App · Education",
    techs: ["Laravel", "Blade", "Bootstrap"],
    link: "https://perpustakaan-laravel90.vercel.app/login",
    year: "2022",
  },
  {
    src: porto,
    title: "Portfolio Web",
    category: "Portfolio · 3D",
    techs: ["React", "Typescript", "Tailwind", "Three.js"],
    link: "#",
    year: "2025",
  },
  {
    src: shs,
    title: "SHS WEB AGROFARM",
    category: "Farm",
    techs: ["Laravel", "Postgres", "Bootstrap", "Postgres"],
    link: "https://shsagrofarm.mdigi.tech/",
    year: "2025",
  },
  {
    src: ppni,
    title: "PPNI WEB",
    category: "Farm",
    techs: ["Laravel", "mysql", "Api Payment", "Postgres"],
    link: "https://http://simkppni-inna.my.id/.mdigi.tech/",
    year: "2025",
  },
];

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) obs.observe(ref.current);

    return () => obs.disconnect();
  }, []);

  const num = String(index + 1).padStart(2, "0");

  return (
    <a
      ref={ref}
      href={project.link || "#"}
      target={project.link && project.link !== "#" ? "_blank" : undefined}
      rel="noopener noreferrer"
      className={`
      block group
      transition-all duration-700
      ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}
      `}
      style={{
        transitionDelay: `${index * 80}ms`,
      }}
    >
      <div className="flex justify-between mb-2 px-[2px] text-[10px] text-white tracking-[0.2em] font-mono">
        <span>{num}</span>
        <span>{project.year}</span>
      </div>

      <div className="relative overflow-hidden aspect-video rounded-sm">
        <img
          src={project.src}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-11 h-11 border border-white/70 rounded-full flex items-center justify-center transform scale-50 -rotate-45 group-hover:scale-100 group-hover:rotate-0 transition-transform duration-300">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path
                d="M7 17L17 7M17 7H7M17 7V17"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none group-hover:opacity-0 transition-opacity duration-300" />
      </div>

      <div className="flex justify-between items-start mt-3 gap-3 px-[2px]">
        <div className="flex-1">
          <p className="text-[14px] font-semibold text-white/80 group-hover:text-white transition-colors">
            {project.title}
          </p>

          {/* <p className="text-[9px] text-white/30 tracking-[0.12em] uppercase mt-1">
            {project.category}
          </p> */}
        </div>

        <div className="flex gap-1 flex-wrap justify-end">
          {project.techs.slice(0, 3).map((tech, ti) => (
            <span
              key={ti}
              className="text-[9px] px-1.5 py-[2px] border border-white/30 text-white/50 tracking-[0.06em] rounded-sm whitespace-nowrap"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}

export default function ProjectsSection() {
  return (
    <section className="pt-3 pb-10">
      
      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-y-10 gap-x-7">
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}