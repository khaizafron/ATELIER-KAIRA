/* eslint-disable react/no-unknown-property */
import * as THREE from 'three';
import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { easing } from 'maath';

// Force preload
useGLTF.preload('/assets/3d/lens.glb');

function LensModel() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { nodes } = useGLTF('/assets/3d/lens.glb');
  const { viewport, size } = useThree();

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    const { pointer } = state;
    const v = viewport.getCurrentViewport(state.camera, [0, 0, 15]);
    
    const destX = (pointer.x * v.width) / 2;
    const destY = (pointer.y * v.height) / 2;
    
    easing.damp3(meshRef.current.position, [destX, destY, 15], 0.15, delta);
  });

  const geometry = (nodes.Cylinder as THREE.Mesh)?.geometry;

  if (!geometry) {
    console.error('Cylinder not found in lens.glb!');
    return null;
  }

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      scale={0.25}
      rotation-x={Math.PI / 2}
    >
      <meshPhysicalMaterial
        transparent
        opacity={0.6}
        transmission={0.95}
        thickness={5}
        roughness={0}
        metalness={0.1}
        ior={1.5}
        envMapIntensity={1}
        clearcoat={1}
        clearcoatRoughness={0}
      />
    </mesh>
  );
}

export default function FluidGlass() {
  const [canRender, setCanRender] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Validate WebGL
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl', { 
        failIfMajorPerformanceCaveat: false 
      });
      
      if (!gl) {
        console.error('WebGL not available');
        setHasError(true);
        return;
      }

      console.log('WebGL OK, GPU:', gl.getParameter(gl.RENDERER));
    } catch (e) {
      console.error('WebGL test failed:', e);
      setHasError(true);
      return;
    }

    // Context loss handler
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      console.error('Context Lost - reloading in 2s...');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    };

    window.addEventListener('webglcontextlost', handleContextLost);

    // Delayed render
    const timer = setTimeout(() => {
      setCanRender(true);
    }, 1000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('webglcontextlost', handleContextLost);
    };
  }, []);

  if (hasError || !canRender) return null;

  return (
    <Canvas
      camera={{ position: [0, 0, 20], fov: 15 }}
      gl={{
        alpha: true,
        antialias: false,
        powerPreference: 'low-power',
        precision: 'mediump',
        stencil: false,
        depth: true,
        premultipliedAlpha: true,
      }}
      dpr={1}
      frameloop="demand"
      onCreated={({ gl, invalidate }) => {
        gl.setClearColor(0x000000, 0);
        console.log('Canvas created successfully');
        
        // Force initial render
        invalidate();
      }}
      style={{
        pointerEvents: 'none',
      }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.8} />
        <LensModel />
      </Suspense>
    </Canvas>
  );
}