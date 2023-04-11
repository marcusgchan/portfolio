import {
  createContext,
  createRef,
  ForwardedRef,
  forwardRef,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import "./App.css";
import * as THREE from "three";
import { Canvas, GroupProps, useFrame, useThree } from "@react-three/fiber";
import {
  Center,
  Environment,
  Html,
  Loader,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import { useViewStates } from "./viewStateStore";
import { Vector3 } from "three";
import { motion } from "framer-motion";
import Desk from "./Desk";
import Laptop from "./Laptop";
import Phone from "./Phone";
import Plant from "./Plant";
import Drink from "./Drink";
import { Rug } from "./Rug";

function App() {
  return (
    <div className="flex max-w-7xl mx-auto flex-col h-full p-6 relative text-white">
      <div className={`absolute left-0 top-0 h-full w-full transition-all`}>
        <Canvas shadows camera={{ position: [0, 1.5, 5], zoom: 1, fov: 75 }}>
          <Scene />
          <color attach="background" args={["#27272a"]} />
          <fogExp2 color="#27272a" density={0.2} attach="fog" />
          <ambientLight intensity={0.5} color="white" />
          <Environment preset="city" />
        </Canvas>
      </div>
      <OverlayWrapper>
        <Overlay />
      </OverlayWrapper>
      <Loader />
    </div>
  );
}

function OverlayWrapper({ children }: { children: React.ReactNode }) {
  return <div className="fixed inset-0">{children}</div>;
}

function Overlay() {
  return (
    <>
      <Home />
      <About />
      <Projects />
      <Contact />
      <a
        href="/style-guide.html"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute left-[1%] bottom-[1%] opacity-50 cursor-pointer"
      >
        Style Guide
      </a>
    </>
  );
}

function Home() {
  const updateView = useViewStates((state) => state.updateView);
  const view = useViewStates((state) => state.view);
  return (
    <>
      <motion.div
        initial={{
          top: "20vmin",
          left: "0",
          translateX: "-100%",
        }}
        animate={
          view === "HOME"
            ? {
                left: "15vmin",
                top: "20vmin",
                translateX: "0",
                opacity: 1,
              }
            : {
                left: "0",
                top: "20vim",
                translateX: "-100%",
                opacity: 0,
              }
        }
        className="absolute"
      >
        <h1 className="text-6xl">
          Hi, my name is
          <br /> Marcus.
        </h1>
      </motion.div>
      <motion.div
        initial={{ right: "0", bottom: "10%" }}
        animate={
          view === "HOME"
            ? { right: "10%", opacity: 1 }
            : { right: "100%", opacity: 0 }
        }
        className="absolute flex flex-col md:flex-row gap-14"
      >
        <button
          onClick={() => updateView("ABOUT")}
          className="p-2 w-[170px] border-white rounded bg-white text-gray-500 hover:text-white hover:scale-[1.1] transition-all shadow-[inset_0_0_0_0_theme(colors.violet.400)] hover:shadow-[inset_250px_0_0_9px_theme(colors.violet.400)]"
        >
          Explore
        </button>
        <button
          onClick={() => updateView("CONTACT")}
          className="p-2 w-[170px] border-white rounded bg-white text-gray-500 hover:text-white hover:scale-[1.1] transition-all shadow-[inset_0_0_0_0_theme(colors.violet.400)] hover:shadow-[inset_250px_0_0_9px_theme(colors.violet.400)]"
        >
          Contact
        </button>
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-center p-2 w-[170px] border-white rounded bg-white text-gray-500 hover:text-white hover:scale-[1.1] transition-all shadow-[inset_0_0_0_0_theme(colors.violet.400)] hover:shadow-[inset_250px_0_0_9px_theme(colors.violet.400)]"
        >
          Download Resume
        </a>
      </motion.div>
    </>
  );
}

function About() {
  const updateView = useViewStates((state) => state.updateView);
  const view = useViewStates((state) => state.view);
  return (
    <>
      <motion.div
        initial={{
          top: "20vmin",
          left: "0",
          translateX: "-100%",
        }}
        animate={
          view === "ABOUT"
            ? {
                left: "15vmin",
                top: "20vmin",
                translateX: "0",
                opacity: 1,
              }
            : {
                left: "0",
                top: "20vim",
                translateX: "-100%",
                opacity: 0,
              }
        }
        className="absolute"
      >
        <h1 className="text-6xl">Bio</h1>
      </motion.div>
      <motion.div
        initial={{
          right: "0",
          bottom: "10%",
          translateX: "100%",
          opacity: 0,
        }}
        animate={
          view === "ABOUT"
            ? { right: "10%", translateX: "0", opacity: 1 }
            : { right: "0%", translateX: "100%", opacity: 0 }
        }
        className="absolute p-2 ml-[10%] flex flex-col max-w-lg gap-4 tracking-wide"
      >
        <div className="flex flex-col gap-4 overflow-auto max-h-[50vh] md:max-h-none">
          <p>
            Hello, I’m Marcus and I am studying Computer Science - Software
            Systems at SFU. My passion lies in web development, and I've been
            honing my skills in this area for some time now. In 2022, I joined
            WelTel Health as a fullstack developer intern and had the
            opportunity to improve after clinic healthcare through fixing bugs
            and developing features. One of my main takeaways was learning how
            to work in a large code base.
          </p>
          <p>
            My favourite tech stack is the T3 Stack that focuses on fullstack
            type safety for web development. This stack has tremendously
            improved my productivity and has best in class developer experience.
            Additionally, I've recently been exploring the possibilities of
            WebXR and WebGL, which I find to be fascinating technologies that
            offer new and exciting ways to create immersive web experiences.
          </p>
          <p>
            Overall, I am passionate about software development and excited to
            continue learning and growing in this field.
          </p>
        </div>
        <div className="flex gap-3 md:gap-14">
          <button
            onClick={() => updateView("HOME")}
            className="p-2 w-[140px] border-white rounded bg-white text-gray-500 hover:text-white hover:scale-[1.1] transition-all shadow-[inset_0_0_0_0_theme(colors.violet.400)] hover:shadow-[inset_250px_0_0_9px_theme(colors.violet.400)]"
          >
            Back
          </button>
          <button
            onClick={() => updateView("PROJECTS")}
            className="p-2 w-[140px] border-white rounded bg-white text-gray-500 hover:text-white hover:scale-[1.1] transition-all shadow-[inset_0_0_0_0_theme(colors.violet.400)] hover:shadow-[inset_250px_0_0_9px_theme(colors.violet.400)]"
          >
            Projects
          </button>
        </div>
      </motion.div>
    </>
  );
}

function Contact() {
  const view = useViewStates((state) => state.view);
  const updateView = useViewStates((state) => state.updateView);
  const back = (e: React.FormEvent) => {
    e.preventDefault();
    updateView("HOME");
  };
  const send = (e: React.FormEvent) => {
    e.preventDefault();
  };
  return (
    <motion.div
      animate={
        view === "CONTACT"
          ? {
              opacity: 1,
              translateY: 0,
              zIndex: 0,
            }
          : {
              opacity: 0,
              translateY: 50,
              zIndex: -999,
            }
      }
      className="absolute h-full w-full flex justify-center items-center"
    >
      <aside className="flex flex-col max-w-md w-full gap-4 border-violet-400 border-4 rounded p-4">
        <h1 className="text-2xl">Contact Me</h1>
        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-1 w-full">
            <label className="block">Email:</label>
            <input className="bg-transparent border-gray-500 border-2 p-1" />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label className="block">Message:</label>
            <textarea className="bg-transparent border-gray-500 border-2 p-1" />
          </div>
          <div className="flex gap-4">
            <button
              onClick={back}
              className="p-2 w-[120px] border-white rounded bg-white text-gray-500 hover:text-white hover:scale-[1.1] transition-all shadow-[inset_0_0_0_0_theme(colors.red.400)] hover:shadow-[inset_150px_0_0_9px_theme(colors.red.400)]"
            >
              Cancel
            </button>
            <button
              onClick={send}
              className="p-2 w-[120px] border-white rounded bg-white text-gray-500 hover:text-white hover:scale-[1.1] transition-all shadow-[inset_0_0_0_0_theme(colors.violet.400)] hover:shadow-[inset_150px_0_0_9px_theme(colors.violet.400)]"
            >
              Send
            </button>
          </div>
        </form>
      </aside>
    </motion.div>
  );
}

function Projects() {
  const updateView = useViewStates((state) => state.updateView);
  const view = useViewStates((state) => state.view);
  return (
    <motion.div
      initial={{ top: "5%", left: "0", translateX: "-100%" }}
      animate={
        view === "PROJECTS"
          ? { left: "10%", translateX: "0", opacity: 1 }
          : { left: "0", translateX: "-100%", opacity: 0 }
      }
      className="absolute left-[5%] top-[5%]"
    >
      <button
        onClick={() => updateView("HOME")}
        className="p-2 w-[140px] border-white rounded bg-white text-gray-500 hover:text-white hover:scale-[1.1] transition-all shadow-[inset_0_0_0_0_theme(colors.violet.400)] hover:shadow-[inset_250px_0_0_9px_theme(colors.violet.400)]"
      >
        Home
      </button>
    </motion.div>
  );
}

function Scene() {
  const view = useViewStates((state) => state.view);
  const deskRef = createRef<THREE.Group>();
  const clockRef = useRef(new THREE.Clock(false));
  const totalTime = 2;
  // TODO: Make type more strict to match differ views
  const viewConfig: { [key: string]: Vector3 } = {
    home: new THREE.Vector3(0, -1, -2.5),
    about: new THREE.Vector3(0, -1, -2.5),
    contact: new THREE.Vector3(0, -1, -4.5),
    projects: new THREE.Vector3(0, -0, 3.6),
  };
  useFrame(() => {
    if (deskRef.current) {
      let currentPosition = deskRef.current.position.clone();
      const targetPosition = viewConfig[view.toLowerCase()];
      const distance = currentPosition.distanceTo(targetPosition);
      if (distance > 0.0001) {
        if (!clockRef.current.running) {
          clockRef.current.start();
        }
        const elapsedTime = clockRef.current.getElapsedTime();
        const progress = Math.min(1, elapsedTime / totalTime);
        deskRef.current.position.lerpVectors(
          currentPosition,
          targetPosition,
          progress
        );
        if (progress === 1) {
          clockRef.current.stop();
          deskRef.current.position.set(
            targetPosition.x,
            targetPosition.y,
            targetPosition.z
          );
        }
      } else if (clockRef.current.running) {
        clockRef.current.stop();
      }
    }
  });
  return (
    <>
      <Center ref={deskRef} position={[0, -1, -2.5]}>
        <DeskSetup />
      </Center>
    </>
  );
}

const DeskSetup = forwardRef(function DeskSetup(
  props: GroupProps,
  ref: ForwardedRef<THREE.Group>
) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useLayoutEffect(() => {
    const handleResize = () => setIsMobile(() => window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const view = useViewStates((state) => state.view);
  return (
    <group ref={ref} {...props} scale={[0.3, 0.3, 0.3]}>
      <Desk scale={[1, 1, 1]} rotation-y={Math.PI * 0.5} />
      <Plant position={[-6.5, 8, 0]} />
      <Drink position={[6, 8, 1.5]} scale={[5, 5, 5]} />
      <Rug rotation-y={Math.PI * 0.5} scale={[3, 1, 2.5]} />
      {isMobile ? (
        <Phone
          rotation-x={Math.PI * -0.09}
          position={[-0.17, 8, 2]}
          scale={[1, 1, 1]}
        >
          {view === "PROJECTS" && (
            <Html position={[0.165, 1.33, 0.06]} transform distanceFactor={1}>
              <PhoneBackground>
                <LaptopScreen />
              </PhoneBackground>
            </Html>
          )}
        </Phone>
      ) : (
        <Laptop position={[0, 6.9, 2]} scale={[1.5, 1.5, 1.5]}>
          {view === "PROJECTS" && (
            <Html
              rotation-x={Math.PI * -0.085}
              position={[0, 1.53, -1.32]}
              transform
              distanceFactor={1}
            >
              <LaptopBackground>
                <LaptopScreen />
              </LaptopBackground>
            </Html>
          )}
        </Laptop>
      )}
    </group>
  );
});

function PhoneBackground({ children }: { children: React.ReactNode }) {
  const backgroundRef = useRef<HTMLDivElement | null>(null);
  return (
    <BackgroundElementContext.Provider value={backgroundRef}>
      <div
        ref={backgroundRef}
        className="bg-gray-400 overflow-y-auto rounded-[85px] leading-relaxed px-16 py-12 h-[1290px] w-[610px] text-3xl"
      >
        {children}
      </div>
    </BackgroundElementContext.Provider>
  );
}

type LaptopViews = "PROJECTS" | "RECI_ONE" | "VR_SPEECH_SIMULATOR";

function LaptopScreen() {
  const [view, setView] = useState<LaptopViews>("PROJECTS");
  if (view === "PROJECTS") {
    return <ProjectsView setView={setView} />;
  } else if (view === "RECI_ONE") {
    return <ReciOne setView={setView} />;
  }
  return <VrSpeechSimulator setView={setView} />;
}
const BackgroundElementContext =
  createContext<null | React.RefObject<HTMLDivElement>>(null);
const useBackgroungElement = () => useContext(BackgroundElementContext);
function LaptopBackground({ children }: { children: React.ReactNode }) {
  const backgroundRef = useRef<HTMLDivElement | null>(null);
  return (
    <BackgroundElementContext.Provider value={backgroundRef}>
      <div
        ref={backgroundRef}
        className="bg-gray-400 overflow-y-auto rounded-[35px] leading-relaxed px-16 py-12 h-[810px] w-[1185px] text-3xl"
      >
        {children}
      </div>
    </BackgroundElementContext.Provider>
  );
}
type SetViewProp = {
  setView: React.Dispatch<React.SetStateAction<LaptopViews>>;
};
function ProjectsView({ setView }: SetViewProp) {
  return (
    <>
      <h1 className="text-7xl mb-6">Projects</h1>
      <section className="flex flex-col gap-6">
        <article className="flex flex-col gap-5 border-gray-500 border-8 border-solid p-4">
          <h2 className="text-6xl">ReciOne</h2>
          <p>
            An all in one recipe cookbook where users can view, create, and
            import recipes.
          </p>
          <button
            onClick={() => setView("RECI_ONE")}
            className="p-2 w-[170px] border-white rounded bg-white text-gray-500 hover:text-white hover:scale-[1.1] transition-all shadow-[inset_0_0_0_0_theme(colors.violet.400)] hover:shadow-[inset_250px_0_0_9px_theme(colors.violet.400)]"
          >
            View More
          </button>
        </article>
        <article className="flex flex-col gap-5 border-gray-500 border-8 border-solid p-4">
          <h2 className="text-6xl">VR Speech Simulator</h2>
          <p>
            VR Speech Simulator is a public speaking simulator that utilizes
            WebXR to construct an immersive virtual reality experience where
            users can import their script and practice their speeches in VR.
          </p>
          <button
            onClick={() => setView("VR_SPEECH_SIMULATOR")}
            className="p-2 w-[170px] border-white rounded bg-white text-gray-500 hover:text-white hover:scale-[1.1] transition-all shadow-[inset_0_0_0_0_theme(colors.violet.400)] hover:shadow-[inset_250px_0_0_9px_theme(colors.violet.400)]"
          >
            View More
          </button>
        </article>
      </section>
    </>
  );
}

function VrSpeechSimulator({ setView }: SetViewProp) {
  const bgElement = useBackgroungElement();
  useLayoutEffect(() => {
    bgElement?.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <section className="flex flex-col gap-6">
      <button
        onClick={() => setView("PROJECTS")}
        className="sticky top-0 p-2 w-[170px] border-white rounded bg-white text-gray-500 hover:text-white hover:scale-[1.1] transition-all shadow-[inset_0_0_0_0_theme(colors.violet.400)] hover:shadow-[inset_250px_0_0_9px_theme(colors.violet.400)]"
      >
        Back
      </button>
      <h1 className="text-7xl">VR Speech Simulator - NwHacks 2023 Winners</h1>
      <h2 className="text-4xl">Description</h2>
      <p>
        VR Speech Simulator is a public speaking simulator where users can
        import their script to practice in a VR classroom. After the
        presentation, the speech statistics like number of filler words used and
        WPM are displayed on the screen.
      </p>
      <h2 className="text-4xl">Technologies Used</h2>
      <span>
        T3-Stack (Nextjs, Prisma, NextAuth, tRPC) + React Three Fiber + ReactXR
        + React Speech To Text
      </span>
      <h2 className="text-4xl">Workflow</h2>
      <p>
        To get started, users must login on their laptop. After loggin in, users
        can import their script and queue a presentation. Once a presentation is
        queued, it is time to put on the VR headset and login with the same
        account as the laptop. Since a presentation is queued, it will bring the
        user to the page with an enter VR button. Clicking the button will bring
        the user into a classroom with their imported script on the whiteboard.
        The timer starts immediately. When the user is done presention, they can
        exit the scene and go on their laptop and the statistics should be
        there. Some of the stats includes how the time compared with the ideal
        time that was keyed in initially, WPM, how many filler words were used,
        and which of theses stats can be improved. Users can practice multiple
        times and all the results will be shown.
      </p>
      <h2 className="text-4xl">3 Main Roadblocks</h2>
      <p>
        There were 3 main problems that my team ran into. The first problems was
        how to communicate from client to client (Laptop to VR headset). The
        second problem was how to display the script in VR, and the final
        problem was how to implement the statistics.
      </p>
      <h2 className="text-4xl">Client to Client Communication</h2>
      <p>
        The main issue with the normal request response pattern is the client
        always has to initiate the request. The server can't initiate the
        request. This was a problem because queuing the presentation on the
        laptop should initialize the VR headset (client) with the queued
        presentation. Also, we needed the laptop to display the statistics after
        the presentation was over (VR headset to laptop).
      </p>
      <p>
        After debating between websockets, bluetooth, and polling, we decided to
        go with the naive solution of polling due to time constraints.
        Basically, the VR headset will ask the server "Is there a presentation
        queued?" every 5 seconds and the laptop will ask the server "Is there a
        presentation that is finished?" every 5 seconds.
      </p>
      <p>
        Another reason why we didn't go with websockets was we had a serverless
        deploy on Vercel so we would need a third party solution like Pusher
        which we didn't have time to figure.
      </p>
      <h2 className="text-4xl">Displaying Text in the Scene</h2>
      <p>
        Drei provides a text component which is a wrapper around troika-text-3d.
        We used that to display the imported text on the whiteboard.
      </p>
      <img src="/vr-speech-simulator/script-on-whiteboard.png" />
      <h2 className="text-4xl">Statistics Pipeline</h2>
      <p>
        We used react speech to text (wrapper around the web speech api) to get
        a transcript of what there users says. Then we will send the trasncript
        to the backend for processing. We have a table of filler words and
        iterated through the transcript and counted the number of filler words.
        Then we used the start and end time to calculate the total time of the
        presentation and sent it back to the frontend.
      </p>
      <img src="/vr-speech-simulator/attempts.png" />
    </section>
  );
}

function ReciOne({ setView }: SetViewProp) {
  const bgElement = useBackgroungElement();
  useLayoutEffect(() => {
    bgElement?.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <section className="flex flex-col gap-6">
      <button
        onClick={() => setView("PROJECTS")}
        className="sticky top-0 p-2 w-[170px] border-white rounded bg-white text-gray-500 hover:text-white hover:scale-[1.1] transition-all shadow-[inset_0_0_0_0_theme(colors.violet.400)] hover:shadow-[inset_250px_0_0_9px_theme(colors.violet.400)]"
      >
        Back
      </button>
      <h1 className="text-7xl">ReciOne</h1>
      <h2 className="text-4xl">Description</h2>
      <p>
        ReciOne is an all in one recipe cookbook where users can view, create,
        and import recipes. It focuses on making cooking easier by consolidating
        recipes from different websites through the import feature with he
        ability to search by recipe name.
      </p>
      <h2 className="text-4xl">Technologies Used</h2>
      <span>
        T3-Stack (Nextjs, Prisma, NextAuth, tRPC) + S3 + Docker + Github Actions
      </span>
      <h2 className="text-4xl">Why T3-Stack?</h2>
      <p>
        The T3-Stack provides one of the best developer experience for
        developing fullstack web applications. It has fullstack typesafety with
        autocompletion and refactoring from the frontend to the backend.
      </p>
      <h2 className="text-4xl">The Development Environment</h2>
      <p>
        I spent a lot of time setting up this development enviornment that is
        overkill for my current scale, but the main reason I did it was to
        practice what I learned during my coop. Two commands are requried to run
        the development enviroment.{" "}
        <code className="bg-gray-500 p-1 rounded">npx run dev</code> which
        starts up the Nextjs server and{" "}
        <code className="bg-gray-500 p-1 rounded">docker compose up</code> which
        runs the database, minio, and recipe parser containers. In the future, I
        may move Nextjs to startup with docker but I am satisified for now. In
        addition, I have protected main branch and a CI pipeline that currently
        runs Prettier, ESLint, and building test.
      </p>
      <p>
        Using docker allows for an easy development setup when working with
        multiple people and creates a separate local enviroment for each user. I
        am using MinIo to mimic the S3 bucket api for local development.
      </p>
      <h2 className="text-4xl">Image Storage</h2>
      <p>
        In this section I will cover how I used presigned urls to upload and
        display images along with how to cache presigned urls.
      </p>
      <p>
        To upload images, I used post signed urls instead of put urls becasue it
        allows for more fine tine control (MIME Type, max size upload, etc).
      </p>
      <span>Request respose workflow to upload an image to S3:</span>
      <img src="/reci-one/upload-img-workflow.png" />
      <p>
        One implementation difference between put and post signed urls is post
        signed urls take a bit more work to upload the file on the frontend.
        With put signed urls, the correct url is generated in the server and
        passed to the client. The client can use the url as the upload url and
        attach the image to the request body. However, with post signed urls,
        the aws sdk will generate all the fields required for the upload instead
        of the actual upload url with the fields embedded in the url. So,
        uploading the image will required creating a FormData object and adding
        all the fields generated by the server with the image as the last field.
      </p>
      <p>
        The process for using a presigned url for retrieving the image from S3
        is simpler.
      </p>
      <img src="/reci-one/dowload-img-workflow.png" />
      <h2 className="text-4xl">Caching Presigned urls</h2>
      <p>
        One tradeoff with using presigned urls is it complicates caching. The
        browser caches all images by default if the image url is the same.
        However, presigned urls are different because they must be generated
        everytime a recipes are displayed and it's based on the current time.
        The method I chose to get around this is by rounding the current date to
        the previous Monday. This way, the image will be cached for 7 days.
      </p>
      <h2 className="text-4xl">Importing a Recipe</h2>
      <p>
        A recipe can be imported by providing a the url to another recipe. I am
        utilizing a python recipe scraping website to extract the recipe data.
        Since the current techstack is all TypeScript, I decided to run the
        parsing library in a separate Flask web server.
      </p>
      <img src="/reci-one/parse-recipe-workflow.png" />
      <h2 className="text-4xl">The Production Environment</h2>
      <p>
        I'm using fully serverless technologies - PlanetScale for the database
        and Vercel for Nextjs.
      </p>
    </section>
  );
}

export default App;
useGLTF.preload("./laptop.gltf");
useGLTF.preload("./table.glb");
useGLTF.preload("./phone.gltf");
useGLTF.preload("./drink.gltf");
useGLTF.preload("./plant.gltf");
useGLTF.preload("./rug.glb");
