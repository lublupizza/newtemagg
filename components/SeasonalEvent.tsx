
import React, { useState, useRef, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Tube, Text, Sparkles, Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Language } from '../types';
import { ArrowLeft, Zap, Star, Trash2, Camera, Loader2, Snowflake, X } from 'lucide-react';
import { useResponsiveGameViewport } from '../hooks/useResponsiveGameViewport';

interface SeasonalEventProps {
  language: Language;
  userPoints: number;
  onPurchase: (cost: number, itemName: string) => void;
  onBack: () => void;
}

// --- DATA CONFIG ---
const ORNAMENTS = [
    { id: 'red_gold', name: { ru: 'Красный Шар', en: 'Red Gold' }, color: '#ef4444', type: 'striped' },
    { id: 'blue_silver', name: { ru: 'Синий Иней', en: 'Blue Frost' }, color: '#3b82f6', type: 'sphere' },
    { id: 'gold_gem', name: { ru: 'Золотой Ромб', en: 'Gold Gem' }, color: '#fbbf24', type: 'diamond' },
    { id: 'purple_star', name: { ru: 'Неон Звезда', en: 'Neon Star' }, color: '#d946ef', type: 'star' },
    { id: 'pizza_slice', name: { ru: 'Слайс Пиццы', en: 'Pizza Slice' }, color: '#f97316', type: 'pizza' },
    { id: 'bell', name: { ru: 'Колокольчик', en: 'Golden Bell' }, color: '#fbbf24', type: 'bell' },
    { id: 'gift', name: { ru: 'Подарок', en: 'Gift Box' }, color: '#ec4899', type: 'gift' },
    { id: 'cane', name: { ru: 'Леденец', en: 'Candy Cane' }, color: '#ef4444', type: 'cane' },
    { id: 'icicle', name: { ru: 'Сосулька', en: 'Icicle' }, color: '#a5f3fc', type: 'icicle' },
];

const GARLANDS = [
    { id: 'classic', name: { ru: 'Теплая', en: 'Warm' }, colors: ['#ffaa00', '#ff5500'], intensity: 2 },
    { id: 'cyber', name: { ru: 'Кибер', en: 'Cyber' }, colors: ['#00ffff', '#ff00ff'], intensity: 3 },
    { id: 'multi', name: { ru: 'Мульти', en: 'Multi' }, colors: ['#ff0000', '#0000ff', '#00ff00', '#ffff00'], intensity: 2 },
    { id: 'gold', name: { ru: 'Золото', en: 'Gold' }, colors: ['#fbbf24', '#d97706', '#fcd34d'], intensity: 2.5 },
    { id: 'ice', name: { ru: 'Лед', en: 'Ice' }, colors: ['#bae6fd', '#ffffff', '#38bdf8'], intensity: 3 },
    { id: 'candy', name: { ru: 'Леденец', en: 'Candy' }, colors: ['#ef4444', '#ffffff'], intensity: 2 },
    { id: 'pink', name: { ru: 'Неон Пинк', en: 'Neon Pink' }, colors: ['#ec4899', '#f472b6', '#be185d'], intensity: 3 },
];

const TOPPERS = [
    { id: 'star', name: { ru: 'Звезда', en: 'Star' }, color: '#fbbf24' },
    { id: 'snowflake', name: { ru: 'Снежинка', en: 'Snowflake' }, color: '#bae6fd' },
    { id: 'heart', name: { ru: 'Сердце', en: 'Heart' }, color: '#ef4444' },
];

// --- ASSETS MANAGER (Shared Geometries/Materials) ---
const useAssets = () => {
    return useMemo(() => {
        const capGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.15, 8);
        const capMat = new THREE.MeshStandardMaterial({ color: "#d4d4d4", metalness: 0.8, roughness: 0.2 });
        const sphereGeo = new THREE.SphereGeometry(0.45, 16, 16);
        const diamondGeo = new THREE.OctahedronGeometry(0.45, 0);
        const bellBodyGeo = new THREE.CylinderGeometry(0.1, 0.4, 0.6, 16);
        const bellRimGeo = new THREE.TorusGeometry(0.4, 0.05, 8, 16);
        const boxGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
        const ribbonVGeo = new THREE.BoxGeometry(0.62, 0.62, 0.15);
        const ribbonHGeo = new THREE.BoxGeometry(0.15, 0.62, 0.62);
        const ribbonMat = new THREE.MeshStandardMaterial({ color: "#fff" });
        const icicleGeo = new THREE.ConeGeometry(0.15, 1.2, 6);
        const icicleMat = new THREE.MeshPhysicalMaterial({ color: "#a5f3fc", transmission: 0.9, opacity: 0.9, transparent: true, roughness: 0.1, thickness: 1 });
        const pizzaDoughGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 3);
        const pizzaCrustGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.7, 8);
        const pizzaPepGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.02, 8);
        const caneStickGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 8);
        const caneHookGeo = new THREE.TorusGeometry(0.15, 0.08, 8, 16, Math.PI);

        // Heart Shape
        const heartShape = new THREE.Shape();
        const x = 0, y = 0;
        heartShape.moveTo(x + 0.25, y + 0.25);
        heartShape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.20, y, x, y);
        heartShape.bezierCurveTo(x - 0.30, y, x - 0.30, y + 0.35, x - 0.30, y + 0.35);
        heartShape.bezierCurveTo(x - 0.30, y + 0.55, x - 0.10, y + 0.77, x + 0.25, y + 0.95);
        heartShape.bezierCurveTo(x + 0.60, y + 0.77, x + 0.80, y + 0.55, x + 0.80, y + 0.35);
        heartShape.bezierCurveTo(x + 0.80, y + 0.35, x + 0.80, y, x + 0.50, y);
        heartShape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);
        const heartGeo = new THREE.ExtrudeGeometry(heartShape, { depth: 0.2, bevelEnabled: false });
        heartGeo.center(); // Center pivot

        const materials: Record<string, THREE.MeshPhysicalMaterial> = {};
        const getMaterial = (color: string) => {
            if (!materials[color]) {
                materials[color] = new THREE.MeshPhysicalMaterial({
                    color: color,
                    roughness: 0.2,
                    metalness: 0.1,
                    clearcoat: 1
                });
            }
            return materials[color];
        }

        const basicRed = new THREE.MeshStandardMaterial({ color: "#ef4444" });
        const glowingRed = new THREE.MeshStandardMaterial({ color: "#ef4444", emissive: "#ff0000", emissiveIntensity: 2, toneMapped: false });
        const basicWhite = new THREE.MeshStandardMaterial({ color: "white" });
        const basicGold = new THREE.MeshStandardMaterial({ color: "#fbbf24" });
        const basicOrange = new THREE.MeshStandardMaterial({ color: "#d97706" });
        
        // Beautiful Glass Sign Material
        const glassSignMat = new THREE.MeshPhysicalMaterial({
            color: "#ffffff",
            transmission: 0.7,
            opacity: 0.8,
            transparent: true,
            roughness: 0.2,
            metalness: 0.1,
            thickness: 1,
            clearcoat: 1
        });

        return {
            capGeo, capMat, sphereGeo, diamondGeo, bellBodyGeo, bellRimGeo, 
            boxGeo, ribbonVGeo, ribbonHGeo, ribbonMat, icicleGeo, icicleMat,
            pizzaDoughGeo, pizzaCrustGeo, pizzaPepGeo, caneStickGeo, caneHookGeo, heartGeo,
            getMaterial, basicRed, glowingRed, basicWhite, basicGold, basicOrange, glassSignMat
        };
    }, []);
}

