
import React, { useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stage, Float, ContactShadows, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { Language } from '../types';

interface Pizza3DViewerProps {
  imageUrl: string;
  name: string;
  language?: Language;
  transparent?: boolean;
  scale?: number;
}

// Procedural floating "cyber ingredients" that orbit the pizza
const FloatingIngredients = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Generate random particles
  const ingredients = useMemo(() => {
    return new Array(15).fill(0).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 7,
        (Math.random() - 0.5) * 3 + 1,
        (Math.random() - 0.5) * 7
      ],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
      scale: Math.random() * 0.2 + 0.05,
      type: Math.random() > 0.6 ? 'cube' : 'gem',
      speed: Math.random() * 0.02 + 0.01
    }));
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // Orbit rotation
      groupRef.current.rotation.y -= 0.005;
      // Gentle bobbing
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {ingredients.map((ing, i) => (
        <mesh key={i} position={ing.position as any} rotation={ing.rotation as any} scale={ing.scale}>
          {ing.type === 'cube' ? (
            <boxGeometry args={[1, 1, 1]} />
          ) : (
            <octahedronGeometry args={[1, 0]} />
          )}
          <meshStandardMaterial 
            color={ing.type === 'cube' ? '#ff3366' : '#33ff99'} 
            emissive={ing.type === 'cube' ? '#ff0044' : '#00ff55'}
            emissiveIntensity={2}
            toneMapped={false}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
};

const PizzaMesh: React.FC<{ imageUrl: string }> = ({ imageUrl }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Load texture
  const texture = useLoader(THREE.TextureLoader, imageUrl);
  
  // Custom materials - MEMOIZED to prevent leaks
  const crustMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#e6a15c", // Golden brown
    roughness: 0.8,
    metalness: 0.0,
  }), []);

  const toppingMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    map: texture, 
    displacementMap: texture,
    displacementScale: 0.15,
    displacementBias: -0.02,
    roughness: 0.7,
    metalness: 0.0,
    emissiveMap: texture,
    emissiveIntensity: 0.1
  }), [texture]);

  useFrame(() => {
    if (groupRef.current) {
      // Main pizza rotation
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={groupRef} dispose={null}>
      <Float speed={2.5} rotationIntensity={0.2} floatIntensity={0.8} floatingRange={[-0.3, 0.3]}>
        
        {/* 1. The Crust Ring (Volumetric Torus) */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]} material={crustMaterial}>
          <torusGeometry args={[2.6, 0.25, 32, 64]} />
        </mesh>

        {/* 2. The Base (Cylinder underneath for thickness) */}
        <mesh position={[0, -0.1, 0]} material={crustMaterial}>
          <cylinderGeometry args={[2.65, 2.65, 0.2, 64]} />
        </mesh>

        {/* 3. The Topping Surface (High-poly Ring for detailed Displacement) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]} material={toppingMaterial}>
          {/* innerRadius, outerRadius, thetaSegments, phiSegments (rings) */}
          <ringGeometry args={[0, 2.6, 64, 48]} /> 
        </mesh>

        {/* 4. Floating Cyber Particles */}
        <FloatingIngredients />

      </Float>

      {/* Steam/Heat Effects */}
      <Sparkles 
        count={80} 
        scale={[5, 4, 5]} 
        size={4} 
        speed={0.8} 
        opacity={0.4} 
        position={[0, 1.5, 0]}
        color="#ffffff"
      />
    </group>
  );
};

const LoadingSpinner = () => (
  <mesh>
    <torusGeometry args={[1, 0.2, 16, 100]} />
    <meshStandardMaterial color="#ec4899" wireframe />
  </mesh>
);

const Pizza3DViewer: React.FC<Pizza3DViewerProps> = ({ imageUrl, name, language = 'en', transparent = false, scale = 1 }) => {
  const label = language === 'ru' ? 'ГОЛОГРАФИЧЕСКИЙ РЕНДЕР v2.5' : 'HOLOGRAPHIC RENDER v2.5';

  return (
    <div className={`w-full h-full relative ${transparent ? '' : 'bg-gradient-to-b from-gray-900 to-black'}`}>
       {!transparent && (
         <div className="absolute top-4 left-0 right-0 text-center z-10 pointer-events-none">
            <p className="text-xs text-blue-400 font-mono tracking-[0.3em] animate-pulse">{label}</p>
         </div>
       )}
       
       <Canvas 
          shadows 
          dpr={[1, 1.5]} // Reduced max DPR for performance
          camera={{ position: [0, 5, 7], fov: 40 }}
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
       >
        <Suspense fallback={<LoadingSpinner />}>
          {/* Environment Lighting */}
          <Stage environment={transparent ? "studio" : "city"} intensity={0.8} adjustCamera={false}>
            <group scale={scale}>
              <PizzaMesh imageUrl={imageUrl} />
            </group>
          </Stage>
          
          {/* Cinematic Rim Lights */}
          <pointLight position={[5, 5, 5]} intensity={2.0} color="#ffaa00" distance={20} />
          <pointLight position={[-5, 2, -5]} intensity={1.5} color="#0088ff" distance={20} />
          <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={1} color="white" castShadow />

          <OrbitControls 
            autoRotate={false} 
            enableZoom={false} 
            enablePan={false}
            minPolarAngle={0} 
            maxPolarAngle={Math.PI / 2} 
          />
        </Suspense>
        
        {!transparent && (
          <ContactShadows position={[0, -3, 0]} opacity={0.5} scale={15} blur={3} far={4} color="#000000" />
        )}
      </Canvas>
    </div>
  );
};

export default Pizza3DViewer;
