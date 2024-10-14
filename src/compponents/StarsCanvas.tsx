// StarsCanvas.tsx
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const StarsCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Setup Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });

    // Set renderer size
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Create particles
    const particlesCount = 300;
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200; // X
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200; // Y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200; // Z
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 50;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      particles.rotation.x += 0.001;
      particles.rotation.y += 0.001;
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      mountRef.current!.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      style={{ 
        pointerEvents: "none",
        position: 'fixed',  /* Gunakan fixed agar canvas tetap di belakang saat scroll */
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
      }} 
    />
  );
};

export default StarsCanvas;
