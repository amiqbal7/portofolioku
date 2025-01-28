import bcr from "../assets/bcr.jpeg";
import netplig from "../assets/netplig.jpeg";
import bcr22 from "../assets/bcr-dsbrd.jpeg";
import tiketku from "../assets/tiketku.png";
import ant from "../assets/ant.png";
import library from "../assets/library.jpeg";
import porto from "../assets/porto.jpg";
import reacticon from "../assets/react.svg";
import tailwind from "../assets/tailwind.png";
import laravel from "../assets/laravel.png";
import setara from "../assets/setara.jpeg";

export const Header = () => {
  return (
    <div className="header">
      <div className="mx-8 my-5">
        <div className=" text-white">
          Hello, This is <br />
          <span className="text-4xl font-extrabold">
            ARSY MUHAMMAD IQBAL
          </span>{" "}
          <br />
          I'm a Web Developer.
        </div>
        <div className="pt-5">
          <p className="font-extralight text-sm">
            I am a motivated and fast-learning Fresh Graduate specializing in
            both React.js and Laravel. With a strong academic background and
            hands-on experience from various projects, I have developed a keen
            ability to build dynamic, responsive web applications. I am
            passionate about expanding my skill set, keeping up with the latest
            trends, and delivering clean, efficient code to create impactful web
            applications.
          </p>
        </div>
        <div className="pt-5">
          <h1 className="text-2xl font-extrabold">EXPERIENCE</h1>
          <hr></hr>
          <div className="pt-4">
            <div className="flex justify-between items-center">
              <h2 className="pt-1">PT. BLANTIKA KREASI MUDA (Intern)</h2>
              <p className="text-sm">May - Jul 2023</p>
            </div>
            <p className="text-sm pt-1">
              I completed a several-month internship where I developed a website
              using React.js and Express.js.
            </p>
          </div>
          <div className="pt-5">
            <div className="flex justify-between items-center">
              <h2 className="pt-2">PT. WIDYA INOVATION INDONESIA (Intern)</h2>

              <p className="text-sm">Aug - Dec 2023</p>
            </div>
            <p className="text-sm pt-1">
              I gained 6 months of experience at a startup focused on IoT and
              Artificial Intelligence. I was placed at a healthcare-focused
              branch of Widya Imersif Technology, where I developed Frontend a
              website, added new features, and designed systems from the ground
              up using React and TypeScript.{" "}
            </p>
          </div>
          <div className="pt-5">
            <div className="flex justify-between items-center">
              <h2 className="pt-2">PT. MAHAKA DIGITAL INDONESIA</h2>

              <p className="text-sm">Oct 2024 - Now 2025</p>
            </div>
            <p className="text-sm pt-1">
              I work as a Web Developer at PT Mahaka Digital Indonesia, a
              company specializing in regional tax consulting services. In this
              role, I am responsible for developing web-based applications using
              Laravel as the primary tech stack. I am also experienced in
              directly communicating with clients to understand their needs and
              ensure that the solutions I deliver align with their expectations.
              With a strong background in web development and excellent
              interpersonal skills, I focus on delivering high-quality and
              efficient results.
            </p>
          </div>
        </div>

        <div className="pt-5">
          <h1 className="text-2xl font-extrabold">EDUCATION</h1>
          <hr></hr>
          <div>
            <div className="flex justify-between items-center">
              <h2 className="pt-1">UNIVERSITAS MUHAMMADIYAH SURAKARTA</h2>

              <p className="text-sm pt-1">2020 - 2024</p>
            </div>
            <p className="text-sm pt-1">Bachelor, 3.71/4.00 GPA.</p>
          </div>
          <div className="pt-4">
            <h1 className="italic font-extrabold">Non Formal</h1>
            <div>
              <div className="flex justify-between items-center">
                <h2 className="">BINAR ACADEMY (MBKM)</h2>
                <p className="text-sm pt-1">Feb - Jun 2022</p>
              </div>
              <p className="text-sm pt-1">Frontend JS Web.</p>
            </div>
            <div className="pt-4">
              <div className="flex justify-between items-center">
                <h2 className="pt-2">SYNERGY ACADEMY by BCA</h2>
                <p className="text-sm pt-2">Feb - Aug 2024</p>
              </div>
              <p className="text-sm pt-1">Fullstack Web.</p>
            </div>
          </div>
        </div>

        {/* <div className="text-2xl text-white font-extrabold pt-5">
          <h1>SKILLS</h1>

          <hr></hr>
          <div className="flex space-x-4 pt-5 ">
            <img className="w-16 h-16" src={laravel} alt="Laravel" />
            <img className="w-16 h-16" src={reacticon} alt="React" />
            <img className="w-18 h-16" src={tailwind} alt="Tailwind CSS" />
            <img className="w-16 h-16" src={ant} alt="Ant Design" />
          </div>
        </div> */}

        <div>
          <div className="text-2xl text-white font-extrabold pt-5">
            <h1 className="">SELECTED PROJECT</h1>
          </div>

          <hr />
          <div className="flex flex-wrap mt-4 gap-4 ">
            {[
              {
                src: tiketku,
                title: "Tiketku Flight Booking",
                techs: ["React", "Typescript", "Tailwind", "Redux"],
                link: "https://perpustakaan-laravel90.vercel.app/login",
              },
              {
                src: setara,
                title: "SETARA (Internet Banking Accesbility)",
                techs: [
                  "React",
                  "Typescript",
                  "Tailwind",
                  "Context",
                  "Ant Design",
                ],
                link: "",
              },
              {
                src: bcr,
                title: "Binar Car Rental",
                techs: [
                  "React",
                  "Typescript",
                  "Tailwind",
                  "Express",
                  "Ant Design",
                ],
                link: "https://24001118-synrgy7-ars-bcr-ch7.vercel.app/",
              },
              {
                src: bcr22,
                title: "Binar Car Rental Dashboard",
                techs: [
                  "React",
                  "Typescript",
                  "Tailwind",
                  "Express",
                  "Ant Design",
                ],
                link: "https://web-backoffice-service-spgw.vercel.app/login",
              },
              {
                src: netplig,
                title: "Netplig Movie Web",
                techs: ["React", "Typescript", "Tailwind"],
                link: "https://movie-app-binar.vercel.app/",
              },
              {
                src: library,
                title: "Library Web",
                techs: ["Laravel", "Blade", "Bootstrap"],
                link: "https://perpustakaan-laravel90.vercel.app/login",
              },
              {
                src: porto,
                title: "Portofolio Web",
                techs: ["React", "Typescript", "Tailwind", "Three.js"],
                link: "https://perpustakaan-laravel90.vercel.app/login",
              },
            ].map((project, index) => (
              <a
                key={index}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 w-full sm:w-80 relative overflow-hidden group"
              >
                <div>
                  <img
                    className="border-white rounded-sm w-full h-36 object-cover transition-transform duration-300 ease-in-out transform group-hover:scale-105"
                    src={project.src}
                    alt={project.title}
                  />
                </div>
                {/* Linear gradient overlay */}
                <div className="absolute inset-0 bg-black opacity-10 rounded-sm transition-opacity duration-300 ease-in-out group-hover:opacity-0 pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent rounded-sm transition-opacity duration-300 ease-in-out group-hover:opacity-0 pointer-events-none"></div>
                <div className="text-xs flex gap-5 p-2 relative z-10">
                  <div>
                    <p className="font-semibold">{project.title}</p>
                    <div className="pt-3 flex gap-2 flex-wrap">
                      {project.techs.map((tech, index) => (
                        <span
                          key={index}
                          className="py-0.5 px-1 border rounded-sm bg-slate-800"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="">
          <h1 className="pt-5 text-2xl font-extrabold">CONTACT</h1>
          <hr></hr>
          <div className="pt-2 text-sm flex gap-8">
            <div>
              {" "}
              <p>Email</p>
              <p>LinkedIn</p>
              <p>Github</p>
            </div>
            <div className="underline">
              <p>amiqbal080@gmail.com</p>
              <a>linkedin.com/in/arsymuhammadiqbal</a>
              <p>github.com/amiqbal7</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