const DetailedOrnament = React.memo(({ type, color, assets }: { type: string, color: string, assets: any }) => {
    const material = assets.getMaterial(color);

    if (type === 'pizza') {
        return (
            <group rotation={[0, 0, 0]} scale={0.8}>
                <mesh geometry={assets.capGeo} material={assets.capMat} position={[0, 0.55, 0]} />
                <mesh geometry={assets.pizzaDoughGeo} material={assets.basicGold} rotation={[0, Math.PI/6, 0]} />
                <mesh geometry={assets.pizzaCrustGeo} material={assets.basicOrange} position={[0, 0, -0.25]} rotation={[0, 0, Math.PI/2]} />
                <mesh geometry={assets.pizzaPepGeo} material={assets.basicRed} position={[0.1, 0.06, 0]} />
            </group>
        );
    }
    if (type === 'bell') {
        return (
            <group>
                <mesh geometry={assets.capGeo} material={assets.capMat} position={[0, 0.5, 0]} />
                <mesh geometry={assets.bellBodyGeo} material={material} />
                <mesh geometry={assets.bellRimGeo} material={material} position={[0, -0.3, 0]} />
            </group>
        );
    }
    if (type === 'gift') {
        return (
            <group>
                <mesh geometry={assets.capGeo} material={assets.capMat} position={[0, 0.5, 0]} />
                <mesh geometry={assets.boxGeo} material={material} />
                <mesh geometry={assets.ribbonVGeo} material={assets.ribbonMat} />
                <mesh geometry={assets.ribbonHGeo} material={assets.ribbonMat} />
            </group>
        );
    }
    if (type === 'cane') {
        return (
            <group position={[0, -0.2, 0]}>
                <mesh geometry={assets.capGeo} material={assets.capMat} position={[0, 0.7, 0]} />
                <mesh geometry={assets.caneStickGeo} material={assets.basicWhite} />
                <mesh geometry={assets.caneHookGeo} material={assets.basicWhite} position={[0.15, 0.4, 0]} rotation={[0, 0, Math.PI]} />
            </group>
        );
    }
    if (type === 'icicle') {
        return (
            <group>
                <mesh geometry={assets.capGeo} material={assets.capMat} position={[0, 0.5, 0]} />
                <mesh geometry={assets.icicleGeo} material={assets.icicleMat} position={[0, -0.2, 0]} />
            </group>
        );
    }

    return (
        <group>
            <mesh geometry={assets.capGeo} material={assets.capMat} position={[0, 0.45, 0]} />
            {type === 'diamond' ? <mesh geometry={assets.diamondGeo} material={material} /> : <mesh geometry={assets.sphereGeo} material={material} />}
        </group>
    );
});

