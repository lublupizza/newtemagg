
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Float, OrthographicCamera, RoundedBox, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Language } from '../types';
import { Trophy, RotateCcw, Play, Zap, Box } from 'lucide-react';

interface PizzaStackerProps {
  onGameOver: (score: number) => void;
  language: Language;
  autoStart?: boolean;
}

// --- CONSTANTS ---
const BOX_HEIGHT = 1;
const MOVE_SPEED_BASE = 0.15;
const PERFECT_TOLERANCE = 0.2;
const COLORS = ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];

// --- SHARED ASSETS ---
const boxGeo = new THREE.BoxGeometry(1, 1, 1);
const planeGeo = new THREE.PlaneGeometry(1, 1);
const cylinderGeo = new THREE.CylinderGeometry(1, 1, 1, 32);

// --- 3D COMPONENTS (Memoized) ---
const Background = React.memo(({ score }: { score: number }) => {
    const { scene } = useThree();
    useFrame(() => {
        const h = Math.min(score / 50, 1);
        const c1 = new THREE.Color('#0f172a');
        const c2 = new THREE.Color('#000000');
        scene.background = c1.lerp(c2, h);
    });
    return <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />;
});

const StackBox = React.memo(({ position, size, color, isTop }: { position: [number, number, number], size: [number, number], color: string, isTop?: boolean }) => {
    const material = useMemo(() => new THREE.MeshStandardMaterial({ color: color, roughness: 0.2, metalness: 0.1, emissive: color, emissiveIntensity: isTop ? 0.5 : 0 }), [color, isTop]);
    const edgeMat = useMemo(() => new THREE.MeshBasicMaterial({ color: color, wireframe: true }), [color]);
    const logoMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "white", opacity: 0.3, transparent: true }), []);
    return (
        <group position={position}>
            <RoundedBox args={[size[0], BOX_HEIGHT, size[1]]} radius={0.05} smoothness={4}><primitive object={material} /></RoundedBox>
            <mesh position={[0, 0, 0]} geometry={boxGeo} material={edgeMat} scale={[size[0] + 0.05, BOX_HEIGHT - 0.1, size[1] + 0.05]} />
            {isTop && <mesh position={[0, BOX_HEIGHT/2 + 0.01, 0]} rotation={[-Math.PI/2, 0, 0]} geometry={planeGeo} material={logoMat} scale={[size[0]*0.6, size[1]*0.6, 1]} />}
        </group>
    );
});

const FallingDebris = React.memo(({ data }: { data: any }) => {
    const ref = useRef<THREE.Group>(null);
    const material = useMemo(() => new THREE.MeshStandardMaterial({ color: data.color, transparent: true, opacity: 0.8 }), [data.color]);
    useFrame((state, delta) => {
        if (!ref.current) return;
        ref.current.position.x += data.vel[0] * delta * 60;
        ref.current.position.y += data.vel[1] * delta * 60;
        ref.current.position.z += data.vel[2] * delta * 60;
        ref.current.rotation.x += data.rotVel[0] * delta * 60;
        ref.current.rotation.z += data.rotVel[2] * delta * 60;
        data.vel[1] -= 0.02 * delta * 60;
    });
    return <group ref={ref} position={data.pos}><mesh geometry={boxGeo} material={material} scale={[data.size[0], BOX_HEIGHT, data.size[1]]} /></group>;
});

const MovingPiece = React.memo(({ position, size, color }: any) => {
    const material = useMemo(() => new THREE.MeshStandardMaterial({ color: color, emissive: "white", emissiveIntensity: 0.5, toneMapped: false }), [color]);
    return (
        <group position={position}>
            <RoundedBox args={[size[0], BOX_HEIGHT, size[1]]} radius={0.05} smoothness={4}><primitive object={material} /></RoundedBox>
            <pointLight position={[0, 1, 0]} distance={3} intensity={2} color={color} />
        </group>
    );
});

const BasePlatform = React.memo(() => {
    const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#333" }), []);
    const propMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#555" }), []);
    const bladeMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#00ffcc", transparent: true, opacity: 0.5 }), []);
    const padMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#111" }), []);
    const neonMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#ec4899" }), []);
    return (
        <group position={[0, -2, 0]}>
            <mesh receiveShadow geometry={cylinderGeo} material={bodyMat} scale={[4, 1, 4]} />
            {[1, -1].map(x => [1, -1].map(z => <group key={`${x}-${z}`} position={[x*2.5, 0, z*2.5]}><mesh geometry={cylinderGeo} material={propMat} scale={[0.2, 0.5, 0.2]} /><mesh position={[0, 0.3, 0]} rotation={[0, Date.now(), 0]} geometry={boxGeo} material={bladeMat} scale={[3, 0.05, 0.2]} /></group>))}
            <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}><group position={[0, 2, 0]}><mesh receiveShadow geometry={boxGeo} material={padMat} scale={[3.5, 0.5, 3.5]} /><mesh position={[0, 0.26, 0]} rotation={[-Math.PI/2, 0, 0]} geometry={planeGeo} material={neonMat} scale={[3, 3, 1]} /></group></Float>
        </group>
    )
});

