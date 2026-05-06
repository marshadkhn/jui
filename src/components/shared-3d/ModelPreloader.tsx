'use client';

import { useGLTF } from '@react-three/drei';
import { useEffect } from 'react';

// List of all 3D models used in the application
const MODELS = [
  '/models/Emblem.glb',
  '/AnimatedModels/Note_printer2-transformed.glb',
  '/models/Note_printer_draco.glb',
  '/models/Card-transformed.glb',
  '/models/Paint_mixer-transformed.glb',
  '/AnimatedModels/Earth1_locations.glb',
  '/models/Card.glb',
  '/models/Paint_mixer.glb',
  '/models/Note_printer_draco.glb',
];

const TEXTURES = [
  '/smoke.png',
  '/logo.png',
  '/auth.png',
];

export function ModelPreloader() {
  useEffect(() => {
    // Preload all models
    MODELS.forEach((path) => {
      useGLTF.preload(path);
    });

    // Preload textures
    // Note: useTexture.preload is available in @react-three/drei
    // but for simplicity we can also just use the browser's Image object
    TEXTURES.forEach((path) => {
      const img = new Image();
      img.src = path;
    });
  }, []);

  return null;
}
