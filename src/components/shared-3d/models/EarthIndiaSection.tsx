'use client';

import * as THREE from 'three';
import React, { useMemo, useRef, useEffect } from 'react';
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
  onSelectCompany?: (company: PrincipalCompany | null, point3D?: THREE.Vector3) => void;
  onScreenPosChange?: (pos: { x: number; y: number } | null) => void;
  onDebugInfo?: (info: string) => void;
};

// 🎯 Strict Red Dot Hit Threshold (corresponds to exact pixel radius of the glowing dot)
const EXACT_RED_DOT_THRESHOLD_UV = 0.0065;

export function EarthIndiaModel({
  autoRotate = false,
  rotationSpeed = 0,
  size = 14.8,
  initialRotation = [0.420, -0.330, 0.110],
  enableFlicker = true,
  selectedCompany = null,
  onSelectCompany,
  onScreenPosChange,
  onDebugInfo,
  ...props
}: EarthIndiaModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef({ uTime: { value: 0 } });
  const selectedMeshPointRef = useRef<THREE.Vector3 | null>(null);
  const terreMeshRef = useRef<THREE.Mesh | null>(null);
  const { scene } = useGLTF('/AnimatedModels/Erarth_india_section.glb');

  // Clone and automatically normalize geometry bounds & inject dynamic pure red flicker shader
  const { clonedScene, normScale, offset, beaconLocalMap } = useMemo(() => {
    const clone = scene.clone(true);
    let terreMesh: THREE.Mesh | null = null;
    const localMap: Record<number, THREE.Vector3> = {};

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        const mesh = child as THREE.Mesh;
        if (mesh.name.includes('TERRE') || mesh.name.includes('0.001')) {
          terreMesh = mesh;
          terreMeshRef.current = mesh;
        }

        if (mesh.material) {
          const applyMaterialShader = (originalMat: THREE.Material) => {
            const mat = originalMat.clone() as THREE.MeshStandardMaterial;
            mesh.material = mat;
            mat.side = THREE.DoubleSide;

            if (enableFlicker && mat.isMeshStandardMaterial) {
              mat.customProgramCacheKey = () => 'earth_india_red_beacon_v13';

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

    // Compute exact local vertex coordinates for each of the 59 points
    if (terreMesh) {
      const mesh = terreMesh as THREE.Mesh;
      const geom = mesh.geometry;
      const posAttr = geom.attributes.position;
      const uvAttr = geom.attributes.uv;

      if (posAttr && uvAttr) {
        for (const pt of BLINKING_POINTS) {
          let bestDistSq = Infinity;
          let bestIdx = 0;
          for (let i = 0; i < uvAttr.count; i++) {
            const du = uvAttr.getX(i) - pt.u;
            const dv = uvAttr.getY(i) - pt.vThree;
            const d2 = du * du + dv * dv;
            if (d2 < bestDistSq) {
              bestDistSq = d2;
              bestIdx = i;
            }
          }
          const vx = posAttr.getX(bestIdx);
          const vy = posAttr.getY(bestIdx);
          const vz = posAttr.getZ(bestIdx);
          const vLen = Math.sqrt(vx * vx + vy * vy + vz * vz) || 5000;
          const factor = (vLen + 20) / vLen;

          localMap[pt.clusterId] = new THREE.Vector3(vx * factor, vy * factor, vz * factor);
        }
      }
    }

    const box = new THREE.Box3().setFromObject(clone);
    const boxSize = new THREE.Vector3();
    box.getSize(boxSize);
    const maxDim = Math.max(boxSize.x, boxSize.y, boxSize.z) || 1;
    const normScale = size / maxDim;

    const center = new THREE.Vector3();
    box.getCenter(center);

    return { clonedScene: clone, normScale, offset: center, beaconLocalMap: localMap };
  }, [scene, size, enableFlicker]);

  // Reset target point when selection is cleared
  useEffect(() => {
    if (!selectedCompany) {
      selectedMeshPointRef.current = null;
      onScreenPosChange?.(null);
    }
  }, [selectedCompany, onScreenPosChange]);

  useFrame((state, delta) => {
    timeRef.current.uTime.value = state.clock.elapsedTime;

    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * rotationSpeed;
    }

    // Project selected 3D location to 2D screen coordinates
    if (selectedMeshPointRef.current && onScreenPosChange && terreMeshRef.current) {
      const worldPos = selectedMeshPointRef.current.clone();
      worldPos.applyMatrix4(terreMeshRef.current.matrixWorld);
      worldPos.project(state.camera);

      const x = (worldPos.x * 0.5 + 0.5) * state.size.width;
      const y = (-worldPos.y * 0.5 + 0.5) * state.size.height;

      // Only show if point is facing the camera
      if (worldPos.z < 1) {
        onScreenPosChange({ x, y });
      }
    }
  });

  // Handle direct clicks on globe mesh with exact red dot precision
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

      // ONLY trigger if clicked directly on the glowing red dot
      if (closestPt && minUvDist <= EXACT_RED_DOT_THRESHOLD_UV) {
        console.log(`[Exact Red Dot Click] #${closestPt.clusterId} ${closestPt.company.name} (dist: ${minUvDist.toFixed(4)})`);

        // Set initial screen position immediately from the click
        const clickX = e.clientX || (e.nativeEvent as MouseEvent).clientX;
        const clickY = e.clientY || (e.nativeEvent as MouseEvent).clientY;
        if (clickX && clickY) {
          onScreenPosChange?.({ x: clickX, y: clickY });
        }

        // Anchor 3D vertex position for ongoing tracking
        const exactLocalPoint = beaconLocalMap[closestPt.clusterId];
        if (exactLocalPoint) {
          selectedMeshPointRef.current = exactLocalPoint.clone();
        } else if (terreMeshRef.current && e.point) {
          const localPoint = e.point.clone();
          terreMeshRef.current.worldToLocal(localPoint);
          selectedMeshPointRef.current = localPoint;
        }

        onSelectCompany?.(closestPt.company, e.point);
      } else {
        // If clicked on empty space / non-red area, close any open callout
        onSelectCompany?.(null);
        onScreenPosChange?.(null);
      }
    }
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!e.uv) return;
    let minUvDist = Infinity;

    for (const pt of BLINKING_POINTS) {
      const du = pt.u - e.uv.x;
      const dv = pt.vThree - e.uv.y;
      const dist = Math.sqrt(du * du + dv * dv);
      if (dist < minUvDist) {
        minUvDist = dist;
      }
    }

    // Pointer cursor ONLY appears when directly over the red dot
    if (minUvDist <= EXACT_RED_DOT_THRESHOLD_UV) {
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
