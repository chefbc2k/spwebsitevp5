'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import * as THREE from 'three';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface MicrophoneModelProps {
  isRecording: boolean;
}

function MicrophoneModel({ isRecording }: MicrophoneModelProps) {
  const meshRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  // Animation controls
  const y = useMotionValue(0);
  const smoothY = useSpring(y, { damping: 20 });
  const rotationY = useTransform(y, [0, 1], [0, Math.PI * 2]);

  useEffect(() => {
    if (isRecording) {
      y.set(Math.random());
    }
  }, [isRecording, y]);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.1;

      if (isRecording) {
        // Add subtle vibration when recording
        meshRef.current.position.x = Math.sin(state.clock.getElapsedTime() * 30) * 0.01;
      }
    }
  });

  // Function to create base shape using LatheGeometry
  function createBaseShape() {
    const points = [];
    points.push(new THREE.Vector2(0, 0));
    points.push(new THREE.Vector2(1.5, 0));
    points.push(new THREE.Vector2(1.4, 0.1));
    points.push(new THREE.Vector2(1.3, 0.2));
    points.push(new THREE.Vector2(1.2, 0.4));
    points.push(new THREE.Vector2(1.1, 0.6));
    points.push(new THREE.Vector2(1, 0.8));
    points.push(new THREE.Vector2(0.9, 1));
    points.push(new THREE.Vector2(0.8, 1.2));
    points.push(new THREE.Vector2(0.7, 1.4));
    points.push(new THREE.Vector2(0.6, 1.6));
    points.push(new THREE.Vector2(0.5, 1.8));
    points.push(new THREE.Vector2(0.4, 2));
    points.push(new THREE.Vector2(0.3, 2.2));
    points.push(new THREE.Vector2(0.2, 2.4));
    points.push(new THREE.Vector2(0.1, 2.6));
    points.push(new THREE.Vector2(0, 2.8));
    return points;
  }

  return (
    <group ref={meshRef} rotation-y={rotationY.get()}>
      {/* Base */}
      <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <latheGeometry args={[createBaseShape(), 64]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Stand */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 2, 32]} />
        <meshStandardMaterial color="#3a3a3a" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Microphone Head */}
      <group position={[0, 1.2, 0]}>
        {/* Outer Shell */}
        <mesh>
          <cylinderGeometry args={[0.5, 0.5, 1, 64, 1, true]} />
          <meshStandardMaterial
            color="#4a4a4a"
            metalness={0.9}
            roughness={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Top Cap */}
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.5, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#4a4a4a" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Bottom Cap */}
        <mesh position={[0, -0.5, 0]} rotation={[Math.PI, 0, 0]}>
          <sphereGeometry args={[0.5, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#4a4a4a" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Inner Grill */}
        <mesh>
          <cylinderGeometry args={[0.45, 0.45, 1, 64, 1, true]} />
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.5}
            roughness={0.7}
            side={THREE.DoubleSide}
            transparent
            opacity={0.5}
          />
        </mesh>

        {/* Horizontal Grills */}
        {[...Array(20)].map((_, i) => (
          <mesh key={i} position={[0, -0.5 + i * 0.05, 0]}>
            <torusGeometry args={[0.47, 0.005, 16, 100]} />
            <meshStandardMaterial color="#3a3a3a" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}

        {/* Vertical Grills */}
        {[...Array(32)].map((_, i) => (
          <mesh
            key={i}
            rotation={[0, (i * Math.PI) / 16, 0]}
          >
            <boxGeometry args={[0.005, 1, 0.005]} />
            <meshStandardMaterial color="#3a3a3a" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* Side Arms */}
      <group position={[0, 0.7, 0]}>
        <mesh position={[-0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 1.4, 32]} />
          <meshStandardMaterial color="#3a3a3a" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 1.4, 32]} />
          <meshStandardMaterial color="#3a3a3a" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* Knobs on Side Arms */}
      <group position={[0, 0, 0]}>
        <mesh position={[-0.6, 0.7, 0]}>
          <sphereGeometry args={[0.07, 32, 32]} />
          <meshStandardMaterial color="#4a4a4a" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.6, 0.7, 0]}>
          <sphereGeometry args={[0.07, 32, 32]} />
          <meshStandardMaterial color="#4a4a4a" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Recording Light */}
      {isRecording && (
        <pointLight
          position={[0, 1.2, 0.6]}
          color="#ff0000"
          intensity={2}
          distance={3}
          decay={2}
        />
      )}
    </group>
  );
}

interface Microphone3DProps {
  isRecording: boolean;
}

export default function Microphone3D({ isRecording }: Microphone3DProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{
        background: 'transparent',
        height: '100%',
        width: '100%',
      }}
    >
      <Stage
        environment="city"
        intensity={0.5}
        contactShadow={{ opacity: 0.5, blur: 2 }}
      >
        <MicrophoneModel isRecording={isRecording} />
      </Stage>

      {/* Ambient light */}
      <ambientLight intensity={0.5} />

      {/* Key light */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        color="#ffffff"
      />

      {/* Fill light */}
      <directionalLight
        position={[-10, -10, -5]}
        intensity={0.3}
        color="#FFA500"
      />

      {/* Rim light */}
      <pointLight
        position={[0, 5, -5]}
        intensity={0.5}
        color="#FF6347"
      />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.5}
        autoRotate={!isRecording}
        autoRotateSpeed={2}
      />
    </Canvas>
  );
}