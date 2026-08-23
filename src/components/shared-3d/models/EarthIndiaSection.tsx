'use client';

import * as THREE from 'three';
import React, { useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { BLINKING_POINTS, BlinkingPoint } from '@/data/blinkingPointsData';
import { PrincipalCompany } from '@/data/principalsData';

// Configure Draco decoder path
useGLTF.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

export type EarthIndiaModelProps = React.ComponentProps<'group'> & {
  autoRotate?: boolean;
  rotationSpeed?: number;
  size?: number;
  initialRotation?: [number, number, number];
  enableFlicker?: boolean;
  selectedCompany?: PrincipalCompany | null;
  onSelectCompany?: (company: PrincipalCompany | null) => void;
  onDebugInfo?: (info: string) => void;
};

export function EarthIndiaModel({
  autoRotate = false,
  rotationSpeed = 0,
  size = 14.8,
  initialRotation = [0.420, -0.330, 0.110],
  enableFlicker = true,
  selectedCompany = null,
  onSelectCompany,
  onDebugInfo,
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
            const mat = originalMat.clone() as THREE.MeshStandardMaterial;
            mesh.material = mat;
            mat.side = THREE.DoubleSide;

            if (enableFlicker && mat.isMeshStandardMaterial) {
              mat.customProgramCacheKey = () => 'earth_india_red_beacon_v9';

              mat.onBeforeCompile = (shader) => {
                shader.uniforms.uTime = timeRef.current.uTime;

                shader.fragmentShader =
                  `
                  uniform float uTime;
                ` + shader.fragmentShader;

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
                    float ping = sin(uTime * 5.0) * 0.5 + 0.5;
                    float rapidPing = pow(sin(uTime * 10.0) * 0.5 + 0.5, 3.0);
                    float digitalFlicker = fract(sin(floor(uTime * 18.0) * 43758.5453) * 19.34);
                    float glowIntensity = mix(0.4, 3.8, ping) + rapidPing * 2.8 + digitalFlicker * 1.5;
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

  // Handle direct clicks on globe mesh with inverted V matching
  const handleMeshClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const uv = e.uv;

    if (uv) {
      let closestPt: BlinkingPoint | null = null;
      let minUvDist = Infinity;

      for (const pt of BLINKING_POINTS) {
        const du = pt.u - uv.x;
        const dv = pt.vThree - uv.y;
        const dist = Math.sqrt(du * du + dv * dv);
        if (dist < minUvDist) {
          minUvDist = dist;
          closestPt = pt;
        }
      }

      if (closestPt) {
        const msg = `🎯 Clicked: #${closestPt.clusterId} ${closestPt.company.name} (${closestPt.company.city})`;
        console.log(msg, { uv, dist: minUvDist });
        onDebugInfo?.(msg);

        // Click threshold in UV space
        if (minUvDist < 0.06) {
          onSelectCompany?.(closestPt.company);
        }
      }
    }
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!e.uv) return;
    let minUvDist = Infinity;
    let hoverPt: BlinkingPoint | null = null;

    for (const pt of BLINKING_POINTS) {
      const du = pt.u - e.uv.x;
      const dv = pt.vThree - e.uv.y;
      const dist = Math.sqrt(du * du + dv * dv);
      if (dist < minUvDist) {
        minUvDist = dist;
        hoverPt = pt;
      }
    }

    if (minUvDist < 0.035 && hoverPt) {
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = 'default';
    }
  };

  return (
    <group ref={groupRef} rotation={initialRotation} {...props} dispose={null}>
      <group
        scale={normScale}
        position={[
          -offset.x * normScale,
          -offset.y * normScale,
          -offset.z * normScale,
        ]}
      >
        <primitive
          object={clonedScene}
          onClick={handleMeshClick}
          onPointerDown={handleMeshClick}
          onPointerMove={handlePointerMove}
        />
      </group>
    </group>
  );
}

export const Model = EarthIndiaModel;
export default EarthIndiaModel;

useGLTF.preload('/AnimatedModels/Erarth_india_section.glb');
