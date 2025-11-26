import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Stars, Trail, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { Language } from '../types';
import { Play, Skull, RotateCcw, Wind, Zap } from 'lucide-react';

// --- CONFIG ---
const LANES = [-2.5, 0, 2.5];
const SPEED_START = 20;
const SPEED_MAX = 60;
const JUMP_FORCE = 0.6;
const GRAVITY = 2.5;

interface PizzaRunnerProps {
  onGameOver: (score: number) => void;
  language: Language;
  isActive: boolean;
  autoStart?: boolean;
}

// --- MODELS ---
const boxGeo = new THREE.BoxGeometry(1, 1, 1);
const cylinderGeo = new THREE.CylinderGeometry(1, 1, 1, 16);
const planeGeo = new THREE.PlaneGeometry(1, 1);
const coneGeo = new THREE.ConeGeometry(1, 1, 1, 16);

// !!! АДАПТИВНАЯ КАМЕРА !!!
// Этот компонент следит за шириной экрана и отодвигает камеру, если окно узкое
const ResponsiveCamera = () => {
    const { camera, viewport } = useThree();
    
    useFrame(() => {
        const targetDist = 7;
        let zPos = targetDist;
        
        // Если экран вертикальный (узкий), отодвигаем камеру назад
        if (viewport.aspect < 1) {
             zPos = targetDist / (viewport.aspect * 0.75); 
        }
        
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, zPos, 0.1);
        camera.position.y = 3 + (zPos - targetDist) * 0.3; 
        camera.lookAt(0, 0, 0);
    });
    
    return null;
};

const HeartShape = () => {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const x = 0, y = 0;
    s.moveTo(x + 0.25, y + 0.25);
    s.bezierCurveTo(x + 0.25, y + 0.25, x + 0.20, y, x, y);
    s.bezierCurveTo(x - 0.30, y, x - 0.30, y + 0.35, x - 0.30, y + 0.35);
    s.bezierCurveTo(x - 0.30, y + 0.55, x - 0.10, y + 0.77, x + 0.25, y + 0.95);
    s.bezierCurveTo(x + 0.60, y + 0.77, x + 0.80, y + 0.55, x + 0.80, y + 0.35);
    s.bezierCurveTo(x + 0.80, y + 0.35, x + 0.80, y, x + 0.50, y);
    s.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);
    return s;
  }, []);
  return shape;
};

const BrandedBackpack = React.memo(() => {
  const shape = HeartShape();
  const bagMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#fbbf24", roughness: 0.2 }), []);
  const strapMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#1f2937" }), []);
  const whiteMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "white" }), []);
  const redMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#dc2626" }), []);
  const extrudeSettings = useMemo(() => ({ depth: 0.05, bevelEnabled: false }), []);

  return (
    <group position={[0, 0.5, -0.25]}>
        <mesh castShadow geometry={boxGeo} material={bagMat} scale={[0.7, 0.7, 0.3]} />
        <mesh position={[-0.2, 0, 0.16]} geometry={boxGeo} material={strapMat} scale={[0.1, 0.7, 0.05]} />
        <mesh position={[0.2, 0, 0.16]} geometry={boxGeo} material={strapMat} scale={[0.1, 0.7, 0.05]} />
        <group position={[0, 0.1, -0.16]} rotation={[0, Math.PI, 0]} scale={0.5}>
            <mesh position={[0, 0, -0.01]} scale={[0.5, 0.5, 1]}>
                <circleGeometry args={[1, 32]} />
                <primitive object={whiteMat} />
            </mesh>
            <mesh position={[-0.25, -0.35, 0.02]} rotation={[0, 0, 0]} scale={0.8} material={redMat}>
                <extrudeGeometry args={[shape, extrudeSettings]} />
            </mesh>
        </group>
    </group>
  )
});

