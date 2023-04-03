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
            : { right: "100%", opacity: 1 }
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
          console.log("STarting Clock");
          clockRef.current.start();
        }
        const elapsedTime = clockRef.current.getElapsedTime();
        const progress = Math.min(1, elapsedTime / totalTime);
        deskRef.current.position.lerpVectors(
          currentPosition,
          targetPosition,
          progress
        );
        console.log(progress);
        if (progress === 1) {
          console.log("stopping clock");
          clockRef.current.stop();
          deskRef.current.position.set(
            targetPosition.x,
            targetPosition.y,
            targetPosition.z
          );
        }
      } else if (clockRef.current.running) {
        console.log("Stop clock");
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
  const homeMargin = isMobile ? 0.8 : 1.5;
  const view = useViewStates((state) => state.view);
  const { width, height } = useThree((state) => state.viewport);
  const positionBasedOnView = {
    home: new THREE.Vector3(-width / 2 + homeMargin, 1, 0),
    about: new THREE.Vector3(-width / 2 + 0.9, height / 2 - 1.5, 0),
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
            <Text3D size={isMobile ? 0.4 : 0.5} {...textBaseConfig}>
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
        <Float rotationIntensity={0.5}>
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
  return (
    <group ref={ref} {...props} scale={[0.3, 0.3, 0.3]}>
      <Desk scale={[1, 1, 1]} rotation-y={Math.PI * 0.5} />
      <Laptop position={[0, 6.9, 0]} scale={[1.5, 1.5, 1.5]} />
    </group>
  );
});

/*
  Auto-generated by: https://github.com/pmndrs/gltfjsx
*/
function Desk(props: GroupProps) {
  const { nodes, materials } = useGLTF("/table.glb") as any;
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Table_Large_Rectangular_01_Circle004.geometry}
        material={materials["795548"]}
      />
    </group>
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

/*
  Auto-generated by: https://github.com/pmndrs/gltfjsx
*/
const Laptop = forwardRef(function Laptop(
  props: GroupProps,
  ref: React.ForwardedRef<THREE.Group>
) {
  const { nodes, materials } = useGLTF("/laptop.gltf") as any;
  return (
    <group ref={ref} {...props} dispose={null}>
      <group position={[0, 0.52, 0]} scale={0.1}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Circle001.geometry}
          material={materials["Frame.001"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Circle001_1.geometry}
          material={materials["Frame.001"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Circle001_2.geometry}
          material={materials.HeadPhoneHole}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Circle001_3.geometry}
          material={materials.USB_C_INSIDE}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Circle001_4.geometry}
          material={materials["Frame.001"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Circle001_5.geometry}
          material={materials.TouchbarBorder}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Circle001_6.geometry}
          material={materials.Keyboard}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.FrontCameraRing001.geometry}
          material={materials["CameraRIngBlack.002"]}
          position={[-0.15, 19.57, -16.15]}
          scale={5.8}
        />
        <group position={[0, -0.51, 0]} scale={5.8}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Circle006.geometry}
            material={materials["Frame.001"]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Circle006_1.geometry}
            material={materials.USB_C_INSIDE}
          />
        </group>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.KeyboardKeyHole.geometry}
          material={materials["Keyboard.001"]}
          position={[-11.79, -0.15, -8.3]}
          scale={5.8}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.RubberFoot.geometry}
          material={materials.DarkRubber}
          position={[-11.95, -0.75, 7.86]}
          scale={5.8}
        />
        <group position={[0.01, -0.21, -10.56]} scale={5.8}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Circle012.geometry}
            material={materials.HingeBlack}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Circle012_1.geometry}
            material={materials.HingeMetal}
          />
        </group>
        <group position={[-11.79, -0.15, -8.3]} scale={5.8}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Circle.geometry}
            material={materials["Keyboard.001"]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Circle_1.geometry}
            material={materials.Key}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Circle_2.geometry}
            material={materials.Touchbar}
          />
        </group>
        <group
          position={[0.01, -0.47, -10.41]}
          rotation={[1.31, 0, 0]}
          scale={5.8}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Circle002.geometry}
            material={materials["Frame.001"]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Circle002_1.geometry}
            material={materials.Screen}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Circle002_2.geometry}
            material={materials.ScreenGlass}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Circle002_3.geometry}
            material={materials.Rubber}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Circle002_4.geometry}
            material={materials.DisplayGlass}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.AppleLogo000.geometry}
            material={materials["AppleLogo.004"]}
            position={[0, -0.11, -1.8]}
            rotation={[-Math.PI, 0, -Math.PI]}
            scale={0.58}
          />
        </group>
        <group position={[12.2, 0.03, 0.6]} scale={5.8}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Circle003.geometry}
            material={materials["Frame.001"]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Circle003_1.geometry}
            material={materials.SpeakerHole}
          />
        </group>
        <group position={[-15.03, 0.03, 0.6]} scale={5.8}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Circle009.geometry}
            material={materials["Frame.001"]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Circle009_1.geometry}
            material={materials.SpeakerHole}
          />
        </group>
      </group>
    </group>
  );
});

export default App;
useGLTF.preload("./laptop.gltf");
useGLTF.preload("./table.glb");
