'use client'

import React, { useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'

/**
 * WhatWeDo model — the combined Earth + Ashoka-emblem scene from
 * /models/whatWeDo.glb. The GLB is authored at ~270 world units and centered
 * at the origin, so we normalize it to a sane on-screen size on an INNER object
 * and let callers control placement (scale/rotation/position) via the OUTER group.
 */
export function Model(props: React.JSX.IntrinsicElements['group']) {
  const { scene } = useGLTF('/models/whatWeDo.glb')

  const normalized = useMemo(() => {
    const clone = scene.clone(true)
    const box = new THREE.Box3().setFromObject(clone)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    const fit = 5.2 / maxDim // ~5.2 world units — fills the canvas without cropping/cutting open
    clone.position.sub(center.multiplyScalar(fit)) // recenter at origin
    clone.scale.setScalar(fit)
    return clone
  }, [scene])

  return (
    <group {...props} dispose={null}>
      <primitive object={normalized} />
    </group>
  )
}

useGLTF.preload('/models/whatWeDo.glb')
