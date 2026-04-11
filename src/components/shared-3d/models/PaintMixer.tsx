import * as THREE from 'three'
import React from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFAction = any

type GLTFResult = GLTF & {
  nodes: {
    Cylinder001: THREE.Mesh
  }
  materials: {
    Material: THREE.MeshStandardMaterial
  }
  animations: GLTFAction[]
}

export function Model({ isMobile, ...props }: React.JSX.IntrinsicElements['group'] & { isMobile?: boolean }) {
  const { nodes, materials } = useGLTF('/models/Paint_mixer-transformed.glb') as unknown as GLTFResult
  return (
    <group {...props} dispose={null}>
      <mesh castShadow={!isMobile} receiveShadow={!isMobile} geometry={nodes.Cylinder001.geometry}>
        <meshStandardMaterial 
          {...materials.Material}
          color="#00D1FF"
          emissive="#00D1FF"
          emissiveIntensity={2}
          toneMapped={false}
          transparent
          opacity={0.9}
        />
        {/* Holographic Wireframe Layer - SKIP ON MOBILE */}
        {!isMobile && (
          <mesh geometry={nodes.Cylinder001.geometry}>
            <meshStandardMaterial 
              color="#00D1FF"
              wireframe
              transparent
              opacity={0.2}
              emissive="#00D1FF"
              emissiveIntensity={0.5}
            />
          </mesh>
        )}
      </mesh>
    </group>
  )
}


useGLTF.preload('/models/Paint_mixer-transformed.glb')


