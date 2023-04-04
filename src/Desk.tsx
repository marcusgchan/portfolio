import { useGLTF } from "@react-three/drei";
import { GroupProps } from "@react-three/fiber";

/*
  Auto-generated by: https://github.com/pmndrs/gltfjsx
*/
export default function Desk(props: GroupProps) {
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
