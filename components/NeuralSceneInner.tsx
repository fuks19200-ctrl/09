'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Points, PointMaterial } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

function NeuralPoints({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 1.15 + Math.random() * 1.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const pulse = 0.35 + Math.random() * 0.7;
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta) * pulse;
      arr[i * 3 + 1] = r * Math.cos(phi) * pulse;
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) * pulse;
    }
    return arr;
  }, [count]);

  useFrame(({ clock, pointer }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.elapsedTime * 0.028 + pointer.x * 0.10;
    ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.10) * 0.06 + pointer.y * 0.06;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} limit={count} frustumCulled>
      <PointMaterial transparent color="#f7f7f7" size={0.017} sizeAttenuation depthWrite={false} opacity={0.68} />
    </Points>
  );
}

function Core() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = clock.elapsedTime * 0.08;
    mesh.current.rotation.y = clock.elapsedTime * 0.13;
    const s = 1 + Math.sin(clock.elapsedTime * 0.75) * 0.028;
    mesh.current.scale.setScalar(s);
  });

  return (
    <Float speed={0.55} rotationIntensity={0.12} floatIntensity={0.35}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[0.95, 4]} />
        <meshPhysicalMaterial
          color="#d9d5d7"
          roughness={0.24}
          metalness={0.24}
          transmission={0.55}
          thickness={1}
          transparent
          opacity={0.34}
          clearcoat={0.55}
        />
      </mesh>
    </Float>
  );
}

export default function NeuralSceneInner() {
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 700px)').matches;
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const count = reduced ? 180 : isMobile ? 360 : 720;

  return (
    <Canvas
      dpr={isMobile ? [1, 1.15] : [1, 1.45]}
      camera={{ position: [0, 0, 4.5], fov: 45 }}
      gl={{ antialias: false, powerPreference: 'default', alpha: true, stencil: false, depth: true }}
      frameloop={reduced ? 'demand' : 'always'}
      performance={{ min: 0.55, max: 1 }}
    >
      <ambientLight intensity={0.95} />
      <pointLight position={[2, 2, 3]} intensity={13} distance={8} />
      {!isMobile && <pointLight position={[-2, -1, 2]} intensity={5} distance={7} color="#f2c8d2" />}
      <Core />
      <NeuralPoints count={count} />
    </Canvas>
  );
}
