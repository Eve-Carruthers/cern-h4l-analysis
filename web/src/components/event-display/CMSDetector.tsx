'use client';

import { useRef } from 'react';
import { Group } from 'three';

interface CMSDetectorProps {
  showTracker?: boolean;
  showECAL?: boolean;
  showHCAL?: boolean;
  showMuon?: boolean;
  opacity?: number;
}

// Simplified CMS detector geometry
// Real CMS: Tracker (r<1.2m), ECAL (r~1.5m), HCAL (r~2.9m), Muon (r~7m)
// We scale to visualization units

export function CMSDetector({
  showTracker = true,
  showECAL = true,
  showHCAL = true,
  showMuon = true,
  opacity = 0.15,
}: CMSDetectorProps) {
  const groupRef = useRef<Group>(null);

  return (
    <group ref={groupRef}>
      {/* Beam pipe */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 22, 32]} />
        <meshStandardMaterial
          color="#666666"
          transparent
          opacity={0.5}
          metalness={0.8}
        />
      </mesh>

      {/* Silicon Tracker - innermost */}
      {showTracker && (
        <group>
          {/* Pixel detector layers */}
          {[0.15, 0.25, 0.35].map((r, i) => (
            <mesh key={`pixel-${i}`} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[r, r, 1, 32, 1, true]} />
              <meshStandardMaterial
                color="#fbbf24"
                transparent
                opacity={opacity * 2}
                side={2}
              />
            </mesh>
          ))}
          {/* Strip tracker layers */}
          {[0.5, 0.7, 0.9, 1.1].map((r, i) => (
            <mesh key={`strip-${i}`} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[r, r, 5, 32, 1, true]} />
              <meshStandardMaterial
                color="#fbbf24"
                transparent
                opacity={opacity}
                side={2}
              />
            </mesh>
          ))}
          {/* Tracker end caps */}
          {[-2.5, 2.5].map((z, i) => (
            <mesh key={`tracker-endcap-${i}`} position={[0, 0, z]}>
              <ringGeometry args={[0.15, 1.2, 32]} />
              <meshStandardMaterial
                color="#fbbf24"
                transparent
                opacity={opacity}
                side={2}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Electromagnetic Calorimeter (ECAL) */}
      {showECAL && (
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[1.5, 1.5, 6, 32, 1, true]} />
            <meshStandardMaterial
              color="#22c55e"
              transparent
              opacity={opacity}
              side={2}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[1.8, 1.8, 6, 32, 1, true]} />
            <meshStandardMaterial
              color="#22c55e"
              transparent
              opacity={opacity * 0.7}
              side={2}
            />
          </mesh>
          {/* ECAL end caps */}
          {[-3.5, 3.5].map((z, i) => (
            <mesh key={`ecal-endcap-${i}`} position={[0, 0, z]}>
              <ringGeometry args={[0.4, 1.8, 32]} />
              <meshStandardMaterial
                color="#22c55e"
                transparent
                opacity={opacity}
                side={2}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Hadronic Calorimeter (HCAL) */}
      {showHCAL && (
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[2.5, 2.5, 8, 32, 1, true]} />
            <meshStandardMaterial
              color="#3b82f6"
              transparent
              opacity={opacity}
              side={2}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[3.5, 3.5, 10, 32, 1, true]} />
            <meshStandardMaterial
              color="#3b82f6"
              transparent
              opacity={opacity * 0.7}
              side={2}
            />
          </mesh>
          {/* HCAL end caps */}
          {[-5.5, 5.5].map((z, i) => (
            <mesh key={`hcal-endcap-${i}`} position={[0, 0, z]}>
              <ringGeometry args={[0.5, 3.5, 32]} />
              <meshStandardMaterial
                color="#3b82f6"
                transparent
                opacity={opacity}
                side={2}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Muon System - outermost */}
      {showMuon && (
        <group>
          {/* Muon barrel chambers */}
          {[4.5, 5.5, 6.5].map((r, i) => (
            <mesh key={`muon-barrel-${i}`} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[r, r, 12 + i, 12, 1, true]} />
              <meshStandardMaterial
                color="#ef4444"
                transparent
                opacity={opacity * 0.5}
                side={2}
              />
            </mesh>
          ))}
          {/* Muon end caps */}
          {[-7, -8.5, -10, 7, 8.5, 10].map((z, i) => (
            <mesh key={`muon-endcap-${i}`} position={[0, 0, z]}>
              <ringGeometry args={[1, 7, 32]} />
              <meshStandardMaterial
                color="#ef4444"
                transparent
                opacity={opacity * 0.5}
                side={2}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Solenoid magnet (between HCAL and muon) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[4, 4, 12, 32, 1, true]} />
        <meshStandardMaterial
          color="#9ca3af"
          transparent
          opacity={opacity * 0.3}
          metalness={0.9}
          roughness={0.1}
          side={2}
        />
      </mesh>
    </group>
  );
}