const GameScene = ({ isPlaying, stack, debris, activeBox, cameraTargetY }: any) => {
    const { camera } = useThree();
    useFrame((state, delta) => {
        const currentY = camera.position.y;
        const targetY = 15 + cameraTargetY;
        const nextY = THREE.MathUtils.lerp(currentY, targetY, delta * 2);
        camera.position.set(20, nextY, 20);
        camera.lookAt(0, cameraTargetY, 0);
    });
    const lastBox = stack.length > 0 ? stack[stack.length - 1] : { pos: [0, 0, 0] };
    const activePos = activeBox.axis === 'x' ? [activeBox.pos, activeBox.level * BOX_HEIGHT, lastBox.pos ? lastBox.pos[2] : 0] : [lastBox.pos ? lastBox.pos[0] : 0, activeBox.level * BOX_HEIGHT, activeBox.pos];
    return (
        <>
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
            <pointLight position={[-10, 5, -10]} intensity={0.5} color="blue" />
            <Background score={stack.length} />
            <BasePlatform />
            {stack.map((box: any, i: number) => <StackBox key={box.id} position={box.pos} size={box.size} color={box.color} isTop={i === stack.length - 1} />)}
            {debris.map((d: any) => <FallingDebris key={d.id} data={d} />)}
            {isPlaying && <MovingPiece position={activePos} size={activeBox.size} color={COLORS[activeBox.level % COLORS.length]} />}
        </>
    );
};

