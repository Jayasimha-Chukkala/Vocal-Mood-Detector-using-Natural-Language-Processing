import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedSphere({ emotionValue }) {
  const sphereRef = useRef();
  const materialRef = useRef();
  const [hovered, setHover] = useState(false);

  // Emotion dictates the distortion and speed
  // Default Neutral
  let baseDistort = 0.2;
  let baseSpeed = 2;
  let color = '#98989D';
  
  if (emotionValue.includes('Angry')) {
    baseDistort = 0.8;
    baseSpeed = 5;
    color = '#FF453A';
  } else if (emotionValue.includes('Sad')) {
    baseDistort = 0.1;
    baseSpeed = 1;
    color = '#0A84FF';
  } else if (emotionValue.includes('Happy')) {
    baseDistort = 0.4;
    baseSpeed = 3;
    color = '#FFD60A';
  }

  useFrame(({ clock }) => {
    if (sphereRef.current) {
        sphereRef.current.rotation.x = clock.getElapsedTime() * (baseSpeed * 0.1);
        sphereRef.current.rotation.y = clock.getElapsedTime() * (baseSpeed * 0.15);
        
        // Smooth scale lerping
        const targetScale = hovered ? 2.4 : 2.0;
        sphereRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <Sphere 
        ref={sphereRef} 
        visible 
        args={[1, 100, 200]} 
        scale={2}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'grab'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHover(false); document.body.style.cursor = 'auto'; }}
        onPointerDown={() => { document.body.style.cursor = 'grabbing'; }}
        onPointerUp={() => { document.body.style.cursor = 'grab'; }}
    >
      <MeshDistortMaterial
        ref={materialRef}
        color={color}
        attach="material"
        distort={hovered ? baseDistort * 1.5 : baseDistort}
        speed={hovered ? baseSpeed * 1.5 : baseSpeed}
        roughness={0.2}
        metalness={0.8}
        wireframe={emotionValue.includes('Angry')}
      />
    </Sphere>
  );
}

export default function MoodSphere({ emotion = 'Neutral' }) {
  return (
    <div className="w-full h-[300px] mb-8 relative">
       {/* Glow effect behind sphere */}
       <div className="absolute inset-0 bg-space-800/20 blur-3xl rounded-full scale-150 mix-blend-screen pointer-events-none" />
       
       <Canvas className="z-10" camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} />
          <Environment preset="city" />
          <AnimatedSphere emotionValue={emotion} />
       </Canvas>
    </div>
  );
}
