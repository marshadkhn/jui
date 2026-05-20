'use client';

import { useGLTF, useTexture } from '@react-three/drei';

export function ModelPreloader() {
  // Explicitly call useGLTF inside the Canvas context.
  // This suspends the Canvas until these assets are fully loaded and cached,
  // allowing useProgress() to accurately track their loading status.
  useGLTF('/models/Emblem.glb');
  useGLTF('/AnimatedModels/Note_printer2-transformed.glb');
  useGLTF('/models/Note_printer_draco.glb');
  useGLTF('/AnimatedModels/Card-transformed.glb');
  useGLTF('/models/Paint_mixer-transformed.glb');
  useGLTF('/AnimatedModels/Earth1_locations.glb');

  // Preload textures inside the Canvas context
  useTexture('/smoke.png');

  return null;
}