const BrandedHouse = React.memo(({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) => {
    const assets = useAssets();
    const heartRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        if (heartRef.current) {
            const s = 0.5 + Math.sin(clock.getElapsedTime() * 3) * 0.1; // Pulsing scale
            heartRef.current.scale.set(s, s, s);
        }
    });

    return (
        <group position={position} rotation={rotation}>
            {/* Base */}
            <mesh position={[0, 1.2, 0]}><boxGeometry args={[3, 2.4, 2.5]} /><meshStandardMaterial color="#4e342e" /></mesh>
            {/* Roof */}
            <mesh position={[0, 2.8, 0]} rotation={[0, Math.PI/4, 0]}><coneGeometry args={[2.8, 1.8, 4]} /><meshStandardMaterial color="#f1f5f9" /></mesh>
            {/* Windows */}
            <mesh position={[-0.8, 1.2, 1.3]}><planeGeometry args={[0.8, 0.8]} /><meshBasicMaterial color="#fef3c7" /></mesh>
            <mesh position={[0.8, 1.2, 1.3]}><planeGeometry args={[0.8, 0.8]} /><meshBasicMaterial color="#fef3c7" /></mesh>
            {/* Door */}
            <mesh position={[0, 0.9, 1.3]}><planeGeometry args={[0.8, 1.8]} /><meshStandardMaterial color="#3e2723" /></mesh>
            
            {/* Street Lamp */}
            <group position={[2.2, 0, 2]}>
                <mesh position={[0, 1, 0]}><cylinderGeometry args={[0.05, 0.05, 2, 8]} /><meshStandardMaterial color="#1a202c" /></mesh>
                <mesh position={[0, 2, 0]}><boxGeometry args={[0.3, 0.4, 0.3]} /><meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1} /></mesh>
                <pointLight position={[0, 2, 0]} distance={5} intensity={2} color="#fbbf24" />
            </group>

            {/* NEON SIGNAGE GROUP */}
            <group position={[0, 3.8, 0]}>
                {/* Pole */}
                <mesh position={[0, -0.5, 0]}><cylinderGeometry args={[0.05, 0.05, 1.5]} /><meshStandardMaterial color="#333" /></mesh>
                
                {/* Backboard (White Glass) */}
                <mesh position={[0, 0.3, 0]}>
                    <boxGeometry args={[2.2, 0.6, 0.1]} />
                    <primitive object={assets.glassSignMat} />
                </mesh>
                
                {/* 3D Text "ЛюблюPizza" - Default Font for Stability */}
                <Text position={[0, 0.3, 0.06]} fontSize={0.25} color="#ef4444" anchorX="center" anchorY="middle">
                    ЛюблюPizza
                </Text>
                
                {/* Glowing Pulsing Heart Icon */}
                <mesh ref={heartRef} position={[0, 0.9, 0]} rotation={[Math.PI, 0, 0]} scale={0.5} geometry={assets.heartGeo} material={assets.glowingRed} />
            </group>
        </group>
    )
});

const BackgroundForest = React.memo(() => {
    const count = 40;
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const meshRef = useRef<THREE.InstancedMesh>(null);

    useEffect(() => {
        if (meshRef.current) {
            for(let i=0; i<count; i++) {
                const angle = (i / count) * Math.PI * 2 + (Math.random() * 0.2);
                const r = 22 + Math.random() * 6;
                const s = 1.5 + Math.random() * 1;
                dummy.position.set(Math.sin(angle) * r, s * 2, Math.cos(angle) * r);
                dummy.scale.set(s, s, s);
                dummy.updateMatrix();
                meshRef.current.setMatrixAt(i, dummy.matrix);
            }
            meshRef.current.instanceMatrix.needsUpdate = true;
        }
    }, []);

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <coneGeometry args={[1.5, 4, 8]} />
            <meshStandardMaterial color="#0f3d2e" roughness={0.9} />
        </instancedMesh>
    );
});

const FlyingSanta = React.memo(() => {
    const group = useRef<THREE.Group>(null);
    const model = useRef<THREE.Group>(null);
    const assets = useAssets(); 
    
    useFrame(({ clock }) => {
        if (group.current && model.current) {
            const t = clock.getElapsedTime() * 0.3; 
            const radius = 13; 
            
            const x = Math.sin(t) * radius;
            const z = Math.cos(t) * radius;
            const y = 5 + Math.sin(t * 2) * 1; 

            group.current.position.set(x, y, z);
            group.current.rotation.y = t + Math.PI / 2; 
            model.current.rotation.z = -0.2; 
        }
    });

    return (
        <group ref={group}>
            <group ref={model}>
                <mesh position={[0, 0.3, 0]}><boxGeometry args={[1.0, 0.5, 1.6]} /><meshStandardMaterial color="#dc2626" /></mesh>
                <mesh position={[0.4, -0.1, 0]}><boxGeometry args={[0.05, 0.05, 2.0]} /><meshStandardMaterial color="#fbbf24" /></mesh>
                <mesh position={[-0.4, -0.1, 0]}><boxGeometry args={[0.05, 0.05, 2.0]} /><meshStandardMaterial color="#fbbf24" /></mesh>
                
                <group position={[0, 0.6, -0.2]}>
                    <mesh><sphereGeometry args={[0.35]} /><meshStandardMaterial color="#dc2626" /></mesh>
                    <mesh position={[0, 0.35, 0]}><sphereGeometry args={[0.18]} /><meshStandardMaterial color="#fca5a5" /></mesh>
                    <mesh position={[0, 0.3, 0.15]} rotation={[0.5,0,0]}><coneGeometry args={[0.15, 0.3, 8]} /><meshStandardMaterial color="white" /></mesh>
                    <mesh position={[0, 0.55, 0]} rotation={[-0.2, 0, 0]}><coneGeometry args={[0.18, 0.4]} /><meshStandardMaterial color="#dc2626" /></mesh>
                    <mesh position={[0, 0.75, -0.1]}><sphereGeometry args={[0.05]} /><meshStandardMaterial color="white" /></mesh>
                </group>

                {[1.5, 2.5].map((zOffset, i) => (
                    <group key={i} position={[0, -0.2, zOffset]}>
                        <group position={[0.3, 0, 0]}>
                            <mesh><boxGeometry args={[0.2, 0.3, 0.6]} /><meshStandardMaterial color="#78350f" /></mesh>
                            <mesh position={[0, 0.3, 0.3]}><boxGeometry args={[0.15, 0.2, 0.25]} /><meshStandardMaterial color="#78350f" /></mesh>
                            {i===1 && <mesh position={[0, 0.3, 0.45]}><sphereGeometry args={[0.05]} /><meshBasicMaterial color="red" /></mesh>}
                        </group>
                        <group position={[-0.3, 0, 0]}>
                            <mesh><boxGeometry args={[0.2, 0.3, 0.6]} /><meshStandardMaterial color="#78350f" /></mesh>
                            <mesh position={[0, 0.3, 0.3]}><boxGeometry args={[0.15, 0.2, 0.25]} /><meshStandardMaterial color="#78350f" /></mesh>
                            {i===1 && <mesh position={[0, 0.3, 0.45]}><sphereGeometry args={[0.05]} /><meshBasicMaterial color="red" /></mesh>}
                        </group>
                    </group>
                ))}

                {/* Branding Banner - Attached to back */}
                <group position={[0, 0.6, -1.0]} rotation={[0, Math.PI, 0]}>
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[1.8, 0.6, 0.06]} />
                        <meshPhysicalMaterial 
                            color="#ef4444" 
                            transmission={0.6} 
                            opacity={0.9} 
                            transparent 
                            roughness={0.2} 
                            metalness={0.2} 
                            emissive="#b91c1c" 
                            emissiveIntensity={0.5} 
                            thickness={1}
                        />
                    </mesh>
                    <mesh position={[0, 0, 0.04]}><planeGeometry args={[1.6, 0.45]} /><meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.2} /></mesh>
                    <Text position={[0, 0, 0.05]} fontSize={0.2} color="#dc2626" anchorX="center" anchorY="middle">ЛюблюPizza</Text>
                    <mesh position={[0.7, 0, 0.04]} rotation={[Math.PI, 0, 0]} scale={0.15} geometry={assets.heartGeo} material={assets.glowingRed} />
                    <mesh position={[-0.7, 0, 0.04]} rotation={[Math.PI, 0, 0]} scale={0.15} geometry={assets.heartGeo} material={assets.glowingRed} />
                </group>
                
                <Sparkles count={30} scale={[2, 2, 6]} position={[0, 0, -3]} color="#fbbf24" size={4} />
            </group>
        </group>
    )
});

