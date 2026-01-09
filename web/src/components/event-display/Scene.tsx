'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import { CMSDetector } from './CMSDetector';
import { ParticleTracks } from './ParticleTracks';
import { HiggsEvent } from '@/lib/events';

interface SceneProps {
  event: HiggsEvent;
  selectedTrack: string | null;
  showTracker: boolean;
  showECAL: boolean;
  showHCAL: boolean;
  showMuon: boolean;
  opacity: number;
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#333" wireframe />
    </mesh>
  );
}

export function Scene({
  event,
  selectedTrack,
  showTracker,
  showECAL,
  showHCAL,
  showMuon,
  opacity,
}: SceneProps) {
  return (
    <Canvas className="w-full h-full">
      <PerspectiveCamera makeDefault position={[12, 8, 12]} fov={50} />

      <Suspense fallback={<LoadingFallback />}>
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} />
        <pointLight position={[0, 0, 0]} intensity={0.5} color="#ffffff" />

        {/* Background stars */}
        <Stars
          radius={100}
          depth={50}
          count={2000}
          factor={4}
          saturation={0}
          fade
          speed={0.5}
        />

        {/* CMS Detector */}
        <CMSDetector
          showTracker={showTracker}
          showECAL={showECAL}
          showHCAL={showHCAL}
          showMuon={showMuon}
          opacity={opacity}
        />

        {/* Particle tracks */}
        <ParticleTracks
          tracks={event.tracks}
          highlightedTrack={selectedTrack}
          animateEntry={true}
        />

        {/* Grid helper for orientation */}
        <gridHelper args={[20, 20, '#333333', '#222222']} rotation={[Math.PI / 2, 0, 0]} />

        {/* Axis helper */}
        <axesHelper args={[2]} />
      </Suspense>

      {/* Camera controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={50}
        autoRotate={false}
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
}
