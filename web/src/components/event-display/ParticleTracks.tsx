'use client';

import { useRef, useMemo, useState } from 'react';
import { Line, Sphere } from '@react-three/drei';
import { Vector3, CatmullRomCurve3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { Track, getTrackColor } from '@/lib/events';

interface ParticleTracksProps {
  tracks: Track[];
  highlightedTrack?: string | null;
  showLabels?: boolean;
  animateEntry?: boolean;
}

function SingleTrack({
  track,
  isHighlighted,
  animationProgress = 1,
}: {
  track: Track;
  isHighlighted: boolean;
  animationProgress?: number;
}) {
  const color = getTrackColor(track);
  const lineWidth = isHighlighted ? 4 : 2;
  const opacity = isHighlighted ? 1 : 0.8;

  // Create smooth curve through trajectory points
  const curve = useMemo(() => {
    if (track.trajectory.length < 2) return null;
    const points = track.trajectory.map(p => new Vector3(p[0], p[1], p[2]));
    return new CatmullRomCurve3(points);
  }, [track.trajectory]);

  // Get animated points based on progress
  const animatedPoints = useMemo(() => {
    if (!curve) return track.trajectory;
    const numPoints = Math.floor(track.trajectory.length * animationProgress);
    if (numPoints < 2) return track.trajectory.slice(0, 2);

    const points: [number, number, number][] = [];
    for (let i = 0; i < numPoints; i++) {
      const t = i / (track.trajectory.length - 1);
      const point = curve.getPoint(t);
      points.push([point.x, point.y, point.z]);
    }
    return points;
  }, [curve, track.trajectory, animationProgress]);

  if (track.trajectory.length < 2) return null;

  const endPoint = animatedPoints[animatedPoints.length - 1];

  return (
    <group>
      {/* Track line */}
      <Line
        points={animatedPoints}
        color={color}
        lineWidth={lineWidth}
        transparent
        opacity={opacity}
      />

      {/* Origin point (collision vertex) */}
      <Sphere args={[0.05]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </Sphere>

      {/* End point marker */}
      {animationProgress >= 1 && (
        <Sphere args={[0.08]} position={endPoint}>
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={isHighlighted ? 0.8 : 0.3}
          />
        </Sphere>
      )}

      {/* Highlight glow for selected track */}
      {isHighlighted && (
        <Line
          points={animatedPoints}
          color={color}
          lineWidth={8}
          transparent
          opacity={0.3}
        />
      )}
    </group>
  );
}

export function ParticleTracks({
  tracks,
  highlightedTrack,
  animateEntry = false,
}: ParticleTracksProps) {
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(animateEntry ? 0 : 1);

  useFrame((_, delta) => {
    if (animateEntry && progressRef.current < 1) {
      progressRef.current = Math.min(1, progressRef.current + delta * 0.5);
      setProgress(progressRef.current);
    }
  });

  return (
    <group>
      {/* Collision vertex glow */}
      <Sphere args={[0.1]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={1}
          transparent
          opacity={0.8}
        />
      </Sphere>

      {/* All tracks */}
      {tracks.map((track) => (
        <SingleTrack
          key={track.id}
          track={track}
          isHighlighted={highlightedTrack === track.id}
          animationProgress={progress}
        />
      ))}
    </group>
  );
}
