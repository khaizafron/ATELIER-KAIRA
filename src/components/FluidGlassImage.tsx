/* eslint-disable react/no-unknown-property */
'use client'

import * as THREE from 'three';
import { useRef, useState, useEffect, memo, Suspense } from 'react';
import { Canvas, createPortal, useFrame, useThree } from '@react-three/fiber';
import { useFBO, useGLTF, MeshTransmissionMaterial } from '@react-three/drei';
import { easing } from 'maath';

useGLTF.preload('/assets/3d/lens.glb');

interface ModeWrapperProps {
  children: React.ReactNode;
  glb: string;
  geometryKey: string;
  modeProps?: Record<string, unknown>;
}

const ModeWrapper = memo(function ModeWrapper({
  children,
  glb,
  geometryKey,
  modeProps = {},
}: ModeWrapperProps) {
  const ref = useRef<THREE.Mesh>(null!);
  const { nodes } = useGLTF(glb);
  const buffer = useFBO(1024, 1024);
  const { viewport: vp } = useThree();
  const [scene] = useState<THREE.Scene>(() => new THREE.Scene());
  const geoWidthRef = useRef<number>(1);

  useEffect(() => {
    const geo = (nodes[geometryKey] as THREE.Mesh)?.geometry;
    if (geo) {
      geo.computeBoundingBox();
      geoWidthRef.current = geo.boundingBox!.max.x - geo.boundingBox!.min.x || 1;
    }
  }, [nodes, geometryKey]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    
    const { gl, viewport, pointer, camera } = state;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);

    const destX = (pointer.x * v.width) / 2;
    const destY = (pointer.y * v.height) / 2;
    easing.damp3(ref.current.position, [destX, destY, 15], 0.15, delta);

    if ((modeProps as { scale?: number }).scale == null) {
      const maxWorld = v.width * 0.9;
      const desired = maxWorld / geoWidthRef.current;
      ref.current.scale.setScalar(Math.min(0.15, desired));
    }

    gl.setRenderTarget(buffer);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    gl.setClearColor(0x000000, 0);
  });

  const { scale, ior, thickness, anisotropy, chromaticAberration } = modeProps as {
    scale?: number;
    ior?: number;
    thickness?: number;
    anisotropy?: number;
    chromaticAberration?: number;
  };

  const geometry = (nodes[geometryKey] as THREE.Mesh)?.geometry;
  if (!geometry) return null;

  return (
    <>
      {createPortal(children, scene)}
      <mesh
        ref={ref}
        scale={scale ?? 0.15}
        rotation-x={Math.PI / 2}
        geometry={geometry}
      >
        <MeshTransmissionMaterial
          buffer={buffer.texture}
          ior={ior ?? 3.0}
          thickness={thickness ?? 0.2}
          anisotropy={anisotropy ?? 0.3}
          chromaticAberration={chromaticAberration ?? 0.5}
          distortion={1}
          distortionScale={0.5}
          temporalDistortion={0.1}
          samples={6}
          resolution={1024}
        />
      </mesh>
    </>
  );
});

function ProductImage({ imageUrl }: { imageUrl: string }) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const { viewport } = useThree();

  useEffect(() => {
    if (!imageUrl) return;
    
    const loader = new THREE.TextureLoader();
    loader.load(imageUrl, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      setTexture(tex);
    });
  }, [imageUrl]);

  if (!texture) return null;

  return (
    <mesh position={[0, 0, 0]} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry />
      <meshBasicMaterial 
        map={texture} 
        toneMapped={false}
        transparent={false}
      />
    </mesh>
  );
}

interface FluidGlassImageProps {
  children: React.ReactNode;
}

export default function FluidGlassImage({ children }: FluidGlassImageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const findImageUrl = () => {
      const img = containerRef.current?.querySelector('img');
      if (img) {
        const src = img.currentSrc || img.src;
        if (src && src !== imageUrl) {
          setImageUrl(src);
        }
      }
    };

    findImageUrl();

    const observer = new MutationObserver(findImageUrl);
    observer.observe(containerRef.current, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src', 'srcset']
    });

    return () => observer.disconnect();
  }, [children, imageUrl]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Original Image - ALWAYS VISIBLE, NO FILTER */}
      {children}

      {/* Lens effect with magnification */}
      {isHovered && imageUrl && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          <Canvas
            camera={{ position: [0, 0, 20], fov: 15 }}
            gl={{
              alpha: true,
              antialias: false,
              powerPreference: 'default',
            }}
            dpr={Math.min(window.devicePixelRatio, 1.5)}
          >
            <Suspense fallback={null}>
              <ModeWrapper
                glb="/assets/3d/lens.glb"
                geometryKey="Cylinder"
                modeProps={{
                  scale: 0.25,
                  ior: 2.4,              // Higher = more magnification
                  thickness: 0.2,        // Thinner = more magnification
                  chromaticAberration: 0.5,
                  anisotropy: 0.3
                }}
              >
                <ProductImage imageUrl={imageUrl} />
              </ModeWrapper>
            </Suspense>
          </Canvas>
        </div>
      )}
    </div>
  );
}