import {
  createRef,
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
  OrbitControls,
  Stage,
  Text3D,
  useGLTF,
  useMatcapTexture,
} from "@react-three/drei";
import { useViewStates } from "./viewStateStore";
import { BoxGeometry } from "three";

function App() {
  const [display3dScene, setDisplay3dScene] = useState(false);
  const toggleDisplay3dScene = () => setDisplay3dScene((ds) => !ds);
  const { view } = useViewStates((state) => state);

  return (
    <div className="flex flex-col h-full p-6 relative text-white">
      <div
        className={`absolute ${
          view === "HOME" ? "-z-10" : "z-10"
        } left-0 top-0 h-full w-full transition-all`}
      >
        {/*<Nav toggleDisplay3dScene={toggleDisplay3dScene} /> */}
        <Canvas shadows camera={{ position: [0, 1.5, 5], zoom: 1, fov: 75 }}>
          <Scene />
          <color attach="background" args={["#27272a"]} />
          <fogExp2 color="#27272a" density={0.2} attach="fog" />
          <ambientLight intensity={0.5} color="white" />
        </Canvas>
      </div>
      <Overlay />
    </div>
  );
}

function Overlay() {
  return (
    <div className="fixed inset-0">
      <div className="absolute right-[10%] bottom-56 flex flex-col md:flex-row gap-14">
        <button className="p-2 w-[170px] border-white rounded bg-white text-gray-500 hover:text-white hover:scale-[1.1] transition-all shadow-[inset_0_0_0_0_theme(colors.violet.400)] hover:shadow-[inset_250px_0_0_9px_theme(colors.violet.400)]">
          Explore
        </button>
        <button className="p-2 w-[170px] border-white rounded bg-white text-gray-500 hover:text-white hover:scale-[1.1] transition-all shadow-[inset_0_0_0_0_theme(colors.violet.400)] hover:shadow-[inset_250px_0_0_9px_theme(colors.violet.400)]">
          Contact
        </button>
        <button className="p-2 w-[170px] border-white rounded bg-white text-gray-500 hover:text-white hover:scale-[1.1] transition-all shadow-[inset_0_0_0_0_theme(colors.violet.400)] hover:shadow-[inset_250px_0_0_9px_theme(colors.violet.400)]">
          Download Resume
        </button>
      </div>
    </div>
  );
}

function Scene() {
  const camera = useThree((three) => three.camera);
  const laptopRef = createRef<THREE.Group>();
  const { view } = useViewStates((state) => state);
  const minZoom = 1;
  const maxZoom = 7;
  const startTime = Date.now();
  const totalTime = 0.3 * 1000;
  const startingZoom = camera.zoom;
  const { width, height } = useThree((state) => state.viewport);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const margin = isMobile ? 0.4 : 0.9;
  useLayoutEffect(() => {
    const handleResize = () => setIsMobile(() => window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useFrame(() => {
    /*
    if (laptopRef.current) {
      if (view !== "PROJECTS") {
        camera.lookAt(laptopRef.current?.position);
        camera.zoom = maxZoom;
        camera.updateProjectionMatrix();
      } else {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(1, elapsedTime / totalTime);
        camera.zoom = startingZoom - progress * (maxZoom - minZoom);
        camera.updateProjectionMatrix();
      }
    }
    */
  });
  if (view === "HOME") {
    return (
      <>
        <Float rotationIntensity={0.7}>
          <Center right position={[-width / 2 + margin, 0, 0]}>
            <group>
              <Text3D
                rotation={[-0.1, 0.3, 0]}
                letterSpacing={0.03}
                curveSegments={32}
                bevelEnabled
                lineHeight={0.8}
                bevelSize={0.04}
                bevelThickness={0.1}
                size={isMobile ? 0.2 : 0.4}
                height={0.1}
                font="/Roboto_Regular.json"
              >
                {`Hi, my name\nis Marcus`}
                <meshNormalMaterial />
              </Text3D>
            </group>
          </Center>
        </Float>
        <Center position={[0, -1, -2.5]}>
          <DeskSetup />
        </Center>
      </>
    );
  }
  if (view === "ABOUT") {
    return (
      <>
        <Bio />
      </>
    );
  }
  return null;
}

function Bio() {
  const title = "Bio\n";
  const para1 =
    "Hello, I’m Marcus and I am studying Computer Science - Software Systems at SFU.\nMy passion lies in web development, and I've been honing my skills in\nthis area for some time now. In 2022, I joined WelTel Health as a fullstack developer\nintern and had the opportunity to improve after clinic healthcare\nthrough fixing bugs and developing features.\nOne of my main takeaways was learning how to work in a large code base.";
  return (
    <>
      <Float rotationIntensity={0.2}>
        <Center>
          <Text3D
            letterSpacing={0.02}
            size={0.2}
            height={0.1}
            font="/Roboto_Regular.json"
          >
            {title}
            {para1}
            <meshStandardMaterial color={"#c7d2fe"} />
          </Text3D>
        </Center>
      </Float>
      <OrbitControls />
    </>
  );
}
function DeskSetup(props: GroupProps) {
  return (
    <group {...props} scale={[0.3, 0.3, 0.3]}>
      <Desk scale={[1, 1, 1]} rotation-y={Math.PI * 0.5} />
      <Laptop position={[0, 6.9, 0]} scale={[1.5, 1.5, 1.5]} />
    </group>
  );
}

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

function Hero() {
  const { updateView, view } = useViewStates((state) => state);
  if (view !== "HOME") return null;
  return (
    <section className="h-full flex items-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl">Hello, my name is Marcus</h1>
        <p className="text-lg">I am a fullstack developer studying at SFU</p>
        <ul className="flex flex-wrap gap-2 text-base">
          <li>
            <button>Download Resume</button>
          </li>
          <li>
            <button onClick={() => updateView("ABOUT")}>Explore</button>
          </li>
          <li>
            <button>Contact</button>
          </li>
        </ul>
        {/* Add github and linked in links or when hit contact pop modal? */}
      </div>
    </section>
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
