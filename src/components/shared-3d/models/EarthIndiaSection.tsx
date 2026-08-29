"use client";

import * as THREE from 'three';
import React, { useMemo, useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { PRINCIPALS_DATA, PrincipalCompany } from '@/data/principalsData';

// Configure Draco decoder path
useGLTF.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

/**
 * 📍 One location marker per principal company, placed at its REAL geographic
 * coordinates. `u` / `v` on the company record are a plain equirectangular
 * projection of lat/lng ( u = (lng + 180) / 360, v = (lat + 90) / 180 ), and
 * `vThree` is the same v flipped into the model's UV space.
 */
export interface LocationPoint {
  id: number;
  u: number;
  vThree: number;
  company: PrincipalCompany;
}

export const LOCATION_POINTS: LocationPoint[] = PRINCIPALS_DATA.map((company) => ({
  id: company.id,
  u: company.u,
  vThree: company.vThree ?? 1 - company.v,
  company,
}));

export const getLocationCompany = (id: number | null | undefined): PrincipalCompany | null =>
  (id == null ? null : PRINCIPALS_DATA.find((c) => c.id === id) ?? null);

// Marker sizing, in the globe geometry's own units (globe radius ≈ 5000)
const MARKER_CORE_RADIUS = 11;       // small solid dot
const MARKER_GLOW_RADIUS = 22;       // soft bloom hugging the dot
const MARKER_RING_RADIUS = 70;       // outer radius a radar ring expands to
const MARKER_RING_THICKNESS = 9;     // thin outline, as in the reference clip
const MARKER_HIT_RADIUS = 58;        // invisible, generous click target
const MARKER_ELEVATION = 26;         // lifts the marker clear of the surface
const MARKER_RING_COUNT = 2;         // staggered so a new ring starts mid-cycle

// Upper bound on the Position 2 / 3 size compensation (the globe is ~0.65x there,
// so ~1.55 is what is actually needed; the cap only guards the fly-out at the end).
const MARKER_MAX_SIZE_COMPENSATION = 1.8;

// 🪡 The featured location is marked with /cursor-needle.svg instead of a plain dot.
// Canvas is 1392 x 928 and the needle's sharp tip sits at 46.5% across / 72.5% down,
// so the sprite is anchored on that point and sways around it.
const NEEDLE_SPRITE_WIDTH = 190;
const NEEDLE_SPRITE_HEIGHT = NEEDLE_SPRITE_WIDTH * (928 / 1392);
const NEEDLE_TIP_U = 0.465;
const NEEDLE_TIP_V = 1 - 0.725;

// Two companies can sit a few km apart (Heilbronn / Bad Rappenau are 0.09° apart).
// Markers closer than this are nudged apart so every one stays clickable, and no
// marker is ever moved further than MARKER_MAX_SHIFT_DEG from its true location.
const MARKER_MIN_SEPARATION_DEG = 1.1;
const MARKER_MAX_SHIFT_DEG = 1.6;

// The globe travels between its scroll positions on a spring. The callout is only
// reported once the marker has actually come to rest, so the card appears already
// sitting on its dot instead of sliding across the screen for a second first.
// (Measured in screen px per second, so it behaves the same at any frame rate.)
// Measured: a marker drifts ~1.2 px/s from the Float wobble when the globe is at
// rest, so 25 px/s leaves a wide margin while still catching the spring's tail
// (the card lands within ~5 px of its final spot).
const ANCHOR_SETTLE_SPEED_PX_PER_SEC = 25;
const ANCHOR_SETTLE_FRAMES = 4;

export type EarthIndiaModelProps = React.ComponentProps<'group'> & {
  autoRotate?: boolean;
  rotationSpeed?: number;
  size?: number;
  initialRotation?: [number, number, number];
  enableFlicker?: boolean;
  selectedCompany?: PrincipalCompany | null;
  /** Id of the active location (matches PrincipalCompany.id) */
  selectedLocationId?: number | null;
  /** This location is drawn with the needle icon instead of a plain dot */
  needleLocationId?: number | null;
  onSelectCompany?: (company: PrincipalCompany | null, point3D?: THREE.Vector3) => void;
  onSelectLocation?: (id: number | null) => void;
  onScreenPosChange?: (pos: { x: number; y: number } | null) => void;
  onDebugInfo?: (info: string) => void;
};

export function EarthIndiaModel({
  autoRotate = false,
  rotationSpeed = 0,
  size = 14.8,
  initialRotation = [0.420, -0.330, 0.110],
  enableFlicker = true,
  selectedCompany = null,
  selectedLocationId = null,
  needleLocationId = null,
  onSelectCompany,
  onSelectLocation,
  onScreenPosChange,
  onDebugInfo,
  ...props
}: EarthIndiaModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef({ uTime: { value: 0 } });
  const terreMeshRef = useRef<THREE.Mesh | null>(null);
  const liveGlobeRef = useRef<THREE.Mesh | null>(null);
  const selectedMarkerRef = useRef<THREE.Object3D | null>(null);
  const billboardQuatRef = useRef(new THREE.Quaternion());
  const tmpQuatRef = useRef(new THREE.Quaternion());
  const lastAnchorRef = useRef<{ x: number; y: number } | null>(null);
  const settledFramesRef = useRef(0);
  const { scene } = useGLTF('/AnimatedModels/Erarth_india_section.glb');

  // Clone, normalize bounds, hide the baked texture dots and build the real location markers
  const { clonedScene, normScale, offset, markerGroup, markersById } = useMemo(() => {
    const clone = scene.clone(true);
    let terreMesh: THREE.Mesh | null = null;

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

            if (mat.isMeshStandardMaterial) {
              mat.customProgramCacheKey = () => 'earth_india_hide_baked_markers_v2';

              // 🚫 The GLB texture has decorative red dots baked in at approximate
              // places. They are painted out here so the only markers on the globe
              // are the real, data-driven ones added below.
              mat.onBeforeCompile = (shader) => {
                shader.uniforms.uTime = timeRef.current.uTime;

                shader.fragmentShader = `
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

                  // Any texel where red leads both other channels belongs to a baked
                  // dot (the globe artwork itself is blue/cyan only). The margin is
                  // deliberately small so the soft anti-aliased dot edges and the
                  // faint outer rings are caught too, not just the bright centres.
                  float otherMax = max( checkSample.g, checkSample.b );
                  bool isBakedMarker = ( checkSample.r > otherMax + 0.012 ) && ( checkSample.r > 0.035 );

                  if (isBakedMarker) {
                    // Replaced outright — no blend left over, so nothing of the old
                    // dot survives on the surface.
                    gl_FragColor.rgb = vec3(0.010, 0.034, 0.060);
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

    // 📍 Build one marker per company at its exact lat/lng position on the globe
    const group = new THREE.Group();
    group.name = 'JUI_LOCATION_MARKERS';
    const byId: Record<number, THREE.Object3D> = {};

    if (terreMesh) {
      const mesh = terreMesh as THREE.Mesh;
      const geom = mesh.geometry;
      geom.computeBoundingSphere();
      const globeRadius = geom.boundingSphere?.radius ?? 5000;
      const geomCenter = geom.boundingSphere?.center ?? new THREE.Vector3();
      const posAttr = geom.attributes.position;
      const uvAttr = geom.attributes.uv;

      if (posAttr && uvAttr) {
        // 1️⃣ Exact direction on the globe for each company's lat/lng.
        // The three nearest vertices in UV space are blended so the marker lands
        // between vertices instead of snapping to the closest one.
        const directions = LOCATION_POINTS.map((pt) => {
          const best: { idx: number; d2: number }[] = [];
          for (let i = 0; i < uvAttr.count; i++) {
            const du = uvAttr.getX(i) - pt.u;
            const dv = uvAttr.getY(i) - pt.vThree;
            const d2 = du * du + dv * dv;
            if (best.length < 3) {
              best.push({ idx: i, d2 });
              best.sort((a, b) => a.d2 - b.d2);
            } else if (d2 < best[2].d2) {
              best[2] = { idx: i, d2 };
              best.sort((a, b) => a.d2 - b.d2);
            }
          }

          const dir = new THREE.Vector3();
          let weightSum = 0;
          for (const b of best) {
            const w = 1 / (Math.sqrt(b.d2) + 1e-6);
            const v = new THREE.Vector3(
              posAttr.getX(b.idx),
              posAttr.getY(b.idx),
              posAttr.getZ(b.idx)
            ).sub(geomCenter).normalize();
            dir.addScaledVector(v, w);
            weightSum += w;
          }
          if (weightSum === 0 || dir.lengthSq() === 0) return null;
          return dir.normalize();
        });

        // 2️⃣ Declutter: cities only a few km apart (Heilbronn / Bad Rappenau are
        // 0.09° apart) would render as a single dot. Markers closer than
        // MARKER_MIN_SEPARATION are nudged apart along the surface, never further
        // than MARKER_MAX_SHIFT from their true position.
        const minSep = MARKER_MIN_SEPARATION_DEG * (Math.PI / 180);
        const maxShift = MARKER_MAX_SHIFT_DEG * (Math.PI / 180);
        const original = directions.map((d) => (d ? d.clone() : null));
        const tmp = new THREE.Vector3();

        for (let iter = 0; iter < 120; iter++) {
          let moved = false;

          for (let i = 0; i < directions.length; i++) {
            const a = directions[i];
            if (!a) continue;
            for (let j = i + 1; j < directions.length; j++) {
              const b = directions[j];
              if (!b) continue;

              const cos = THREE.MathUtils.clamp(a.dot(b), -1, 1);
              const angle = Math.acos(cos);
              if (angle >= minSep) continue;

              // Tangent that separates the two points along the sphere surface
              tmp.copy(a).addScaledVector(b, -cos);
              if (tmp.lengthSq() < 1e-12) {
                // Exactly coincident — pick a deterministic tangent instead
                tmp.set(a.y, -a.x, a.z * 0.5).addScaledVector(a, -a.dot(new THREE.Vector3(a.y, -a.x, a.z * 0.5)));
                if (tmp.lengthSq() < 1e-12) tmp.set(0, 1, 0).addScaledVector(a, -a.y);
              }
              tmp.normalize();

              const push = (minSep - angle) * 0.5;
              a.addScaledVector(tmp, push).normalize();
              b.addScaledVector(tmp, -push).normalize();
              moved = true;
            }
          }

          // Keep every marker within MARKER_MAX_SHIFT of its true location
          for (let i = 0; i < directions.length; i++) {
            const d = directions[i];
            const o = original[i];
            if (!d || !o) continue;
            const drift = Math.acos(THREE.MathUtils.clamp(d.dot(o), -1, 1));
            if (drift > maxShift) {
              d.copy(o).lerp(d, maxShift / drift).normalize();
            }
          }

          if (!moved) break;
        }

        // 3️⃣ Build the markers
        const coreGeom = new THREE.SphereGeometry(MARKER_CORE_RADIUS, 14, 14);
        const glowGeom = new THREE.SphereGeometry(MARKER_GLOW_RADIUS, 14, 14);
        const ringGeom = new THREE.RingGeometry(
          MARKER_RING_RADIUS - MARKER_RING_THICKNESS,
          MARKER_RING_RADIUS,
          64
        );
        const hitGeom = new THREE.SphereGeometry(MARKER_HIT_RADIUS, 8, 8);

        const needleTexture =
          needleLocationId == null
            ? null
            : (() => {
                const tex = new THREE.TextureLoader().load('/cursor-needle.svg');
                tex.colorSpace = THREE.SRGBColorSpace;
                return tex;
              })();

        LOCATION_POINTS.forEach((pt, index) => {
          const dir = directions[index];
          if (!dir) return;

          const isNeedle = needleTexture != null && pt.id === needleLocationId;

          const position = dir.clone().multiplyScalar(globeRadius + MARKER_ELEVATION).add(geomCenter);

          const marker = new THREE.Group();
          marker.position.copy(position);
          marker.name = `LOCATION_${pt.id}`;
          marker.userData.locationId = pt.id;
          marker.userData.phase = ((index * 137.5) % 360) * (Math.PI / 180);

          // The featured point wears the needle; every other point keeps the dot
          const core: THREE.Object3D = isNeedle
            ? (() => {
                const sprite = new THREE.Sprite(
                  new THREE.SpriteMaterial({
                    map: needleTexture,
                    transparent: true,
                    depthWrite: false,
                    toneMapped: false,
                  })
                );
                // Anchor the sprite on the needle's tip so it rests on the location
                sprite.center.set(NEEDLE_TIP_U, NEEDLE_TIP_V);
                sprite.scale.set(NEEDLE_SPRITE_WIDTH, NEEDLE_SPRITE_HEIGHT, 1);
                sprite.userData.role = 'needle';
                return sprite;
              })()
            : (() => {
                const dot = new THREE.Mesh(
                  coreGeom,
                  new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff1133'), toneMapped: false })
                );
                dot.userData.role = 'core';
                return dot;
              })();
          core.userData.locationId = pt.id;

          // Soft bloom around the dot
          const glow = new THREE.Mesh(
            glowGeom,
            new THREE.MeshBasicMaterial({
              color: new THREE.Color('#ff2038'),
              transparent: true,
              opacity: 0.22,
              blending: THREE.AdditiveBlending,
              depthWrite: false,
              toneMapped: false,
            })
          );
          glow.userData.locationId = pt.id;
          glow.userData.role = 'glow';

          // Thin radar rings that expand out of the dot and fade away
          const rings: THREE.Mesh[] = [];
          for (let r = 0; r < MARKER_RING_COUNT; r++) {
            const ring = new THREE.Mesh(
              ringGeom,
              new THREE.MeshBasicMaterial({
                color: new THREE.Color('#ff2a44'),
                transparent: true,
                opacity: 0,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                toneMapped: false,
              })
            );
            ring.userData.locationId = pt.id;
            ring.userData.role = 'ring';
            ring.userData.ringOffset = r / MARKER_RING_COUNT;
            rings.push(ring);
          }

          // Invisible but ray-castable sphere so the dot is comfortable to click
          const hit = new THREE.Mesh(
            hitGeom,
            new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
          );
          hit.userData.locationId = pt.id;
          hit.userData.role = 'hit';

          marker.add(core, glow, hit, ...rings);
          group.add(marker);
          byId[pt.id] = marker;
        });

        mesh.add(group);
      }
    }

    const box = new THREE.Box3().setFromObject(clone);
    const boxSize = new THREE.Vector3();
    box.getSize(boxSize);
    const maxDim = Math.max(boxSize.x, boxSize.y, boxSize.z) || 1;
    const normScale = size / maxDim;

    const center = new THREE.Vector3();
    box.getCenter(center);

    return { clonedScene: clone, normScale, offset: center, markerGroup: group, markersById: byId };
  }, [scene, size, enableFlicker, needleLocationId]);

  // 📍 Anchor the callout to the selected marker (works for clicks and for the
  // default location that opens on its own, with no click involved)
  useEffect(() => {
    lastAnchorRef.current = null;
    settledFramesRef.current = 0;

    if (selectedLocationId == null) {
      selectedMarkerRef.current = null;
      onScreenPosChange?.(null);
      return;
    }
    selectedMarkerRef.current = markersById[selectedLocationId] ?? null;
  }, [selectedLocationId, markersById, onScreenPosChange]);

  // 🌍 Resolve the globe mesh actually mounted in the rendered scene graph.
  // `terreMeshRef` is captured while cloning, so its matrixWorld can be missing
  // the parent group transforms — the live one is the reliable reference.
  const getLiveGlobeMesh = (): THREE.Mesh | null => {
    const cached = liveGlobeRef.current;
    if (cached && cached.parent) return cached;

    let found: THREE.Mesh | null = null;
    groupRef.current?.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!found && mesh.isMesh && (mesh.name.includes('TERRE') || mesh.name.includes('0.001'))) {
        found = mesh;
      }
    });

    liveGlobeRef.current = found ?? terreMeshRef.current;
    return liveGlobeRef.current;
  };

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const billboardQuat = billboardQuatRef.current;
    const tmpQuat = tmpQuatRef.current;
    timeRef.current.uTime.value = t;

    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * rotationSpeed;
    }

    // ✨ Radar pulse on every location marker.
    // The rings are flat circles, so they are turned to face the camera each frame
    // (all markers share the globe's orientation, so the maths is done once).
    if (markerGroup.children.length) {
      billboardQuat.copy(markerGroup.getWorldQuaternion(tmpQuat).invert());
      billboardQuat.multiply(state.camera.quaternion);
    }

    // 🔍 The globe shrinks on Positions 2 and 3 (size 14.8 → 10.1 → 9.6 gives a group
    // scale of 1.0 → 0.68 → 0.65), and the markers were shrinking with it until they
    // were barely visible. Scaling each marker by the inverse of that keeps every dot
    // the same size on screen at all three positions. Clamped so they cannot balloon
    // while the globe flies away at the end of the section.
    const stageScale = groupRef.current?.parent?.scale.x ?? 1;
    const sizeComp = THREE.MathUtils.clamp(
      stageScale > 0.01 ? 1 / stageScale : 1,
      1,
      MARKER_MAX_SIZE_COMPENSATION
    );

    for (const marker of markerGroup.children) {
      const phase = (marker.userData.phase as number) ?? 0;
      const isActive = marker.userData.locationId === selectedLocationId;
      const pulse = Math.sin(t * 2.6 + phase) * 0.5 + 0.5;

      for (const part of marker.children) {
        const mesh = part as THREE.Mesh;
        const role = mesh.userData.role as string;

        if (role === 'needle') {
          // Gentle breathing plus a slow sway around the tip
          const sprite = part as THREE.Sprite;
          const breathe = sizeComp * (isActive ? 1.12 : 1.0) * (0.94 + pulse * 0.12);
          sprite.scale.set(
            NEEDLE_SPRITE_WIDTH * breathe,
            NEEDLE_SPRITE_HEIGHT * breathe,
            1
          );
          (sprite.material as THREE.SpriteMaterial).rotation = Math.sin(t * 1.15 + phase) * 0.10;
        } else if (role === 'core') {
          mesh.scale.setScalar(sizeComp * (isActive ? 1.35 : 1.0) * (0.88 + pulse * 0.28));
        } else if (role === 'hit') {
          mesh.scale.setScalar(sizeComp);
        } else if (role === 'glow') {
          mesh.scale.setScalar(sizeComp);
          const mat = mesh.material as THREE.MeshBasicMaterial;
          mat.opacity = (isActive ? 0.34 : 0.2) * (0.7 + pulse * 0.5);
        } else if (role === 'ring') {
          // 0 → 1 sweep: starts at the dot, expands outward, fades as it goes
          const offset = (mesh.userData.ringOffset as number) ?? 0;
          const sweep = ((t * 0.5 + phase * 0.16 + offset) % 1 + 1) % 1;

          mesh.quaternion.copy(billboardQuat);
          mesh.scale.setScalar(sizeComp * (0.16 + sweep * 0.92));

          const mat = mesh.material as THREE.MeshBasicMaterial;
          // fade in quickly, then out — nothing visible at the very start
          const fadeIn = Math.min(sweep / 0.12, 1);
          const fadeOut = 1 - sweep;
          mat.opacity = fadeIn * fadeOut * fadeOut * (isActive ? 1.0 : 0.85);
        }
      }
    }

    // Project the selected location to 2D screen coordinates, hiding it once it
    // rotates onto the far side of the globe
    const liveGlobe = getLiveGlobeMesh();
    const marker = selectedMarkerRef.current;

    if (marker && onScreenPosChange && liveGlobe) {
      const worldPos = marker.getWorldPosition(new THREE.Vector3());

      const globeCenter = liveGlobe.geometry.boundingSphere
        ? liveGlobe.geometry.boundingSphere.center.clone().applyMatrix4(liveGlobe.matrixWorld)
        : liveGlobe.getWorldPosition(new THREE.Vector3());

      const surfaceNormal = worldPos.clone().sub(globeCenter).normalize();
      const viewDir = state.camera.position.clone().sub(worldPos).normalize();

      const projected = worldPos.clone().project(state.camera);
      const x = (projected.x * 0.5 + 0.5) * state.size.width;
      const y = (-projected.y * 0.5 + 0.5) * state.size.height;

      // Visible only when the marker faces the camera AND is inside the viewport
      // (the globe flies off-screen at the end of the section)
      const facing = surfaceNormal.dot(viewDir) > -0.08;
      const onScreen =
        projected.z < 1 &&
        x > -40 && x < state.size.width + 40 &&
        y > -40 && y < state.size.height + 40;

      // Has the anchor stopped moving? While the globe springs between positions the
      // marker races across the screen, and the card must not be dragged along with it.
      const previous = lastAnchorRef.current;
      const speed = previous
        ? Math.hypot(x - previous.x, y - previous.y) / Math.max(delta, 1 / 240)
        : Infinity;
      lastAnchorRef.current = { x, y };

      if (speed <= ANCHOR_SETTLE_SPEED_PX_PER_SEC) {
        settledFramesRef.current = Math.min(settledFramesRef.current + 1, ANCHOR_SETTLE_FRAMES);
      } else {
        settledFramesRef.current = 0;
      }

      const settled = settledFramesRef.current >= ANCHOR_SETTLE_FRAMES;

      if (facing && onScreen && settled) {
        onScreenPosChange({ x, y });
      } else {
        onScreenPosChange(null);
      }
    }
  });

  // Clicking a marker selects exactly that company; clicking bare globe closes
  const handleMeshClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();

    const hitId = e.object?.userData?.locationId as number | undefined;

    if (hitId != null) {
      const point = LOCATION_POINTS.find((p) => p.id === hitId);
      if (point) {
        selectedMarkerRef.current = markersById[hitId] ?? null;
        onDebugInfo?.(`#${hitId} ${point.company.name} — ${point.company.city}, ${point.company.country}`);
        onSelectLocation?.(hitId);
        onSelectCompany?.(point.company, e.point);
        return;
      }
    }

    selectedMarkerRef.current = null;
    onSelectLocation?.(null);
    onSelectCompany?.(null);
    onScreenPosChange?.(null);
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    const hovering = e.object?.userData?.locationId != null;
    document.body.style.cursor = hovering ? 'pointer' : 'default';
  };

  const handlePointerOut = () => {
    document.body.style.cursor = 'default';
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
          onPointerMove={handlePointerMove}
          onPointerOut={handlePointerOut}
        />
      </group>
    </group>
  );
}

export const Model = EarthIndiaModel;
export default EarthIndiaModel;

useGLTF.preload('/AnimatedModels/Erarth_india_section.glb');