const SkaterCharacter = React.memo(({ lane, isJumping, speed }: { lane: number, isJumping: boolean, speed: number }) => {
  const group = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const board = useRef<THREE.Group>(null);
  
  const skinMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#fca5a5" }), []);
  const shirtMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#ffffff" }), []);
  const jeanMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#1e3a8a" }), []);
  const capMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#dc2626" }), []);
  const boardMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#10b981", emissive: "#059669", emissiveIntensity: 0.5 }), []);
  const wheelMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#34d399", emissive: "#34d399", emissiveIntensity: 2 }), []);

  useFrame((state, delta) => {
    if (!group.current || !body.current || !board.current) return;
    const targetX = LANES[lane + 1];
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetX, delta * 12);
    
    const diff = targetX - group.current.position.x;
    const tilt = -diff * 0.8; 
    const speedLean = Math.min(speed / SPEED_MAX, 1) * 0.3;

    body.current.rotation.z = THREE.MathUtils.lerp(body.current.rotation.z, tilt, delta * 10);
    body.current.rotation.x = THREE.MathUtils.lerp(body.current.rotation.x, speedLean, delta * 5);
    board.current.rotation.z = THREE.MathUtils.lerp(board.current.rotation.z, tilt, delta * 10);
    board.current.rotation.x = isJumping ? -0.4 : 0;
  });

  return (
    <group ref={group}>
      <group ref={body} position={[0, 0.5, 0]}>
         <BrandedBackpack />
         <mesh position={[0, 0.6, 0]} castShadow geometry={boxGeo} material={shirtMat} scale={[0.5, 0.6, 0.3]} />
         <mesh position={[0, 1.1, 0]} geometry={boxGeo} material={skinMat} scale={[0.3, 0.35, 0.3]} />
         <group position={[0, 1.25, 0]}>
             <mesh castShadow geometry={boxGeo} material={capMat} scale={[0.32, 0.15, 0.35]} />
             <mesh position={[0, -0.05, 0.2]} geometry={boxGeo} material={capMat} scale={[0.32, 0.05, 0.15]} />
             <mesh position={[0, 0, 0.18]} rotation={[0, 0, 0]} scale={[0.15, 0.15, 1]}>
                 <circleGeometry args={[0.5, 32]} />
                 <meshBasicMaterial color="white" />
             </mesh>
         </group>
         <mesh position={[-0.35, 0.6, 0]} rotation={[0, 0, -0.2]} geometry={boxGeo} material={skinMat} scale={[0.15, 0.5, 0.15]} />
         <mesh position={[0.35, 0.6, 0]} rotation={[0, 0, 0.2]} geometry={boxGeo} material={skinMat} scale={[0.15, 0.5, 0.15]} />
         <mesh position={[-0.15, 0.15, 0]} geometry={boxGeo} material={jeanMat} scale={[0.18, 0.4, 0.2]} />
         <mesh position={[0.15, 0.15, 0]} geometry={boxGeo} material={jeanMat} scale={[0.18, 0.4, 0.2]} />
      </group>
      <group ref={board} position={[0, 0.1, 0]}>
         <mesh castShadow receiveShadow geometry={boxGeo} material={boardMat} scale={[0.6, 0.05, 1.6]} />
         <pointLight position={[0, -0.2, 0]} distance={2} intensity={2} color="#34d399" />
         <mesh position={[0.25, -0.05, 0.5]} rotation={[0, 0, Math.PI/2]} geometry={cylinderGeo} material={wheelMat} scale={[0.08, 0.1, 0.08]} />
         <mesh position={[-0.25, -0.05, 0.5]} rotation={[0, 0, Math.PI/2]} geometry={cylinderGeo} material={wheelMat} scale={[0.08, 0.1, 0.08]} />
         <mesh position={[0.25, -0.05, -0.5]} rotation={[0, 0, Math.PI/2]} geometry={cylinderGeo} material={wheelMat} scale={[0.08, 0.1, 0.08]} />
         <mesh position={[-0.25, -0.05, -0.5]} rotation={[0, 0, Math.PI/2]} geometry={cylinderGeo} material={wheelMat} scale={[0.08, 0.1, 0.08]} />
         {speed > 30 && <Trail width={0.4} length={4} color="#34d399" attenuation={(t) => t * t}><mesh visible={false} /></Trail>}
      </group>
    </group>
  );
});

