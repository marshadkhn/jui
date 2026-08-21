'use client';

import React, { forwardRef, Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { EarthIndiaModel } from '../shared-3d/models/EarthIndiaSection';

// 🔧 DEBUG — set to true so you can interactively adjust values
const DEFAULT_DEBUG = false;
const STORAGE_KEY = 'jui_earth_india_debug_v5';

interface IndiaSectionProps extends React.HTMLAttributes<HTMLElement> {}

const IndiaSection = forwardRef<HTMLElement, IndiaSectionProps>((props, ref) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 🔧 Locked coordinates: size 14.80, rot [0.420, -0.330, 0.110], pos [0.900, -2.300, -0.100]
  const [showDebug, setShowDebug] = useState(DEFAULT_DEBUG);
  const [debugSize, setDebugSize] = useState(14.80);
  const [debugRotX, setDebugRotX] = useState(0.420);
  const [debugRotY, setDebugRotY] = useState(-0.330);
  const [debugRotZ, setDebugRotZ] = useState(0.110);
  const [debugPosX, setDebugPosX] = useState(0.900);
  const [debugPosY, setDebugPosY] = useState(-2.300);
  const [debugPosZ, setDebugPosZ] = useState(-0.100);
  const [copied, setCopied] = useState(false);

  // Load saved slider state from localStorage on first mount
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    setMounted(true);

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.size !== undefined) setDebugSize(parsed.size);
        if (parsed.rotX !== undefined) setDebugRotX(parsed.rotX);
        if (parsed.rotY !== undefined) setDebugRotY(parsed.rotY);
        if (parsed.rotZ !== undefined) setDebugRotZ(parsed.rotZ);
        if (parsed.posX !== undefined) setDebugPosX(parsed.posX);
        if (parsed.posY !== undefined) setDebugPosY(parsed.posY);
        if (parsed.posZ !== undefined) setDebugPosZ(parsed.posZ);
      }
    } catch {
      // Ignore storage errors
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save slider state automatically whenever changed
  const saveState = (updated: Record<string, number>) => {
    try {
      const current = {
        size: debugSize,
        rotX: debugRotX,
        rotY: debugRotY,
        rotZ: debugRotZ,
        posX: debugPosX,
        posY: debugPosY,
        posZ: debugPosZ,
        ...updated,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch {
      // Ignore storage errors
    }
  };

  const handleCopyValues = () => {
    const text = `size: ${debugSize.toFixed(2)}\ninitialRotation: [${debugRotX.toFixed(3)}, ${debugRotY.toFixed(3)}, ${debugRotZ.toFixed(3)}]\nposition: [${debugPosX.toFixed(3)}, ${debugPosY.toFixed(3)}, ${debugPosZ.toFixed(3)}]`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      ref={(node) => {
        (sectionRef as React.MutableRefObject<HTMLElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = node;
      }}
      id="india-section"
      {...props}
      className={`relative w-full h-[220vh] bg-transparent z-20 ${props.className || ''}`}
    >
      {/* Sticky Stage: Seamless transparent viewport */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center bg-transparent">
        {/* 3D Model Canvas Container — Always 100% visible */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-10 bg-transparent opacity-100">
          {mounted && (
            <Canvas
              dpr={isMobile ? [1, 1] : [1, 2]}
              camera={{ position: [0, 0, 8], fov: 35 }}
              gl={{
                antialias: !isMobile,
                alpha: true,
                powerPreference: 'high-performance',
              }}
            >
              <Suspense fallback={null}>
                {/* 🌟 Balanced Space Lighting Suite */}
                <ambientLight intensity={1.8} color="#d4f1f9" />
                
                {/* Front Key Light directly illuminating India & face of globe */}
                <directionalLight position={[debugPosX, debugPosY + 4, 9]} intensity={3.8} color="#ffffff" />
                
                {/* Top-Right Rim / Space Sun Light */}
                <directionalLight position={[debugPosX + 9, debugPosY + 8, 5]} intensity={2.8} color="#e8f8ff" />
                
                {/* Left Cyan Atmosphere Rim Light */}
                <directionalLight position={[debugPosX - 9, debugPosY + 4, 3]} intensity={2.4} color="#00D1FF" />
                
                {/* Bottom-Up Atmospheric Bounce Light */}
                <directionalLight position={[debugPosX, debugPosY - 6, 4]} intensity={1.6} color="#0077aa" />

                {/* Omni Highlight Point Lights centered near Earth */}
                <pointLight position={[debugPosX, debugPosY, 6.5]} intensity={2.8} distance={20} color="#ffffff" />
                <pointLight position={[debugPosX + 2.5, debugPosY + 1.5, 5]} intensity={2.0} distance={16} color="#66e5ff" />
                <pointLight position={[debugPosX - 3, debugPosY - 2, 4]} intensity={1.6} distance={15} color="#00d1ff" />

                <Float
                  speed={1.0}
                  rotationIntensity={0.02}
                  floatIntensity={0.08}
                  floatingRange={[-0.02, 0.02]}
                >
                  <group position={[debugPosX, debugPosY, debugPosZ]}>
                    <EarthIndiaModel
                      size={isMobile ? debugSize * 0.75 : debugSize}
                      autoRotate={false}
                      initialRotation={[debugRotX, debugRotY, debugRotZ]}
                    />
                  </group>
                </Float>
              </Suspense>
            </Canvas>
          )}
        </div>

        {/* Content Overlay */}
        <div className="relative z-20 text-center max-w-4xl px-6 pointer-events-auto">
          {props.children}
        </div>
      </div>

      {/* 🚀 Floating Re-open Button (Visible when Debug Panel is closed) */}
      {!showDebug && (
        <button
          onClick={() => setShowDebug(true)}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'rgba(5, 12, 18, 0.90)',
            border: '1px solid rgba(0, 209, 255, 0.4)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6), 0 0 12px rgba(0, 209, 255, 0.25)',
            borderRadius: '24px',
            padding: '8px 16px',
            color: '#00D1FF',
            fontFamily: 'monospace',
            fontSize: '12px',
            fontWeight: 'bold',
            zIndex: 99999,
            cursor: 'pointer',
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backdropFilter: 'blur(12px)',
            transition: 'transform 0.15s ease, background 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
        >
          <span>🇮🇳</span>
          <span>Open Earth Debug</span>
        </button>
      )}

      {/* 🔧 DEBUG PANEL — Interactive real-time slider controls */}
      {showDebug && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'rgba(5, 12, 18, 0.94)',
            border: '1px solid rgba(0, 209, 255, 0.35)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.7), 0 0 15px rgba(0, 209, 255, 0.15)',
            borderRadius: '12px',
            padding: '16px 20px',
            color: '#fff',
            fontFamily: 'monospace',
            fontSize: '12px',
            zIndex: 99999,
            pointerEvents: 'auto',
            minWidth: '280px',
            maxWidth: '320px',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontWeight: 'bold', color: '#00D1FF', fontSize: '13px' }}>🇮🇳 India Earth Model Debug</span>
            <button
              onClick={() => setShowDebug(false)}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#aaa',
                cursor: 'pointer',
                borderRadius: '4px',
                padding: '2px 6px',
                fontSize: '11px',
              }}
              title="Minimize panel"
            >
              ✕
            </button>
          </div>

          {/* Size / Scale Slider */}
          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
            <span>Size (Scale): <strong style={{ color: '#00D1FF' }}>{debugSize.toFixed(2)}</strong></span>
            <input
              type="range" min="1.0" max="25.0" step="0.1"
              value={debugSize}
              onChange={e => {
                const val = parseFloat(e.target.value);
                setDebugSize(val);
                saveState({ size: val });
              }}
              style={{ accentColor: '#00D1FF', cursor: 'pointer' }}
            />
          </label>

          {/* Rotation X */}
          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
            <span>rotation.x: <strong style={{ color: '#facc15' }}>{debugRotX.toFixed(3)}</strong></span>
            <input
              type="range" min="-3.14" max="3.14" step="0.01"
              value={debugRotX}
              onChange={e => {
                const val = parseFloat(e.target.value);
                setDebugRotX(val);
                saveState({ rotX: val });
              }}
              style={{ accentColor: '#facc15', cursor: 'pointer' }}
            />
          </label>

          {/* Rotation Y */}
          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
            <span>rotation.y: <strong style={{ color: '#facc15' }}>{debugRotY.toFixed(3)}</strong></span>
            <input
              type="range" min="-3.14" max="3.14" step="0.01"
              value={debugRotY}
              onChange={e => {
                const val = parseFloat(e.target.value);
                setDebugRotY(val);
                saveState({ rotY: val });
              }}
              style={{ accentColor: '#facc15', cursor: 'pointer' }}
            />
          </label>

          {/* Rotation Z */}
          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
            <span>rotation.z: <strong style={{ color: '#facc15' }}>{debugRotZ.toFixed(3)}</strong></span>
            <input
              type="range" min="-3.14" max="3.14" step="0.01"
              value={debugRotZ}
              onChange={e => {
                const val = parseFloat(e.target.value);
                setDebugRotZ(val);
                saveState({ rotZ: val });
              }}
              style={{ accentColor: '#facc15', cursor: 'pointer' }}
            />
          </label>

          {/* Position X (Left/Right Shift) */}
          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
            <span>position.x (Horizontal): <strong style={{ color: '#4ade80' }}>{debugPosX.toFixed(2)}</strong></span>
            <input
              type="range" min="-15.0" max="15.0" step="0.1"
              value={debugPosX}
              onChange={e => {
                const val = parseFloat(e.target.value);
                setDebugPosX(val);
                saveState({ posX: val });
              }}
              style={{ accentColor: '#4ade80', cursor: 'pointer' }}
            />
          </label>

          {/* Position Y */}
          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
            <span>position.y (Vertical): <strong style={{ color: '#4ade80' }}>{debugPosY.toFixed(2)}</strong></span>
            <input
              type="range" min="-15.0" max="15.0" step="0.1"
              value={debugPosY}
              onChange={e => {
                const val = parseFloat(e.target.value);
                setDebugPosY(val);
                saveState({ posY: val });
              }}
              style={{ accentColor: '#4ade80', cursor: 'pointer' }}
            />
          </label>

          {/* Position Z */}
          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
            <span>position.z (Depth): <strong style={{ color: '#4ade80' }}>{debugPosZ.toFixed(2)}</strong></span>
            <input
              type="range" min="-15.0" max="15.0" step="0.1"
              value={debugPosZ}
              onChange={e => {
                const val = parseFloat(e.target.value);
                setDebugPosZ(val);
                saveState({ posZ: val });
              }}
              style={{ accentColor: '#4ade80', cursor: 'pointer' }}
            />
          </label>

          {/* Copy Values Box */}
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '6px', padding: '8px 10px', fontSize: '11px', lineHeight: '1.6', marginBottom: '10px' }}>
            <span style={{ color: '#00D1FF' }}>size = {debugSize.toFixed(2)}</span><br />
            <span style={{ color: '#facc15' }}>rot = [{debugRotX.toFixed(3)}, {debugRotY.toFixed(3)}, {debugRotZ.toFixed(3)}]</span><br />
            <span style={{ color: '#4ade80' }}>pos = [{debugPosX.toFixed(2)}, {debugPosY.toFixed(2)}, {debugPosZ.toFixed(2)}]</span>
          </div>

          <button
            onClick={handleCopyValues}
            style={{
              width: '100%',
              padding: '6px 10px',
              background: copied ? '#22c55e' : 'rgba(0, 209, 255, 0.2)',
              border: '1px solid rgba(0, 209, 255, 0.5)',
              borderRadius: '6px',
              color: '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '11px',
              transition: 'background 0.2s',
            }}
          >
            {copied ? '✓ Copied to Clipboard!' : '📋 Copy Values'}
          </button>
        </div>
      )}
    </section>
  );
});

IndiaSection.displayName = 'IndiaSection';

export default IndiaSection;
