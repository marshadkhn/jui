'use client';

import * as THREE from 'three';
import React, { useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

// Configure Draco decoder path
useGLTF.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

export type EarthIndiaModelProps = React.ComponentProps<'group'> & {
  autoRotate?: boolean;
  rotationSpeed?: number;
  size?: number;
  initialRotation?: [number, number, number];
  enableFlicker?: boolean;
};

export function EarthIndiaModel({
  autoRotate = false,
  rotationSpeed = 0,
  size = 14.8,
  initialRotation = [0.420, -0.330, 0.110],
  enableFlicker = true,
  ...props
}: EarthIndiaModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef({ uTime: { value: 0 } });
  const { scene } = useGLTF('/AnimatedModels/Erarth_india_section.glb');

  // Clone and automatically normalize geometry bounds & inject dynamic pure red flicker shader
  const { clonedScene, normScale, offset } = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const applyMaterialShader = (originalMat: THREE.Material) => {
            // Clone material so each instance has independent shader compilation
            const mat = originalMat.clone() as THREE.MeshStandardMaterial;
            mesh.material = mat;
            mat.side = THREE.DoubleSide;

            if (enableFlicker && mat.isMeshStandardMaterial) {
              mat.customProgramCacheKey = () => 'earth_india_red_beacon_v4';

              mat.onBeforeCompile = (shader) => {
                shader.uniforms.uTime = timeRef.current.uTime;

                // Prepend uniform declaration
                shader.fragmentShader = `
                  uniform float uTime;
                ` + shader.fragmentShader;

                // Inject pure neon red flicker directly into opaque fragment
                shader.fragmentShader = shader.fragmentShader.replace(
                  '#include <opaque_fragment>',
                  `
                  #include <opaque_fragment>
                  
                  #ifdef USE_EMISSIVEMAP
                    vec4 checkSample = texture2D( emissiveMap, vEmissiveMapUv );
                  #else
                    #ifdef USE_MAP
                      vec4 checkSample = texture2D( map, vMapUv );
                    #else
                      vec4 checkSample = vec4(0.0);
                    #endif
                  #endif

                  // Detect red location marker points
                  bool isRedMarker = (checkSample.r > 0.15 && (checkSample.r - checkSample.g > 0.05) && (checkSample.r - checkSample.b > 0.05));

                  if (isRedMarker) {
                    // Smooth rhythmic satellite ping (5.0Hz)
                    float ping = sin(uTime * 5.0) * 0.5 + 0.5;
                    // Secondary rapid radar ping (10.0Hz)
                    float rapidPing = pow(sin(uTime * 10.0) * 0.5 + 0.5, 3.0);
                    // High-tech digital telemetry micro-flicker (18.0Hz)
                    float digitalFlicker = fract(sin(floor(uTime * 18.0) * 43758.5453) * 19.34);
                    
                    float glowIntensity = mix(0.4, 3.8, ping) + rapidPing * 2.8 + digitalFlicker * 1.5;

                    // 100% Pure Glowing Laser Red
                    gl_FragColor.rgb = vec3(2.8, 0.03, 0.06) * glowIntensity;
                  }
                  `
                );
              };

              mat.needsUpdate = true;
            }
          };

          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(applyMaterialShader);
          } else {
            applyMaterialShader(mesh.material);
          }
        }
      }
    });

    const box = new THREE.Box3().setFromObject(clone);
    const boxSize = new THREE.Vector3();
    box.getSize(boxSize);
    const maxDim = Math.max(boxSize.x, boxSize.y, boxSize.z) || 1;
    const normScale = size / maxDim;

    const center = new THREE.Vector3();
    box.getCenter(center);

    return { clonedScene: clone, normScale, offset: center };
  }, [scene, size, enableFlicker]);

  useFrame((state, delta) => {
    timeRef.current.uTime.value = state.clock.elapsedTime;

    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * rotationSpeed;
    }
  });

  return (
    <group ref={groupRef} rotation={initialRotation} {...props} dispose={null}>
      <primitive
        object={clonedScene}
        scale={normScale}
        position={[
          -offset.x * normScale,
          -offset.y * normScale,
          -offset.z * normScale,
        ]}
      />
    </group>
  );
}

export const Model = EarthIndiaModel;
export default EarthIndiaModel;

useGLTF.preload('/AnimatedModels/Erarth_india_section.glb');