const PizzaStacker: React.FC<PizzaStackerProps> = ({ onGameOver, language, autoStart }) => {
    const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
    const [stack, setStack] = useState<any[]>([]);
    const [debris, setDebris] = useState<any[]>([]);
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [activeBox, setActiveBox] = useState({ pos: 0, direction: 1, speed: 0.15, axis: 'x' as 'x'|'z', size: [3, 3] as [number, number], level: 1 });
    const reqRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(0);
    
    const t = {
        title: 'ЛюблюPizza', start: language === 'ru' ? 'НАЧАТЬ' : 'START', score: language === 'ru' ? 'СЧЕТ' : 'SCORE', perfect: language === 'ru' ? 'ИДЕАЛЬНО!' : 'PERFECT!', combo: language === 'ru' ? 'КОМБО' : 'COMBO', gameover: language === 'ru' ? 'ИГРА ОКОНЧЕНА' : 'GAME OVER', claim: language === 'ru' ? 'ЗАБРАТЬ' : 'CLAIM', restart: language === 'ru' ? 'ЗАНОВО' : 'RESTART',
    };

    const startGame = () => {
        setStack([{ id: 0, pos: [0, 0, 0], size: [3, 3], color: '#ec4899' }]);
        setDebris([]); setScore(0); setCombo(0);
        setActiveBox({ pos: -5, direction: 1, speed: MOVE_SPEED_BASE, axis: 'x', size: [3, 3], level: 1 });
        setGameState('playing');
        lastTimeRef.current = Date.now();
        cancelAnimationFrame(reqRef.current);
        animate();
    };

    useEffect(() => { if (autoStart && gameState === 'start') startGame(); }, [autoStart]);

    const animate = () => {
        const now = Date.now();
        const delta = (now - lastTimeRef.current) / 16; 
        lastTimeRef.current = now;
        setActiveBox(prev => {
            let nextPos = prev.pos + (prev.speed * prev.direction * delta);
            if (nextPos > 4.5) { nextPos = 4.5; prev.direction = -1; }
            if (nextPos < -4.5) { nextPos = -4.5; prev.direction = 1; }
            return { ...prev, pos: nextPos };
        });
        reqRef.current = requestAnimationFrame(animate);
    };

    const handlePlace = () => {
        if (gameState !== 'playing') return;
        const topBox = stack[stack.length - 1];
        const currentPos = activeBox.pos;
        const isX = activeBox.axis === 'x';
        const center = isX ? topBox.pos[0] : topBox.pos[2];
        const delta = currentPos - center;
        const absDelta = Math.abs(delta);
        const dimIndex = isX ? 0 : 1;
        const currentSize = activeBox.size[dimIndex];

        if (absDelta >= currentSize) { gameOver(); return; }

        let newSize = [...activeBox.size] as [number, number];
        let newPos = [...topBox.pos] as [number, number, number];
        newPos[1] = activeBox.level * BOX_HEIGHT;
        let debrisData: any = null;

        if (absDelta < PERFECT_TOLERANCE) {
            setCombo(c => c + 1); setScore(s => s + 10 + (combo + 1) * 5);
            newPos[isX ? 0 : 2] = center;
        } else {
            setCombo(0); setScore(s => s + 10);
            const overlap = currentSize - absDelta;
            newSize[dimIndex] = overlap;
            const shift = delta / 2;
            newPos[isX ? 0 : 2] = center + shift;
            const debrisSize = [...activeBox.size] as [number, number];
            debrisSize[dimIndex] = absDelta;
            const debrisPos = [...newPos] as [number, number, number];
            const sign = Math.sign(delta);
            const debrisShift = (overlap / 2 + absDelta / 2) * sign;
            debrisPos[isX ? 0 : 2] = newPos[isX ? 0 : 2] + debrisShift;
            debrisData = { id: Date.now(), pos: debrisPos, size: debrisSize, color: '#ef4444', vel: [isX ? sign * 0.1 : 0, 0, isX ? 0 : sign * 0.1], rotVel: [Math.random()*0.1, Math.random()*0.1, Math.random()*0.1] };
        }

        const nextColor = COLORS[(stack.length) % COLORS.length];
        setStack(prev => [...prev, { id: Date.now(), pos: newPos, size: newSize, color: nextColor }]);
        if (debrisData) setDebris(prev => [...prev, debrisData!]);

        const nextLevel = activeBox.level + 1;
        const nextSpeed = Math.min(0.15 + (nextLevel * 0.005), 0.4);
        setActiveBox({ pos: -5, direction: 1, speed: nextSpeed, axis: isX ? 'z' : 'x', size: newSize, level: nextLevel });
    };

    const gameOver = () => { setGameState('gameover'); cancelAnimationFrame(reqRef.current); };
    useEffect(() => { return () => cancelAnimationFrame(reqRef.current); }, []);

    return (
        <div className="w-full h-full relative bg-gray-950 rounded-3xl overflow-hidden border-4 border-pink-500 shadow-2xl select-none touch-none">
            {/* MOBILE OPTIMIZATION: onPointerDown handles both mouse and touch instantly */}
            <div className="absolute inset-0 cursor-pointer" onPointerDown={handlePlace}>
                <Canvas shadows orthographic camera={{ position: [20, 20, 20], zoom: 40, near: -50, far: 200 }} dpr={[1, 1.5]} gl={{ powerPreference: "high-performance" }}>
                    <GameScene isPlaying={gameState === 'playing'} stack={stack} debris={debris} activeBox={activeBox} cameraTargetY={stack.length * BOX_HEIGHT} />
                </Canvas>
            </div>
            <div className="absolute top-6 left-6 flex items-center gap-4 pointer-events-none">
                <h3 className="text-3xl font-black italic text-white drop-shadow-[0_0_10px_rgba(236,72,153,0.8)] neon-text">Люблю<span className="text-pink-500">Pizza</span></h3>
                <div className="bg-pink-600/20 border border-pink-500/50 px-3 py-1 rounded-lg text-pink-400 font-mono font-bold text-xl flex items-center gap-2"><Trophy className="w-5 h-5" /> {score}</div>
                {combo > 1 && <div className="bg-yellow-500/20 border border-yellow-500/50 px-3 py-1 rounded-lg text-yellow-400 font-mono font-bold text-xl flex items-center gap-2 animate-bounce"><Zap className="w-5 h-5" /> {t.combo} x{combo}</div>}
            </div>
            {combo > 0 && gameState === 'playing' && <div key={stack.length} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-[ping_0.5s_ease-out] opacity-0"><div className="text-6xl font-black text-white stroke-black">{t.perfect}</div></div>}
            {gameState === 'start' && <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-auto z-10 animate-in zoom-in duration-300"><Box className="w-24 h-24 text-pink-500 mb-6 animate-bounce" /><h1 className="text-6xl font-black text-white italic mb-8">Люблю<span className="text-pink-500">Pizza</span></h1><button onClick={startGame} className="px-12 py-5 bg-white text-black font-black text-2xl rounded-full hover:scale-110 hover:bg-pink-400 hover:text-white transition-all shadow-[0_0_40px_rgba(255,255,255,0.4)] flex items-center gap-3"><Play className="fill-current w-6 h-6" /> {t.start}</button></div>}
            {gameState === 'gameover' && <div className="absolute inset-0 bg-red-900/80 backdrop-blur-md flex flex-col items-center justify-center pointer-events-auto z-10 animate-in zoom-in duration-300"><h2 className="text-5xl font-black text-white mb-2">{t.gameover}</h2><p className="text-pink-200 font-mono text-2xl mb-8">{t.score}: {score}</p><div className="flex gap-4"><button onClick={() => onGameOver(Math.floor(score))} className="px-8 py-4 bg-yellow-500 text-black font-bold rounded-full hover:scale-105 transition-transform shadow-lg">{t.claim}</button><button onClick={startGame} className="px-8 py-4 bg-white text-red-900 font-bold rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2"><RotateCcw className="w-5 h-5" /> {t.restart}</button></div></div>}
        </div>
    );
};

export default PizzaStacker;