const DynamicAtmosphere = ({ score }: { score: number }) => {
    useFrame((state) => {
        let color = new THREE.Color('#1e1b4b'); 
        let fogColor = new THREE.Color('#312e81');
        if (score < 500) { color.set('#4c1d95'); fogColor.set('#7c3aed'); } 
        else if (score < 1500) { color.set('#0f172a'); fogColor.set('#1e293b'); } 
        else { color.set('#000000'); fogColor.set('#000000'); }
        state.scene.background = new THREE.Color().lerp(color, 0.05);
        if (state.scene.fog) (state.scene.fog as THREE.Fog).color.lerp(fogColor, 0.05);
    });
    return null;
};

const RoadChunk = React.memo(({ z, theme }: { z: number, theme: 'sunset' | 'night' | 'void' }) => {
    const stripColor = theme === 'sunset' ? '#f59e0b' : theme === 'night' ? '#3b82f6' : '#ec4899';
    const roadMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#111", roughness: 0.4, metalness: 0.8 }), []);
    const stripMat = useMemo(() => new THREE.MeshBasicMaterial({ color: stripColor, toneMapped: false }), [stripColor]);
    const lineMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#ffffff", opacity: 0.3, transparent: true }), []);

    return (
    <group position={[0, 0, z]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow geometry={planeGeo} material={roadMat} scale={[12, 20, 1]} />
        <mesh position={[-6.2, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} geometry={planeGeo} material={stripMat} scale={[0.4, 20, 1]} />
        <mesh position={[6.2, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} geometry={planeGeo} material={stripMat} scale={[0.4, 20, 1]} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2, 0.01, 0]} geometry={planeGeo} material={lineMat} scale={[0.15, 20, 1]} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2, 0.01, 0]} geometry={planeGeo} material={lineMat} scale={[0.15, 20, 1]} />
    </group>
)});

const CyberBus = React.memo(() => {
    const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#fbbf24", roughness: 0.2 }), []);
    const neonMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#ef4444", toneMapped: false }), []);
    const windowMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#60a5fa", toneMapped: false }), []);
    const wheelMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#1f2937" }), []);

    return (
        <group scale={1.2}>
            <mesh position={[0, 1.2, 0]} castShadow geometry={boxGeo} material={bodyMat} scale={[2.2, 2.0, 5]} />
            <mesh position={[1.11, 1.5, 0]} geometry={boxGeo} material={neonMat} scale={[0.05, 0.2, 4.8]} />
            <mesh position={[-1.11, 1.5, 0]} geometry={boxGeo} material={neonMat} scale={[0.05, 0.2, 4.8]} />
            <mesh position={[0, 1.8, 2.51]} geometry={planeGeo} material={windowMat} scale={[1.8, 0.8, 1]} />
            <mesh position={[1.11, 1.8, 0]} rotation={[0, Math.PI/2, 0]} geometry={planeGeo} material={windowMat} scale={[4, 0.8, 1]} />
            <mesh position={[-1.11, 1.8, 0]} rotation={[0, -Math.PI/2, 0]} geometry={planeGeo} material={windowMat} scale={[4, 0.8, 1]} />
            <Text position={[0, 2.5, 0]} fontSize={0.4} color="#ef4444" anchorX="center" anchorY="middle" rotation={[0, Math.PI, 0]}>PIZZA EXPRESS</Text>
            <Text position={[0, 2.5, 0]} fontSize={0.4} color="#ef4444" anchorX="center" anchorY="middle">PIZZA EXPRESS</Text>
            <mesh position={[1.1, 0.4, 1.5]} rotation={[0, 0, Math.PI/2]} geometry={cylinderGeo} material={wheelMat} scale={[0.4, 0.4, 0.4]} />
            <mesh position={[-1.1, 0.4, 1.5]} rotation={[0, 0, Math.PI/2]} geometry={cylinderGeo} material={wheelMat} scale={[0.4, 0.4, 0.4]} />
            <mesh position={[1.1, 0.4, -1.5]} rotation={[0, 0, Math.PI/2]} geometry={cylinderGeo} material={wheelMat} scale={[0.4, 0.4, 0.4]} />
            <mesh position={[-1.1, 0.4, -1.5]} rotation={[0, 0, Math.PI/2]} geometry={cylinderGeo} material={wheelMat} scale={[0.4, 0.4, 0.4]} />
        </group>
    );
});

