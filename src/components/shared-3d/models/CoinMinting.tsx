'use client';

import * as THREE from 'three';
import React, { useEffect, useMemo, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';

// Ensure Draco decoder is configured before loading
useGLTF.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

export function CoinMinting(props: React.JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/AnimatedModels/Coin_minting_animated_v2.glb');
  const { actions, names } = useAnimations(animations, scene);

  // Play CoinMintingCycle animation smoothly in a loop
  useEffect(() => {
    if (actions) {
      const action = actions[names[0]] || actions['CoinMintingCycle'];
      if (action) {
        action.reset().fadeIn(0.3).play();
      }
    }
  }, [actions, names]);

  // Enhance material properties for high-contrast neon cyan wireframe & vivid rupee emblems
  useMemo(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.Material;
        if (mat) {
          if (mat.name === 'Wireframe') {
            const m = mat as THREE.MeshStandardMaterial;
            m.emissive = new THREE.Color('#00ffff');
            m.emissiveIntensity = 1.6;
            m.toneMapped = false;
          } else if (mat.name === 'Rupees_symbol') {
            const m = mat as THREE.MeshStandardMaterial;
            m.emissive = new THREE.Color('#38bdf8');
            m.emissiveIntensity = 1.2;
            m.toneMapped = false;
            m.side = THREE.DoubleSide;
          } else if (mat.name === 'Black') {
            const m = mat as THREE.MeshStandardMaterial;
            m.color = new THREE.Color('#030812');
            m.roughness = 0.25;
            m.metalness = 0.35;
            m.transparent = true;
            m.opacity = 0.85;
          }
        }
      }
    });
  }, [scene]);

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

export default CoinMinting;

useGLTF.preload('/AnimatedModels/Coin_minting_animated_v2.glb');
