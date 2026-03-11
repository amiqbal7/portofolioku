
import ProjectsSection from "./ProjectsSection";

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
          I'm a Software Engineer.
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

              <p className="text-sm">Oct 2024 - Now.</p>
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
          <ProjectsSection />
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