const Snowfall = React.memo(() => {
    const count = 200; // MOBILE OPTIMIZATION: Reduced count
    const mesh = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const particles = useMemo(() => Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 40,
        y: Math.random() * 20,
        z: (Math.random() - 0.5) * 40,
        speed: 0.02 + Math.random() * 0.05
    })), []);

    useFrame(() => {
        if (!mesh.current) return;
        particles.forEach((p, i) => {
            p.y -= p.speed;
            if (p.y < 0) p.y = 20;
            dummy.position.set(p.x, p.y, p.z);
            dummy.updateMatrix();
            mesh.current.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
            <sphereGeometry args={[0.05, 4, 4]} />
            <meshBasicMaterial color="white" transparent opacity={0.6} />
        </instancedMesh>
    )
});

const TreeGarland = React.memo(({ typeId }: { typeId: string | null }) => {
    const def = GARLANDS.find(g => g.id === typeId);
    const curve = useMemo(() => {
        const points = [];
        const loops = 10;
        const startY = 7.8;
        const height = 6.8;
        for(let i = 0; i <= 100; i++) {
            const t = i / 100;
            const angle = t * Math.PI * 2 * loops;
            const y = startY - (t * height); 
            const r = 0.2 + (3.2 * t);
            points.push(new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r));
        }
        return new THREE.CatmullRomCurve3(points);
    }, []);

    if (!def) return null;

    return (
        <group>
            <Tube args={[curve, 64, 0.03, 6, false]}><meshStandardMaterial color="#111" /></Tube>
            {Array.from({ length: 80 }).map((_, i) => {
                const t = i / 80;
                const pos = curve.getPoint(t);
                const color = def.colors[i % def.colors.length];
                return (
                    <mesh key={i} position={pos}><sphereGeometry args={[0.07]} /><meshBasicMaterial color={color} /><pointLight distance={1.5} intensity={def.intensity} color={color} /></mesh>
                )
            })}
        </group>
    )
});

// MOBILE OPTIMIZATION: Use Ref for ghost object to prevent react re-renders on pointer move
const HeroTree = React.memo(({ selectedDecor, placedItems, onPlace, garlandId, topperId }: any) => {
    const assets = useAssets();
    const ghostRef = useRef<THREE.Group>(null);
    const currentGhostData = useRef<{pos: THREE.Vector3, rot: THREE.Quaternion} | null>(null);

    const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
        if (!selectedDecor) {
            if (ghostRef.current) ghostRef.current.visible = false;
            currentGhostData.current = null;
            return;
        }
        e.stopPropagation(); // Important
        
        const treeTopY = 8.0;
        const treeBottomY = 1.0;
        const maxRadius = 3.2;
        const point = e.point;
        const y = Math.max(treeBottomY, Math.min(treeTopY, point.y));
        const progress = (treeTopY - y) / (treeTopY - treeBottomY);
        const r = maxRadius * progress; 
        const angle = Math.atan2(point.z, point.x);
        const x = Math.cos(angle) * r;
        const z = Math.sin(angle) * r;
        const pos = new THREE.Vector3(x, y, z);
        
        const dummy = new THREE.Object3D();
        dummy.position.set(0,0,0);
        dummy.lookAt(x, 0, z); 
        dummy.rotateX(0.2); 
        
        if (ghostRef.current) {
            ghostRef.current.visible = true;
            ghostRef.current.position.copy(pos);
            ghostRef.current.quaternion.copy(dummy.quaternion);
        }
        currentGhostData.current = { pos, rot: dummy.quaternion.clone() };
    };

    const handleClick = (e: ThreeEvent<MouseEvent>) => {
        if (!selectedDecor || !currentGhostData.current) return;
        e.stopPropagation();
        onPlace(currentGhostData.current.pos, currentGhostData.current.rot);
    };

    const handlePointerOut = () => {
        if (ghostRef.current) ghostRef.current.visible = false;
        currentGhostData.current = null;
    }

    return (
        <group>
            {/* Invisible Collision Mesh for Performance */}
            <mesh visible={false} position={[0, 4.5, 0]} onPointerMove={handlePointerMove} onClick={handleClick} onPointerOut={handlePointerOut}>
                <cylinderGeometry args={[0, 3.5, 9, 12]} />
                <meshBasicMaterial color="red" />
            </mesh>

            <group position={[0, 0, 0]}>
                <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.6, 1, 1.5, 8]} /><meshStandardMaterial color="#3E2723" /></mesh>
                {[2, 4, 5.8, 7.2].map((y, i) => {
                    const s = [3.2, 2.6, 1.8, 1][i];
                    const h = [3.5, 3, 2.5, 2][i];
                    return <mesh key={i} position={[0, y, 0]}><coneGeometry args={[s, h, 16]} /><meshStandardMaterial color="#10b981" roughness={0.8} /></mesh>
                })}
            </group>

            <TreeGarland typeId={garlandId} />

            {topperId && (
                <group position={[0, 7.6, 0]}>
                    {topperId === 'star' && <mesh position={[0, 0.2, 0]}><octahedronGeometry args={[0.6]} /><meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1} /></mesh>}
                    {topperId === 'heart' && <group scale={1.5} rotation={[Math.PI, 0, 0]} position={[0, 0.2, 0]}><mesh geometry={assets.heartGeo} material={assets.glowingRed} /></group>}
                    {topperId === 'snowflake' && <group>{[0, 1, 2].map(k => <mesh key={k} rotation={[0, 0, k * Math.PI/3]}><boxGeometry args={[0.1, 1.2, 0.1]} /><meshStandardMaterial color="#bae6fd" emissive="#bae6fd" /></mesh>)}</group>}
                </group>
            )}

            {placedItems.map((item: any) => {
                const def = ORNAMENTS.find(o => o.id === item.typeId);
                if (!def) return null;
                return <group key={item.id} position={item.position} quaternion={item.quaternion}><DetailedOrnament type={def.type} color={def.color} assets={assets} /></group>
            })}

            {/* Ghost Render via Ref */}
            <group ref={ghostRef} visible={false}>
                <mesh><sphereGeometry args={[0.3]} /><meshBasicMaterial color="white" opacity={0.5} transparent /></mesh>
            </group>
        </group>
    );
});

