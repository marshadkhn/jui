'use client';

import { useGLTF, useTexture } from '@react-three/drei';

export function ModelPreloader() {
  // Explicitly call useGLTF inside the Canvas context.
  // This suspends the Canvas until these assets are fully loaded and cached,
  // allowing useProgress() to accurately track their loading status.
  useGLTF('/models/Emblem.glb');
  useGLTF('/AnimatedModels/Card-transformed.glb');
  useGLTF('/models/Paint_mixer-transformed.glb');
  useGLTF('/models/Earth1_.2.glb');

  // Note: Product models (Note_printer, etc.) are preloaded inside
  // their own ProductModelCanvas contexts — NOT here.

  // Preload textures inside the Canvas context
  useTexture('/smoke.png');

  return null;
}
