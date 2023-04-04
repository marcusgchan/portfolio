import {
  createRef,
  ForwardedRef,
  forwardRef,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import "./App.css";
import * as THREE from "three";
import colors from "tailwindcss/colors";
/* https://docs.pmnd.rs/react-three-fiber/getting-started/introduction */
import { Canvas, GroupProps, useFrame, useThree } from "@react-three/fiber";
import {
  BBAnchor,
  Center,
  Float,
  Html,
  Loader,
  OrbitControls,
  Stage,
  Text3D,
  useGLTF,
  useMatcapTexture,
} from "@react-three/drei";
import { useViewStates } from "./viewStateStore";
import { BoxGeometry, Vector3 } from "three";
import { motion } from "framer-motion";
import Desk from "./Desk";
import Laptop from "./Laptop";

function App() {
  const { view } = useViewStates((state) => state);
  return (
    <div className="flex max-w-7xl mx-auto flex-col h-full p-6 relative text-white">
      <div className={`absolute left-0 top-0 h-full w-full transition-all`}>
        <Canvas shadows camera={{ position: [0, 1.5, 5], zoom: 1, fov: 75 }}>
          <Scene />
          <color attach="background" args={["#27272a"]} />
          <fogExp2 color="#27272a" density={0.2} attach="fog" />
          <ambientLight intensity={0.5} color="white" />
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
  const view = useViewStates((state) => state.view);
  const updateView = useViewStates((state) => state.updateView);
  return (
    <>
      <Home />
      <motion.div
        initial={false}
        animate={
          view === "ABOUT"
            ? { right: "10%", translateX: "0", opacity: 1 }
            : { right: "0%", translateX: "100%", opacity: 0 }
        }
        className="absolute p-2 bottom-[10%] ml-[10%] flex flex-col max-w-lg gap-4 tracking-wide"
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
      <motion.div
        animate={
          view === "PROJECTS"
            ? { left: "10%", opacity: 1 }
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
    </>
  );
}

function Home() {
  const updateView = useViewStates((state) => state.updateView);
  const view = useViewStates((state) => state.view);
  return (
    <>
      <motion.div
        initial={false}
        animate={
          view === "HOME"
            ? { right: "10%", opacity: 1 }
            : { right: "100%", opacity: 0 }
        }
        className="absolute bottom-[10%] flex flex-col md:flex-row gap-14"
      >
        <button
          onClick={() => updateView("ABOUT")}
          className="p-2 w-[170px] border-white rounded bg-white text-gray-500 hover:text-white hover:scale-[1.1] transition-all shadow-[inset_0_0_0_0_theme(colors.violet.400)] hover:shadow-[inset_250px_0_0_9px_theme(colors.violet.400)]"
        >
          Explore
        </button>
        <button className="p-2 w-[170px] border-white rounded bg-white text-gray-500 hover:text-white hover:scale-[1.1] transition-all shadow-[inset_0_0_0_0_theme(colors.violet.400)] hover:shadow-[inset_250px_0_0_9px_theme(colors.violet.400)]">
          Contact
        </button>
        <button className="p-2 w-[170px] border-white rounded bg-white text-gray-500 hover:text-white hover:scale-[1.1] transition-all shadow-[inset_0_0_0_0_theme(colors.violet.400)] hover:shadow-[inset_250px_0_0_9px_theme(colors.violet.400)]">
          Download Resume
        </button>
      </motion.div>
    </>
  );
}

function Scene() {
  const view = useViewStates((state) => state.view);
  const deskRef = createRef<THREE.Group>();
  const clockRef = useRef(new THREE.Clock(false));
  const totalTime = 2;
  const viewConfig: { [key: string]: Vector3 } = {
    home: new THREE.Vector3(0, -1, -2.5),
    about: new THREE.Vector3(0, -1, -2.5),
    projects: new THREE.Vector3(0, -0, 3.5),
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
      <HandleHeadings />
      <Center ref={deskRef} position={[0, -1, -2.5]}>
        <DeskSetup />
      </Center>
    </>
  );
}

function HandleHeadings() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useLayoutEffect(() => {
    const handleResize = () => setIsMobile(() => window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const homeMargin = isMobile ? 0.8 : 1.3;
  const aboutMargin = isMobile ? 0.9 : 2;
  const view = useViewStates((state) => state.view);
  const { width, height } = useThree((state) => state.viewport);
  const positionBasedOnView = {
    home: new THREE.Vector3(-width / 2 + homeMargin, 1, 0),
    about: new THREE.Vector3(
      -width / 2 + aboutMargin,
      height / 2 - aboutMargin - 0.5,
      0
    ),
  };
  const textBasedOnView = {
    home: `Hi, my name\nis Marcus`,
    about: `Bio`,
  };
  const textBaseConfig = {
    rotation: new THREE.Euler(-0.1, 0.3, 0),
    letterSpacing: 0.03,
    curveSegments: 32,
    bevelEnabled: true,
    lineHeight: 0.8,
    bevelThickness: 0.1,
    height: 0.1,
    font: "/Roboto_Regular.json",
  };
  if (view === "HOME") {
    return (
      <>
        <Float rotationIntensity={0.0}>
          <Center right position={positionBasedOnView.home}>
            <Text3D size={isMobile ? 0.3 : 0.4} {...textBaseConfig}>
              {textBasedOnView.home}
              <meshNormalMaterial />
            </Text3D>
          </Center>
        </Float>
      </>
    );
  }
  if (view === "ABOUT") {
    return (
      <>
        <Float rotationIntensity={0.0}>
          <Center bottom right position={positionBasedOnView.about}>
            <Text3D {...textBaseConfig} size={0.5}>
              {textBasedOnView.about}
              <meshNormalMaterial />
            </Text3D>
          </Center>
        </Float>
      </>
    );
  }
  return null;
}

const DeskSetup = forwardRef(function DeskSetup(
  props: GroupProps,
  ref: ForwardedRef<THREE.Group>
) {
  const view = useViewStates((state) => state.view);
  return (
    <group ref={ref} {...props} scale={[0.3, 0.3, 0.3]}>
      <Desk scale={[1, 1, 1]} rotation-y={Math.PI * 0.5} />
      <Laptop position={[0, 6.9, 2]} scale={[1.5, 1.5, 1.5]}>
        {view === "PROJECTS" && (
          <Html
            rotation-x={Math.PI * -0.085}
            position={[0, 1.53, -1.32]}
            transform
            distanceFactor={1}
            wrapperClass="test"
          >
            <LaptopBackground>
              <LaptopScreen />
            </LaptopBackground>
          </Html>
        )}
      </Laptop>
    </group>
  );
});

type LaptopViews = "PROJECTS" | "RECI_ONE" | "VR_SPEECH_SIMULATOR";

function LaptopScreen() {
  const [view, setView] = useState<LaptopViews>("PROJECTS");
  if (view === "PROJECTS") {
    return <Projects setView={setView} />;
  } else if (view === "RECI_ONE") {
    return <ReciOne setView={setView} />;
  }
  return null;
}

function LaptopBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-400 overflow-y-auto rounded-[35px] leading-relaxed px-16 py-12 h-[810px] w-[1185px] text-3xl">
      {children}
    </div>
  );
}
type SetViewProp = {
  setView: React.Dispatch<React.SetStateAction<LaptopViews>>;
};
function Projects({ setView }: SetViewProp) {
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

function ReciOne({ setView }: SetViewProp) {
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
        the development enviroment. <code className="bg-gray-500 p-1 rounded">npx run dev</code> which starts up the
        Nextjs server and <code className="bg-gray-500 p-1 rounded">docker compose up</code> which runs the
        database, minio, and recipe parser containers. In the future, I may move
        Nextjs to startup with docker but I am satisified for now. In addition,
        I have protected main branch and a CI pipeline that currently runs
        Prettier, ESLint, and building test.
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

function Nav({ toggleDisplay3dScene }: { toggleDisplay3dScene: () => void }) {
  return (
    <nav>
      <ul className="flex justify-end gap-3 max-w-5xl mx-auto">
        <li>
          <button onClick={toggleDisplay3dScene}>Home</button>
        </li>
        <li>
          <button>Contact</button>
        </li>
      </ul>
    </nav>
  );
}

export default App;
useGLTF.preload("./laptop.gltf");
useGLTF.preload("./table.glb");
