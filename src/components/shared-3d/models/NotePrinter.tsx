import * as THREE from 'three'
import React from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFAction = any
type GLTFResult = GLTF & {
  nodes: {
    Cylinder028: THREE.Mesh
    Cube013_1: THREE.Mesh
    Cube013_2: THREE.Mesh
    Cube013: THREE.Mesh
    Cylinder036: THREE.Mesh
    Cylinder034: THREE.Mesh
    Cylinder035: THREE.Mesh
  }
  materials: {
    Material: THREE.MeshStandardMaterial
    Black_Metal: THREE.MeshStandardMaterial
    Logo: THREE.MeshStandardMaterial
  }
  animations: GLTFAction[]
}

export function Model(props: React.JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/Note_printer.glb') as unknown as GLTFResult
  return (
    <group {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.Cylinder028.geometry} material={materials.Material} position={[0, 2.559, 0]} rotation={[0, 0, -Math.PI / 2]} scale={[1.005, 0.275, 1.005]} />
      <group position={[0, 2.559, 0]} rotation={[-0.028, 0, 0]}>
        <mesh castShadow receiveShadow geometry={nodes.Cube013_1.geometry} material={materials.Black_Metal} />
        <mesh castShadow receiveShadow geometry={nodes.Cube013_2.geometry} material={materials.Logo} />
      </group>
      <mesh castShadow receiveShadow geometry={nodes.Cube013.geometry} material={materials.Material} position={[0, 2.559, 0]} rotation={[-0.028, 0, 0]} scale={1.001} />
      <mesh castShadow receiveShadow geometry={nodes.Cylinder036.geometry} material={materials.Black_Metal} position={[0, 2.559, 0]} rotation={[0, 0, -Math.PI / 2]} scale={[1, 0.274, 1]} />
      <mesh castShadow receiveShadow geometry={nodes.Cylinder034.geometry} material={materials.Black_Metal} position={[-0.442, -0.535, 0]} scale={0.998} />
      <mesh castShadow receiveShadow geometry={nodes.Cylinder035.geometry} material={materials.Material} position={[-0.442, -0.535, 0]} scale={1.001} />
    </group>
  )
}

useGLTF.preload('/Note_printer.glb')