const Obstacle = React.memo(({ type, position }: { type: 'cone' | 'barrier' | 'pizza' | 'bus', position: [number, number, number] }) => {
    const mesh = useRef<THREE.Group>(null);
    const coneMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "orange" }), []);
    const barrierMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#ef4444" }), []);
    const whiteMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "white" }), []);
    const cheeseMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#fbbf24" }), []);
    const pepMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#ef4444" }), []);
    
    useFrame((state) => {
        if (type === 'pizza' && mesh.current) {
            mesh.current.rotation.y += 0.05;
            mesh.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 5) * 0.2;
        }
    });

    return (
        <group ref={mesh} position={position}>
            {type === 'cone' && <mesh position={[0, 0.4, 0]} castShadow geometry={coneGeo} material={coneMat} scale={[0.3, 0.8, 0.3]} />}
            {type === 'barrier' && (
                <group position={[0, 0.5, 0]}>
                    <RoundedBox args={[2.2, 1, 0.3]} radius={0.1}><primitive object={barrierMat} /></RoundedBox>
                    <mesh position={[0, 0, 0.16]} geometry={planeGeo} material={whiteMat} scale={[2, 0.2, 1]} />
                    <mesh position={[0, 0.3, 0.16]} geometry={planeGeo} material={whiteMat} scale={[2, 0.2, 1]} />
                </group>
            )}
            {type === 'pizza' && (
                <group scale={1.2}>
                    <mesh rotation={[0.5, 0, 0]} geometry={cylinderGeo} material={cheeseMat} scale={[0.5, 0.1, 0.5]} />
                    <mesh rotation={[0.5, 0, 0]} position={[0, 0.06, 0]} geometry={cylinderGeo} material={pepMat} scale={[0.4, 0.05, 0.4]} />
                    <pointLight distance={1} intensity={2} color="yellow" />
                </group>
            )}
            {type === 'bus' && <CyberBus />}
        </group>
    )
});

const SideCity = React.memo(({ z, score }: { z: number, score: number }) => {
    const isCyber = score > 500;
    const color = isCyber ? '#1e293b' : '#0f172a';
    const winColor = isCyber ? (Math.random() > 0.5 ? 'cyan' : 'magenta') : 'yellow';
    const buildingMat = useMemo(() => new THREE.MeshStandardMaterial({ color }), [color]);
    const winMat = useMemo(() => new THREE.MeshBasicMaterial({ color: winColor }), [winColor]);

    return (
        <group position={[0, 0, z]}>
            <group position={[-12, 0, 0]}>
                <mesh position={[0, 5, 0]} geometry={boxGeo} material={buildingMat} scale={[6, 10, 6]} />
                {Array.from({ length: 5 }).map((_, i) => <mesh key={i} position={[3.1, i * 2 + 1, 0]} geometry={planeGeo} material={winMat} scale={[0.5, 1, 1]} />)}
            </group>
            <group position={[12, 0, -10]}>
                <mesh position={[0, 7, 0]} geometry={boxGeo} material={buildingMat} scale={[6, 14, 6]} />
                {Array.from({ length: 8 }).map((_, i) => <mesh key={i} position={[-3.1, i * 1.5 + 1, 0]} geometry={planeGeo} material={winMat} scale={[0.5, 0.8, 1]} />)}
            </group>
        </group>
    )
});