const LoadingSpinner = () => (
    <group rotation={[0,0,0]}><mesh><torusGeometry args={[2, 0.2, 16, 100]} /><meshStandardMaterial color="white" /></mesh></group>
);

// Memoized Scene Container to prevent re-renders from UI
const SeasonalScene = React.memo(({ selectedDecor, placedItems, onPlace, garland, topper, setContainerRef }: any) => (
    <div ref={setContainerRef} className="absolute inset-0 z-0">
        <Canvas
            shadows
            camera={{ position: [0, 11, 22], fov: 48 }}
            dpr={[1, 1.5]}
            gl={{ preserveDrawingBuffer: true }}
        >
            <Suspense fallback={<LoadingSpinner />}>
                <ambientLight intensity={0.5} color="#3b82f6" />
                <pointLight position={[10, 10, 10]} intensity={1} color="#ffaa00" />
                <spotLight position={[5, 10, 5]} angle={0.5} penumbra={1} intensity={2} color="white" castShadow target-position={[0, 4, 0]} />
                <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={0.5} />
                <fog attach="fog" args={['#0f172a', 15, 45]} />
                <HeroTree selectedDecor={selectedDecor} placedItems={placedItems} onPlace={onPlace} garlandId={garland} topperId={topper} />
                {Array.from({ length: 5 }).map((_, i) => {
                    const a = (i / 5) * Math.PI * 2;
                    return <BrandedHouse key={i} position={[Math.sin(a)*16, 0, Math.cos(a)*16]} rotation={[0, a + Math.PI, 0]} />
                })}
                <BackgroundForest />
                <Snowfall />
                <FlyingSanta />
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
                    <planeGeometry args={[60, 60]} /><meshStandardMaterial color="#e2e8f0" roughness={0.8} />
                </mesh>
            </Suspense>
            <OrbitControls
                enableZoom={true}
                target={[0, 7.2, 0]}
                minPolarAngle={Math.PI/4}
                maxPolarAngle={Math.PI/2 - 0.08}
                minDistance={10.5}
                maxDistance={26}
            />
        </Canvas>
    </div>
), (prev, next) => {
    // Only re-render canvas if 3D props change, ignore simple UI state like "activeTab"
    return prev.garland === next.garland && prev.topper === next.topper && prev.placedItems === next.placedItems && prev.selectedDecor === next.selectedDecor;
});

