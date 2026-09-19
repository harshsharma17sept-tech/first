import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeBackgroundProps {
  interactive?: boolean;
}

export const ThreeBackground: React.FC<ThreeBackgroundProps> = ({ interactive = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Setup Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Group for all 3D assets
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // 1. Central 3D Geodesic Shield / Icosahedron
    const coreGeometry = new THREE.IcosahedronGeometry(7, 1);
    const coreWireframe = new THREE.WireframeGeometry(coreGeometry);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xec783b,
      transparent: true,
      opacity: 0.18,
      linewidth: 1
    });
    const coreMesh = new THREE.LineSegments(coreWireframe, lineMaterial);
    worldGroup.add(coreMesh);

    // Inner subtle glowing points at vertices
    const pointsMaterial = new THREE.PointsMaterial({
      color: 0xec783b,
      size: 0.22,
      transparent: true,
      opacity: 0.45
    });
    const pointsMesh = new THREE.Points(coreGeometry, pointsMaterial);
    worldGroup.add(pointsMesh);

    // 2. Outer orbiting cyber ring
    const ringGeometry = new THREE.TorusGeometry(11, 0.08, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xd9662b,
      transparent: true,
      opacity: 0.12
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.rotation.x = Math.PI / 3;
    worldGroup.add(ringMesh);

    // Second inclined ring
    const ring2Geometry = new THREE.TorusGeometry(12.5, 0.06, 16, 100);
    const ring2Material = new THREE.MeshBasicMaterial({
      color: 0x1b8a44,
      transparent: true,
      opacity: 0.1
    });
    const ring2Mesh = new THREE.Mesh(ring2Geometry, ring2Material);
    ring2Mesh.rotation.x = -Math.PI / 4;
    ring2Mesh.rotation.y = Math.PI / 6;
    worldGroup.add(ring2Mesh);

    // 3. Ambient Floating Cyber Particles
    const particleCount = 120;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 45;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 35;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      velocities.push({
        x: (Math.random() - 0.5) * 0.006,
        y: (Math.random() - 0.5) * 0.006,
        z: (Math.random() - 0.5) * 0.006
      });
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x9e9e9e,
      size: 0.16,
      transparent: true,
      opacity: 0.35
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    worldGroup.add(particleSystem);

    // Mouse Parallax tracking
    let targetX = 0;
    let targetY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      if (!interactive) return;
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      targetX = (event.clientX - halfW) / halfW;
      targetY = (event.clientY - halfH) / halfH;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!interactive || event.touches.length === 0) return;
      const touch = event.touches[0];
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      targetX = (touch.clientX - halfW) / halfW;
      targetY = (touch.clientY - halfH) / halfH;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Handle Window Resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle smooth damping mouse movement
      mouseX += (targetX - mouseX) * 0.04;
      mouseY += (targetY - mouseY) * 0.04;

      worldGroup.rotation.y = elapsedTime * 0.08 + mouseX * 0.45;
      worldGroup.rotation.x = Math.sin(elapsedTime * 0.06) * 0.15 - mouseY * 0.35;

      ringMesh.rotation.z = elapsedTime * 0.05;
      ring2Mesh.rotation.z = -elapsedTime * 0.04;

      // Subtle breathing pulse for core
      const pulse = 1 + Math.sin(elapsedTime * 1.2) * 0.03;
      coreMesh.scale.set(pulse, pulse, pulse);
      pointsMesh.scale.set(pulse, pulse, pulse);

      // Drift particles gently
      const posAttr = particleGeometry.attributes.position as THREE.BufferAttribute;
      const array = posAttr.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        array[i * 3] += velocities[i].x;
        array[i * 3 + 1] += velocities[i].y;
        array[i * 3 + 2] += velocities[i].z;

        if (array[i * 3] > 25) array[i * 3] = -25;
        if (array[i * 3] < -25) array[i * 3] = 25;
        if (array[i * 3 + 1] > 20) array[i * 3 + 1] = -20;
        if (array[i * 3 + 1] < -20) array[i * 3 + 1] = 20;
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);

      coreGeometry.dispose();
      coreWireframe.dispose();
      lineMaterial.dispose();
      pointsMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      ring2Geometry.dispose();
      ring2Material.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [interactive]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-85 transition-opacity duration-1000"
      aria-hidden="true"
    />
  );
};