const GameWorld = ({ isPlaying, speed, playerLane, playerY, onHit, onCollect, score }: any) => {
    const [objects, setObjects] = useState<any[]>([]);
    const spawnTimer = useRef(0);
    const theme = score < 500 ? 'sunset' : score < 1500 ? 'night' : 'void';

    useFrame((state, delta) => {
        if (!isPlaying) return;
        setObjects(prev => {
            const next = prev.map(obj => ({ ...obj, z: obj.z + speed * delta }));
            return next.filter(obj => {
                const collisionDepth = obj.type === 'bus' ? 3 : 0.5;
                if (obj.active && obj.z > -collisionDepth && obj.z < collisionDepth) {
                    const objLaneX = LANES[obj.lane];
                    const playerLaneX = LANES[playerLane + 1];
                    if (objLaneX === playerLaneX) {
                        if (obj.type === 'pizza') { onCollect(); return false; } 
                        else { if (playerY < 0.5) { onHit(0); return false; } }
                    }
                }
                return obj.z < 15;
            });
        });
        spawnTimer.current -= delta;
        if (spawnTimer.current <= 0) {
            const lane = Math.floor(Math.random() * 3);
            let type = 'barrier';
            const r = Math.random();
            if (r > 0.85) type = 'pizza'; else if (r > 0.65) type = 'cone'; else if (r > 0.50) type = 'bus';
            setObjects(prev => [...prev, { id: Math.random(), type, lane, z: -60, active: true }]);
            spawnTimer.current = (30 / speed) + (type === 'bus' ? 0.5 : 0);
        }
    });

    return (
        <group>
            {[0, -20, -40, -60].map(z => <React.Fragment key={z}><RoadChunk z={z} theme={theme} /><SideCity z={z} score={score} /></React.Fragment>)}
            {objects.map(obj => <Obstacle key={obj.id} type={obj.type} position={[LANES[obj.lane], 0, obj.z]} />)}
        </group>
    );
}

const WarpEffect = ({ speed }: { speed: number }) => {
    const starsRef = useRef<any>(null);
    useFrame(() => { if (starsRef.current) starsRef.current.rotation.z += 0.001 * speed; });
    return <Stars ref={starsRef} radius={50} depth={50} count={speed > 40 ? 2000 : 500} factor={speed > 40 ? 6 : 4} saturation={0} fade speed={speed / 10} />;
}