const SeasonalEvent: React.FC<SeasonalEventProps> = ({ language, onBack }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [activeTab, setActiveTab] = useState<'decor' | 'lights' | 'top'>('decor');
    const [selectedDecor, setSelectedDecor] = useState<string | null>(ORNAMENTS[0].id);
    const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
    const [placedItems, setPlacedItems] = useState<any[]>([]);
    const [garland, setGarland] = useState<string | null>(null);
    const [topper, setTopper] = useState<string | null>(TOPPERS[0].id);
    const [infoDismissed, setInfoDismissed] = useState(false);

    const responsiveOptions = useMemo(() => ({
        fillHeight: 0.96,
        fillWidth: 0.92,
        breakpoints: {
            mobile: {
                reservedTop: () => (infoDismissed ? 120 : 220),
                reservedBottom: ({ viewport }) => Math.max(viewport.height * 0.24, 210) + 24,
                minHeight: 520,
                minWidth: 360,
                maxHeightScale: 0.98,
                horizontalPadding: 12,
            },
            tablet: {
                reservedTop: 140,
                reservedBottom: 64,
                minHeight: 680,
                minWidth: 760,
                fillWidth: 0.9,
                horizontalPadding: 24,
            },
            desktop: {
                reservedTop: 140,
                reservedBottom: 140,
                minHeight: 820,
                minWidth: 960,
                maxHeightScale: 0.95,
                fillHeight: 0.92,
                fillWidth: 0.86,
                horizontalPadding: 48,
            },
        },
    }), [infoDismissed]);

    const { stageHeight, stageWidth, viewport, isMobile, isDesktop } = useResponsiveGameViewport(responsiveOptions);

    const viewportKey = useMemo(
        () => `${viewport.width}x${viewport.height}-${infoDismissed ? 'info' : 'full'}`,
        [infoDismissed, viewport.height, viewport.width]
    );

    // MOBILE OPTIMIZATION: Lock Scroll only on mobile, keep desktop scrollable for control panel
    useEffect(() => {
        if (!isMobile) return;

        const previousOverflow = document.body.style.overflow;
        const previousTouchAction = document.body.style.touchAction;
        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';

        const preventDefault = (e: TouchEvent) => {
            // Allow multi-touch gestures if needed, but mostly block
            if (e.touches.length > 1) return;
            e.preventDefault();
        };

        // Passive false required to preventDefault
        window.addEventListener('touchmove', preventDefault, { passive: false });

        return () => {
            document.body.style.overflow = previousOverflow;
            document.body.style.touchAction = previousTouchAction;
            window.removeEventListener('touchmove', preventDefault);
        };
    }, [isMobile]);

    const TABS = {
        decor: { ru: 'ИГРУШКИ', en: 'DECOR' },
        lights: { ru: 'ГИРЛЯНДЫ', en: 'LIGHTS' },
        top: { ru: 'ВЕРХУШКИ', en: 'TOPPERS' }
    };

    useEffect(() => {
        const savedData = localStorage.getItem('lyublupizza_tree_state');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                const hydratedItems = (parsed.items || []).map((item: any) => ({
                    id: item.id,
                    typeId: item.typeId,
                    position: new THREE.Vector3(item.position.x, item.position.y, item.position.z),
                    quaternion: new THREE.Quaternion(item.quaternion._x, item.quaternion._y, item.quaternion._z, item.quaternion._w)
                }));
                setPlacedItems(hydratedItems);
                setGarland(parsed.garland || null);
                setTopper(parsed.topper || null);
            } catch (e) { console.error('Load failed', e); }
        }
    }, []);

    useEffect(() => {
        const data = { items: placedItems, garland, topper };
        localStorage.setItem('lyublupizza_tree_state', JSON.stringify(data));
    }, [placedItems, garland, topper]);

    const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
    const controlsHeight = isMobile ? clamp(viewport.height * 0.24, 210, 280) : 0;
    const desktopSceneHeight = clamp(viewport.height - 140, 820, 1700);
    const sceneMaxHeight = isMobile
        ? Math.max(viewport.height - controlsHeight - 24, 480)
        : Math.max(viewport.height - 120, 720);
    const sceneMinHeight = isMobile ? stageHeight : Math.max(stageHeight, desktopSceneHeight);
    const sceneHeight = Math.min(sceneMinHeight, sceneMaxHeight);
    const sceneScrollable = sceneMinHeight > sceneMaxHeight;

    const handleTakePhoto = () => {
        if (!containerRef.current) return;
        setIsProcessingPhoto(true);
        setTimeout(() => {
            const canvas = containerRef.current?.querySelector('canvas');
            if (!canvas) { setIsProcessingPhoto(false); return; }
            const width = 1080, height = 1350;
            const outputCanvas = document.createElement('canvas');
            outputCanvas.width = width; outputCanvas.height = height;
            const ctx = outputCanvas.getContext('2d');
            if (!ctx) return;
            ctx.fillStyle = '#fdf6e3'; ctx.fillRect(0, 0, width, height);
            const img = new Image();
            img.src = canvas.toDataURL('image/jpeg', 0.95);
            img.onload = () => {
                ctx.drawImage(img, 0, 0, img.width, img.height, 100, 100, width - 200, height - 480);
                ctx.strokeStyle = '#d4af37'; ctx.lineWidth = 10; ctx.strokeRect(20, 20, width - 40, height - 40);
                ctx.fillStyle = '#881337'; ctx.font = 'bold 42px serif'; ctx.textAlign = 'center';
                const greeting1 = language === 'ru' ? 'С Наступающим Новым Годом' : 'Merry Christmas';
                ctx.fillText(greeting1, width / 2, height - 300);
                const greeting2 = language === 'ru' ? 'и Рождеством!' : '& Happy New Year!';
                ctx.fillText(greeting2, width / 2, height - 250);
                ctx.fillStyle = '#b91c1c'; ctx.font = 'italic 30px serif';
                const sub1 = language === 'ru' ? 'Всегда горячо, с любовью,' : 'Always hot, with love,';
                ctx.fillText(sub1, width / 2, height - 200);
                ctx.fillStyle = '#1f2937'; ctx.font = 'italic 45px serif';
                const sub2 = language === 'ru' ? 'Ваша любимая пиццерия' : 'Your favorite pizzeria';
                ctx.fillText(sub2, width / 2, height - 140);
                const logoY = height - 60;
                ctx.font = '900 70px sans-serif';
                const t1 = "Люблю"; const t2 = "Pizza"; const heartSize = 50; const gap = 20;
                const w1 = ctx.measureText(t1).width; const w2 = ctx.measureText(t2).width; const totalW = w1 + w2 + gap + heartSize;
                let drawX = (width - totalW) / 2;
                ctx.textAlign = 'left';
                ctx.fillStyle = '#fbbf24'; ctx.fillText(t1, drawX, logoY); drawX += w1;
                ctx.fillStyle = '#ef4444'; ctx.fillText(t2, drawX, logoY); drawX += w2 + gap;
                ctx.fillStyle = '#ef4444'; ctx.beginPath();
                const hx = drawX + heartSize/2, hy = logoY - 25, hsz = heartSize;
                ctx.moveTo(hx, hy);
                ctx.bezierCurveTo(hx, hy - hsz/2, hx - hsz, hy - hsz/2, hx - hsz, hy);
                ctx.bezierCurveTo(hx - hsz, hy + hsz/2, hx, hy + hsz, hx, hy + hsz*1.5);
                ctx.bezierCurveTo(hx, hy + hsz, hx + hsz, hy + hsz/2, hx + hsz, hy);
                ctx.bezierCurveTo(hx + hsz, hy - hsz/2, hx, hy - hsz/2, hx, hy);
                ctx.fill();
                const link = document.createElement('a');
                link.download = `PizzaTree_${Date.now()}.jpg`;
                link.href = outputCanvas.toDataURL('image/jpeg', 0.9);
                link.click();
                setIsProcessingPhoto(false);
            };
        }, 100);
    };

    return (
        <div
            className="relative flex flex-col min-h-[100dvh] bg-[#0f172a] text-white"
            style={{ paddingBottom: isMobile ? controlsHeight + 16 : 120, touchAction: isMobile ? 'manipulation' : 'auto' }}
        >
            <div
                className="flex flex-col gap-3 px-4 pt-4 pb-2 md:px-6 md:pt-6"
                style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
            >
                <div className="flex items-center justify-between gap-2 md:gap-4">
                    <button onClick={onBack} className="p-2 md:p-3 bg-black/40 rounded-full text-white border border-white/10 backdrop-blur-md hover:bg-black/60 transition-colors w-fit">
                        <ArrowLeft />
                    </button>

                    <button onClick={handleTakePhoto} disabled={isProcessingPhoto} className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 px-4 md:px-6 py-2 rounded-full text-white font-bold shadow-lg hover:scale-105 transition-all text-xs md:text-sm">
                        {isProcessingPhoto ? <Loader2 className="animate-spin w-4 h-4" /> : <Camera className="w-4 h-4" />}
                        {language === 'ru' ? 'Фото на память' : 'Vintage Photo'}
                    </button>
                </div>

                {!infoDismissed && (
                    <div className="relative w-full md:max-w-xl">
                        <div className="bg-gradient-to-r from-indigo-900/85 to-purple-900/85 backdrop-blur-xl border border-white/10 rounded-2xl p-3 md:p-4 shadow-[0_0_30px_rgba(99,102,241,0.3)] flex flex-col gap-1 animate-in slide-in-from-top-4 duration-700 max-h-[40vh] overflow-hidden">
                            <div className="flex items-center gap-2 text-cyan-300 border-b border-white/10 pb-1.5 mb-1">
                                <Snowflake className="w-4 h-4 animate-spin-slow" />
                                <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.22em]">Сезон 2026</span>
                            </div>
                            <h2 className="text-sm sm:text-base md:text-2xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-indigo-200 drop-shadow-sm leading-tight">
                                Волшебный лес в ЛюблюPIZZA
                            </h2>
                            <p className="text-[11px] sm:text-xs text-indigo-200/80 font-mono uppercase tracking-wider leading-snug">
                                Укрась свою елочку
                            </p>
                            <button
                                className="absolute right-2 top-2 w-7 h-7 flex items-center justify-center rounded-full border border-white/10 text-white/80 hover:text-white hover:bg-white/10 transition md:hidden"
                                onClick={() => setInfoDismissed(true)}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="relative flex-1 flex flex-col px-4 md:px-6 pb-6">
                <div
                    key={viewportKey}
                    className="relative flex-1 rounded-2xl"
                    style={{
                        minHeight: Math.min(sceneMinHeight, sceneMaxHeight),
                        height: sceneHeight,
                        maxHeight: sceneMaxHeight,
                        maxWidth: isDesktop ? Math.min(stageWidth, viewport.width - 120) : '100%',
                        width: '100%',
                        marginInline: 'auto',
                        overflow: sceneScrollable ? 'auto' : 'hidden',
                        touchAction: 'none'
                    }}
                >
                    <SeasonalScene
                        selectedDecor={selectedDecor}
                        placedItems={placedItems}
                        onPlace={(pos: any, rot: any) => setPlacedItems(p => [...p, { id: Date.now(), typeId: selectedDecor, position: pos, quaternion: rot }])}
                        garland={garland}
                        topper={topper}
                        setContainerRef={(el: HTMLDivElement) => containerRef.current = el}
                    />
                </div>

                <div className="hidden md:block mt-6 pointer-events-auto md:self-center md:max-w-5xl w-full">
                    <div className="w-full bg-black/85 backdrop-blur-xl border border-white/10 rounded-3xl mx-auto p-4 shadow-2xl">
                        <div className="flex justify-center gap-2 mb-4 overflow-x-auto touch-pan-x px-1">
                            {['decor', 'lights', 'top'].map((tab) => (
                                <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition-all flex-shrink-0 ${activeTab === tab ? 'bg-pink-600 text-white' : 'bg-gray-800 text-gray-400'}`}>
                                    {TABS[tab as keyof typeof TABS][language]}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar touch-pan-x">
                            {activeTab === 'decor' && ORNAMENTS.map(i => (
                                <button key={i.id} onClick={() => setSelectedDecor(selectedDecor === i.id ? null : i.id)} className={`min-w-[70px] h-[70px] rounded-xl border-2 flex flex-col items-center justify-center transition-all flex-shrink-0 ${selectedDecor === i.id ? 'border-pink-500 bg-pink-500/20 scale-105' : 'border-white/10 hover:bg-white/5'}`}>
                                    <div className="w-6 h-6 rounded-full shadow-lg" style={{ backgroundColor: i.color }}></div>
                                    <span className="text-[9px] text-gray-300 mt-1 text-center leading-tight px-1 truncate w-full">{i.name[language]}</span>
                                </button>
                            ))}
                            {activeTab === 'lights' && GARLANDS.map(g => (
                                <button key={g.id} onClick={() => setGarland(garland === g.id ? null : g.id)} className={`min-w-[70px] h-[70px] rounded-xl border-2 flex flex-col items-center justify-center transition-all flex-shrink-0 ${garland === g.id ? 'border-blue-500 bg-blue-500/20' : 'border-white/10 hover:bg-white/5'}`}>
                                    <Zap className="text-yellow-400 w-5 h-5" />
                                    <span className="text-[9px] text-gray-300 mt-1 truncate w-full text-center">{g.name[language]}</span>
                                </button>
                            ))}
                            {activeTab === 'top' && TOPPERS.map(t => (
                                <button key={t.id} onClick={() => setTopper(topper === t.id ? null : t.id)} className={`min-w-[70px] h-[70px] rounded-xl border-2 flex flex-col items-center justify-center transition-all flex-shrink-0 ${topper === t.id ? 'border-yellow-500 bg-yellow-500/20' : 'border-white/10 hover:bg-white/5'}`}>
                                    <Star className="text-yellow-400 w-5 h-5" />
                                    <span className="text-[9px] text-gray-300 mt-1 truncate w-full text-center">{t.name[language]}</span>
                                </button>
                            ))}
                            {activeTab === 'decor' && placedItems.length > 0 && (
                                <button onClick={() => setPlacedItems([])} className="min-w-[70px] h-[70px] rounded-xl border border-red-500 text-red-500 flex items-center justify-center ml-auto hover:bg-red-900/20 transition-colors flex-shrink-0">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {isMobile && (
                <MobileDecorationControls
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    language={language}
                    selectedDecor={selectedDecor}
                    setSelectedDecor={setSelectedDecor}
                    garland={garland}
                    setGarland={setGarland}
                    topper={topper}
                    setTopper={setTopper}
                    placedItems={placedItems}
                    clearPlaced={() => setPlacedItems([])}
                    tabs={TABS}
                    controlsHeight={controlsHeight}
                />
            )}
        </div>
    );
};

const MobileDecorationControls = ({
    activeTab,
    setActiveTab,
    language,
    selectedDecor,
    setSelectedDecor,
    garland,
    setGarland,
    topper,
    setTopper,
    placedItems,
    clearPlaced,
    tabs,
    controlsHeight,
}: {
    activeTab: 'decor' | 'lights' | 'top';
    setActiveTab: (tab: 'decor' | 'lights' | 'top') => void;
    language: Language;
    selectedDecor: string | null;
    setSelectedDecor: (id: string | null) => void;
    garland: string | null;
    setGarland: (id: string | null) => void;
    topper: string | null;
    setTopper: (id: string | null) => void;
    placedItems: any[];
    clearPlaced: () => void;
    tabs: Record<'decor' | 'lights' | 'top', { ru: string; en: string }>;
    controlsHeight: number;
}) => {
    return (
        <div
            className="fixed inset-x-0 bottom-0 z-40 md:hidden pointer-events-auto"
            style={{ paddingBottom: `max(env(safe-area-inset-bottom), 14px)` }}
        >
            <div
                className="bg-black/90 backdrop-blur-xl border-t border-white/10 rounded-t-3xl shadow-2xl px-4 pb-3"
                style={{ minHeight: controlsHeight }}
            >
                <div className="flex justify-center gap-2 mb-3 overflow-x-auto touch-pan-x px-1">
                    {['decor', 'lights', 'top'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-3 py-2 rounded-full text-[11px] font-bold uppercase transition-all flex-shrink-0 ${activeTab === tab ? 'bg-pink-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                        >
                            {tabs[tab as keyof typeof tabs][language]}
                        </button>
                    ))}
                </div>
                <div className="flex gap-3 overflow-x-auto pb-1 custom-scrollbar touch-pan-x">
                    {activeTab === 'decor' && ORNAMENTS.map(i => (
                        <button
                            key={i.id}
                            onClick={() => setSelectedDecor(selectedDecor === i.id ? null : i.id)}
                            className={`min-w-[72px] h-[72px] rounded-xl border-2 flex flex-col items-center justify-center transition-all flex-shrink-0 ${selectedDecor === i.id ? 'border-pink-500 bg-pink-500/20 scale-105' : 'border-white/10 hover:bg-white/5'}`}
                        >
                            <div className="w-6 h-6 rounded-full shadow-lg" style={{ backgroundColor: i.color }}></div>
                            <span className="text-[10px] text-gray-200 mt-1 text-center leading-tight px-1 truncate w-full">{i.name[language]}</span>
                        </button>
                    ))}
                    {activeTab === 'lights' && GARLANDS.map(g => (
                        <button
                            key={g.id}
                            onClick={() => setGarland(garland === g.id ? null : g.id)}
                            className={`min-w-[72px] h-[72px] rounded-xl border-2 flex flex-col items-center justify-center transition-all flex-shrink-0 ${garland === g.id ? 'border-blue-500 bg-blue-500/20' : 'border-white/10 hover:bg-white/5'}`}
                        >
                            <Zap className="text-yellow-400 w-5 h-5" />
                            <span className="text-[10px] text-gray-200 mt-1 truncate w-full text-center">{g.name[language]}</span>
                        </button>
                    ))}
                    {activeTab === 'top' && TOPPERS.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTopper(topper === t.id ? null : t.id)}
                            className={`min-w-[72px] h-[72px] rounded-xl border-2 flex flex-col items-center justify-center transition-all flex-shrink-0 ${topper === t.id ? 'border-yellow-500 bg-yellow-500/20' : 'border-white/10 hover:bg-white/5'}`}
                        >
                            <Star className="text-yellow-400 w-5 h-5" />
                            <span className="text-[10px] text-gray-200 mt-1 truncate w-full text-center">{t.name[language]}</span>
                        </button>
                    ))}
                    {activeTab === 'decor' && placedItems.length > 0 && (
                        <button
                            onClick={clearPlaced}
                            className="min-w-[72px] h-[72px] rounded-xl border border-red-500 text-red-500 flex items-center justify-center ml-auto hover:bg-red-900/20 transition-colors flex-shrink-0"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SeasonalEvent;
