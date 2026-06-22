import * as THREE from 'three'
import React from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFAction = THREE.AnimationClip
type GLTFResult = GLTF & {
  nodes: {
    Cylinder034: THREE.Mesh
    Cylinder035: THREE.Mesh
    Cylinder028: THREE.Mesh
    Cube013_1: THREE.Mesh
    Cube013_2: THREE.Mesh
    Cube013: THREE.Mesh
    Cylinder036: THREE.Mesh
  }
  materials: {
    Black_Metal: THREE.MeshStandardMaterial
    Material: THREE.MeshStandardMaterial
    Logo: THREE.MeshStandardMaterial
  }
  animations: GLTFAction[]
}

type BlueprintMeshProps = React.JSX.IntrinsicElements['mesh'] & {
  geometry: THREE.BufferGeometry
  material: THREE.MeshStandardMaterial
  isMobile?: boolean
}

const BlueprintMesh = ({ geometry, material, isMobile, ...props }: BlueprintMeshProps) => (
  <mesh geometry={geometry} {...props}>
    {/* Base Material (True Texture) */}
    <meshStandardMaterial {...(material as unknown as React.ComponentProps<'meshStandardMaterial'>)} transparent opacity={0.8} />
    {/* Technical Wireframe Overlay - SKIP ON MOBILE */}
    {!isMobile && (
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color="#00D1FF"
          wireframe
          transparent
          opacity={0.3}
          emissive="#00D1FF"
          emissiveIntensity={0.5}
        />
      </mesh>
    )}
  </mesh>
)


export function Model({ isMobile, ...props }: React.JSX.IntrinsicElements['group'] & { isMobile?: boolean }) {
  const { nodes, materials } = useGLTF('/models/Note_printer_draco.glb') as unknown as GLTFResult
  return (
    <group {...props} dispose={null}>
      <BlueprintMesh name="Cylinder034" castShadow={!isMobile} receiveShadow={!isMobile} geometry={nodes.Cylinder034.geometry} material={materials.Black_Metal} position={[-0.442, -0.535, 0]} scale={0.998} isMobile={isMobile} />
      <BlueprintMesh name="Cylinder035" castShadow={!isMobile} receiveShadow={!isMobile} geometry={nodes.Cylinder035.geometry} material={materials.Material} position={[-0.442, -0.535, 0]} scale={1.001} isMobile={isMobile} />
      <BlueprintMesh name="Cylinder028" castShadow={!isMobile} receiveShadow={!isMobile} geometry={nodes.Cylinder028.geometry} material={materials.Material} position={[0, 2.559, 0]} rotation={[0, 0, -Math.PI / 2]} scale={[1.005, 0.275, 1.005]} isMobile={isMobile} />

      <group name="Cube012" position={[0, 2.559, 0]} rotation={[-0.028, 0, 0]}>
        <BlueprintMesh name="Cube013_1" castShadow={!isMobile} receiveShadow={!isMobile} geometry={nodes.Cube013_1.geometry} material={materials.Black_Metal} isMobile={isMobile} />
        {/* Glow Logo Special */}
        <mesh name="Cube013_2" castShadow={!isMobile} receiveShadow={!isMobile} geometry={nodes.Cube013_2.geometry}>
          <meshStandardMaterial
            {...materials.Logo}
            color="#00D1FF"
            emissive="#00D1FF"
            emissiveIntensity={10}
            toneMapped={false}
            transparent={true}
            opacity={5}
            side={THREE.DoubleSide}
            polygonOffset
            polygonOffsetFactor={-1}
            polygonOffsetUnits={-1}
          />
        </mesh>
      </group>

      <BlueprintMesh name="Cube013" castShadow={!isMobile} receiveShadow={!isMobile} geometry={nodes.Cube013.geometry} material={materials.Material} position={[0, 2.559, 0]} rotation={[-0.028, 0, 0]} scale={1.001} isMobile={isMobile} />
      <BlueprintMesh name="Cylinder036" castShadow={!isMobile} receiveShadow={!isMobile} geometry={nodes.Cylinder036.geometry} material={materials.Black_Metal} position={[0, 2.559, 0]} rotation={[0, 0, -Math.PI / 2]} scale={[1, 0.274, 1]} isMobile={isMobile} />
    </group>
  )
}


useGLTF.preload('/models/Note_printer_draco.glb')