const PizzaRunner: React.FC<PizzaRunnerProps> = ({ onGameOver, language, isActive, autoStart }) => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'dead'>('start');
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(SPEED_START);
  
  const playerLaneRef = useRef(0);
  const playerYRef = useRef(0);
  const playerVelYRef = useRef(0);
  const playerGroup = useRef<THREE.Group>(null);
  const touchStartRef = useRef<{x: number, y: number} | null>(null);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setSpeed(SPEED_START);
    playerLaneRef.current = 0;
    playerYRef.current = 0;
    playerVelYRef.current = 0;
  };

  useEffect(() => { if (autoStart && isActive && gameState === 'start') startGame(); }, [autoStart, isActive]);

  // --- УПРАВЛЕНИЕ (КЛАВИАТУРА И ТАЧ) ---
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      if (e.key === 'ArrowLeft' || e.key === 'a') playerLaneRef.current = Math.max(-1, playerLaneRef.current - 1);
      if (e.key === 'ArrowRight' || e.key === 'd') playerLaneRef.current = Math.min(1, playerLaneRef.current + 1);
      if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') && playerYRef.current <= 0) playerVelYRef.current = JUMP_FORCE;
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameState]);

  const handleTouchStart = (e: React.TouchEvent) => {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
      if (!touchStartRef.current || gameState !== 'playing') return;
      
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = endX - touchStartRef.current.x;
      const diffY = endY - touchStartRef.current.y;
      
      if (Math.abs(diffX) > 30) {
          if (diffX > 0) playerLaneRef.current = Math.min(1, playerLaneRef.current + 1);
          else playerLaneRef.current = Math.max(-1, playerLaneRef.current - 1);
      } else if (Math.abs(diffX) < 10 && Math.abs(diffY) < 10) {
          if(playerYRef.current <= 0) playerVelYRef.current = JUMP_FORCE;
      }
      touchStartRef.current = null;
  };

  const PhysicsLoop = () => {
    useFrame((state, delta) => {
        if (gameState !== 'playing') return;
        playerYRef.current += playerVelYRef.current;
        playerVelYRef.current -= GRAVITY * 0.015;
        if (playerYRef.current < 0) { playerYRef.current = 0; playerVelYRef.current = 0; }
        if (playerGroup.current) playerGroup.current.position.y = playerYRef.current;
        setScore(s => s + 1);
        setSpeed(s => Math.min(s + delta * 0.8, SPEED_MAX));
    });
    return null;
  };

  const t = {
      start: language === 'ru' ? 'НАЧАТЬ ГОНКУ' : 'START RACE',
      gameover: language === 'ru' ? 'АВАРИЯ!' : 'CRASHED!',
      score: language === 'ru' ? 'СЧЕТ' : 'SCORE',
      restart: language === 'ru' ? 'ЗАНОВО' : 'RESTART',
      title: 'CYBER RUSH'
  };

  return (
    <div 
        className="w-full h-full relative bg-black overflow-hidden select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
    >
        <Canvas 
            shadows 
            dpr={[1, 1.5]} 
            gl={{ powerPreference: "high-performance" }}
        >
            <ResponsiveCamera />
            <DynamicAtmosphere score={score} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 20, 5]} intensity={1.5} castShadow shadow-bias={-0.0001} />
            <pointLight position={[0, 2, 2]} intensity={1} color="orange" />
            <group>
                <group ref={playerGroup}>
                    <SkaterCharacter lane={playerLaneRef.current} isJumping={playerYRef.current > 0} speed={speed} />
                </group>
                <GameWorld isPlaying={gameState === 'playing'} speed={speed} playerLane={playerLaneRef.current} playerY={playerYRef.current} score={score} onHit={() => { setGameState('dead'); onGameOver(Math.floor(score/10)); }} onCollect={() => setScore(s => s + 500)} />
            </group>
            <PhysicsLoop />
            <WarpEffect speed={speed} />
        </Canvas>

        <div className="absolute inset-0 pointer-events-none p-4 md:p-6 flex flex-col justify-between z-20">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-2xl md:text-3xl font-black italic text-white drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]">{t.title}</h3>
                    <div className="flex items-center gap-2 text-pink-400 font-mono text-xs tracking-widest"><Wind className="w-3 h-3" /> {Math.floor(speed * 3)} KM/H</div>
                </div>
                <div className="text-right">
                    <div className="text-xs font-bold text-yellow-400 uppercase tracking-widest">{t.score}</div>
                    <div className="text-3xl md:text-5xl font-black text-white font-mono drop-shadow-md">{score}</div>
                </div>
            </div>
        </div>

        {/* CLICK ZONES (MOUSE SUPPORT FOR PC) */}
        {gameState === 'playing' && (
            <div className="grid grid-cols-2 gap-4 pointer-events-auto h-full absolute inset-0 z-10 opacity-0">
                <div className="h-full cursor-pointer" onClick={() => playerLaneRef.current = Math.max(-1, playerLaneRef.current - 1)}></div>
                <div className="h-full cursor-pointer" onClick={() => playerLaneRef.current = Math.min(1, playerLaneRef.current + 1)}></div>
            </div>
        )}

        {gameState === 'start' && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-auto z-30">
                <h1 className="text-5xl md:text-6xl font-black text-white italic tracking-tighter mb-8 text-center">CYBER<br/><span className="text-pink-500">DELIVERY</span></h1>
                <button onClick={startGame} className="px-10 py-4 md:px-12 md:py-5 bg-white text-black font-black text-xl md:text-2xl rounded-full hover:scale-110 hover:bg-pink-400 hover:text-white transition-all flex items-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.4)]">
                    <Play className="fill-current w-6 h-6" /> {t.start}
                </button>
            </div>
        )}

        {gameState === 'dead' && (
            <div className="absolute inset-0 bg-red-900/80 backdrop-blur-md flex flex-col items-center justify-center pointer-events-auto z-30 animate-in zoom-in duration-300">
                <Skull className="w-16 h-16 md:w-24 md:h-24 text-white mb-4 animate-pulse" />
                <h2 className="text-4xl md:text-6xl font-black text-white mb-2">{t.gameover}</h2>
                <div className="text-pink-200 font-mono text-lg md:text-xl mb-8">SCORE: {score}</div>
                <button onClick={startGame} className="px-8 py-3 md:px-10 md:py-4 bg-white text-red-900 font-bold text-lg md:text-xl rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2">
                    <RotateCcw className="w-6 h-6" /> {t.restart}
                </button>
            </div>
        )}
    </div>
  );
};

export default PizzaRunner;
