'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SpaceObject, UNIVERSE_OBJECTS } from '@/lib/universeData';
import { UniverseDrawer } from './UniverseDrawer';
import { UniverseUIControls } from './UniverseUIControls';

export function Universe3DScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedObject, setSelectedObject] = useState<SpaceObject | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'galaxy' | 'solar'>('all');
  const [speed, setSpeed] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const planetsRef = useRef<{ id: string; mesh: THREE.Mesh; orbitRadius?: number; orbitSpeed?: number; angle: number }[]>([]);
  const galaxyParticlesRef = useRef<THREE.Points | null>(null);
  const targetCameraPos = useRef<THREE.Vector3 | null>(null);
  const targetLookAt = useRef<THREE.Vector3 | null>(null);
  const currentLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  // Reset Camera Position
  const handleResetCamera = useCallback(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    setSelectedObject(null);
    targetCameraPos.current = new THREE.Vector3(0, 150, 320);
    targetLookAt.current = new THREE.Vector3(0, 0, 0);
  }, []);

  // Focus Camera on Object
  const handleFocusObject = useCallback((obj: SpaceObject) => {
    setSelectedObject(obj);
    if (!cameraRef.current || !controlsRef.current) return;

    let targetPos: THREE.Vector3;
    if (obj.viewCategory === 'solar') {
      const pData = planetsRef.current.find((p) => p.id === obj.id);
      if (pData) {
        const pPos = pData.mesh.position;
        targetPos = new THREE.Vector3(pPos.x + obj.size * 3 + 10, pPos.y + obj.size * 2 + 5, pPos.z + obj.size * 3 + 10);
        targetLookAt.current = pPos.clone();
      } else {
        targetPos = new THREE.Vector3(obj.position[0] + 30, obj.position[1] + 20, obj.position[2] + 40);
        targetLookAt.current = new THREE.Vector3(...obj.position);
      }
    } else {
      targetPos = new THREE.Vector3(obj.position[0] + obj.size * 1.8 + 20, obj.position[1] + obj.size + 15, obj.position[2] + obj.size * 1.8 + 20);
      targetLookAt.current = new THREE.Vector3(...obj.position);
    }
    targetCameraPos.current = targetPos;
  }, []);

  // Filter View Handler
  const handleCategoryChange = (category: 'all' | 'galaxy' | 'solar') => {
    setCategoryFilter(category);
    if (!cameraRef.current || !controlsRef.current) return;

    if (category === 'solar') {
      const sun = UNIVERSE_OBJECTS.find((o) => o.id === 'sol');
      if (sun) handleFocusObject(sun);
    } else if (category === 'galaxy') {
      const galaxy = UNIVERSE_OBJECTS.find((o) => o.id === 'via-lactea');
      if (galaxy) handleFocusObject(galaxy);
    } else {
      handleResetCamera();
    }
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight || 550;

    // 1. SCENE & CAMERA
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060811, 0.0008);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 3000);
    camera.position.set(0, 160, 340);
    cameraRef.current = camera;

    // 2. RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x060811, 1);
    mount.appendChild(renderer.domElement);

    // 3. CONTROLS
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 1200;
    controls.minDistance = 5;
    controlsRef.current = controls;

    // 4. LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xfff7ed, 3, 600, 0.3);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // 5. STARFIELD BACKGROUND
    const starCount = 6000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const r = 800 + Math.random() * 1000;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = r * Math.cos(phi);

      const color = new THREE.Color();
      color.setHSL(0.6 + Math.random() * 0.2, 0.7, 0.7 + Math.random() * 0.3);
      starColors[i * 3] = color.r;
      starColors[i * 3 + 1] = color.g;
      starColors[i * 3 + 2] = color.b;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    const starMat = new THREE.PointsMaterial({ size: 1.5, vertexColors: true, transparent: true, opacity: 0.8 });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 6. MILKY WAY SPIRAL GALAXY PARTICLES
    const particleCount = 20000;
    const galaxyGeo = new THREE.BufferGeometry();
    const galaxyPos = new Float32Array(particleCount * 3);
    const galaxyColors = new Float32Array(particleCount * 3);
    const arms = 4;
    const radius = 220;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const r = Math.pow(Math.random(), 2) * radius;
      const spinAngle = r * 0.08;
      const branchAngle = ((i % arms) * 2 * Math.PI) / arms;

      const randomX = (Math.random() - 0.5) * (30 - r * 0.1);
      const randomY = (Math.random() - 0.5) * (20 - r * 0.08);
      const randomZ = (Math.random() - 0.5) * (30 - r * 0.1);

      galaxyPos[i3] = Math.cos(branchAngle + spinAngle) * r + randomX;
      galaxyPos[i3 + 1] = randomY;
      galaxyPos[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;

      // Color interpolation: bright core (orange/yellow) to outer arms (purple/blue)
      const mixColor = new THREE.Color();
      if (r < 30) {
        mixColor.setHSL(0.1, 0.9, 0.7); // Center yellow-gold
      } else {
        const pct = r / radius;
        mixColor.setHSL(0.7 - pct * 0.2, 0.8, 0.5); // Outer purple-blue
      }
      galaxyColors[i3] = mixColor.r;
      galaxyColors[i3 + 1] = mixColor.g;
      galaxyColors[i3 + 2] = mixColor.b;
    }
    galaxyGeo.setAttribute('position', new THREE.BufferAttribute(galaxyPos, 3));
    galaxyGeo.setAttribute('color', new THREE.BufferAttribute(galaxyColors, 3));
    const galaxyMat = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const galaxyParticles = new THREE.Points(galaxyGeo, galaxyMat);
    galaxyParticlesRef.current = galaxyParticles;
    scene.add(galaxyParticles);

    // 7. SUPERMASSIVE BLACK HOLE (Sgr A*)
    const sgrA = UNIVERSE_OBJECTS.find((o) => o.id === 'sgra');
    if (sgrA) {
      const bhGeo = new THREE.SphereGeometry(6, 32, 32);
      const bhMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const bhMesh = new THREE.Mesh(bhGeo, bhMat);
      bhMesh.position.set(0, 0, 0);
      bhMesh.userData = { spaceObject: sgrA };
      scene.add(bhMesh);

      // Accretion Ring Glow
      const ringGeo = new THREE.TorusGeometry(12, 3, 16, 100);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: false, transparent: true, opacity: 0.7 });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2.5;
      scene.add(ringMesh);
    }

    // 8. NEBULAE CLOUDS (Orion & Ring Nebula)
    const createNebulaCloud = (pos: [number, number, number], colorHex: string, size: number, objData: SpaceObject) => {
      const group = new THREE.Group();
      group.position.set(...pos);

      const pGeo = new THREE.BufferGeometry();
      const pCount = 800;
      const pPositions = new Float32Array(pCount * 3);
      for (let i = 0; i < pCount; i++) {
        pPositions[i * 3] = (Math.random() - 0.5) * size;
        pPositions[i * 3 + 1] = (Math.random() - 0.5) * size;
        pPositions[i * 3 + 2] = (Math.random() - 0.5) * size;
      }
      pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
      const pMat = new THREE.PointsMaterial({
        color: new THREE.Color(colorHex),
        size: 3,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
      });
      const pMesh = new THREE.Points(pGeo, pMat);
      group.add(pMesh);

      // Core clickable sphere
      const coreGeo = new THREE.SphereGeometry(size * 0.25, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(colorHex), transparent: true, opacity: 0.3 });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.userData = { spaceObject: objData };
      group.add(coreMesh);

      scene.add(group);
    };

    const orionObj = UNIVERSE_OBJECTS.find((o) => o.id === 'orion-nebula');
    if (orionObj) createNebulaCloud(orionObj.position, orionObj.color, orionObj.size, orionObj);

    const ringObj = UNIVERSE_OBJECTS.find((o) => o.id === 'ring-nebula');
    if (ringObj) createNebulaCloud(ringObj.position, ringObj.color, ringObj.size, ringObj);

    // 9. ASTEROID BELT PARTICLES
    const astCount = 1500;
    const astGeo = new THREE.BufferGeometry();
    const astPos = new Float32Array(astCount * 3);
    for (let i = 0; i < astCount; i++) {
      const r = 102 + Math.random() * 12;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 4;
      astPos[i * 3] = r * Math.cos(theta);
      astPos[i * 3 + 1] = y;
      astPos[i * 3 + 2] = r * Math.sin(theta);
    }
    astGeo.setAttribute('position', new THREE.BufferAttribute(astPos, 3));
    const astMat = new THREE.PointsMaterial({ color: 0x888888, size: 0.8 });
    const astBelt = new THREE.Points(astGeo, astMat);
    scene.add(astBelt);

    // 10. SOLAR SYSTEM PLANETS & SUN
    const clickableMeshes: THREE.Mesh[] = [];
    planetsRef.current = [];

    UNIVERSE_OBJECTS.filter((o) => o.viewCategory === 'solar').forEach((obj) => {
      const isSun = obj.id === 'sol';
      const geometry = new THREE.SphereGeometry(obj.size, isSun ? 32 : 24, isSun ? 32 : 24);
      let material: THREE.Material;

      if (isSun) {
        material = new THREE.MeshBasicMaterial({ color: new THREE.Color(obj.color) });
      } else {
        material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(obj.color),
          roughness: 0.6,
          metalness: 0.2
        });
      }

      const mesh = new THREE.Mesh(geometry, material);
      mesh.userData = { spaceObject: obj };

      if (isSun) {
        mesh.position.set(0, 0, 0);
      } else if (obj.orbitRadius) {
        const angle = Math.random() * Math.PI * 2;
        mesh.position.set(obj.orbitRadius * Math.cos(angle), 0, obj.orbitRadius * Math.sin(angle));

        // Saturn Ring
        if (obj.ringColor) {
          const ringG = new THREE.RingGeometry(obj.size * 1.3, obj.size * 2.2, 32);
          const ringM = new THREE.MeshBasicMaterial({
            color: new THREE.Color(obj.ringColor),
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7
          });
          const ring = new THREE.Mesh(ringG, ringM);
          ring.rotation.x = Math.PI / 2.2;
          mesh.add(ring);
        }

        // Orbit Circle Line
        const orbitGeo = new THREE.RingGeometry(obj.orbitRadius - 0.2, obj.orbitRadius + 0.2, 90);
        const orbitMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.08 });
        const orbitLine = new THREE.Mesh(orbitGeo, orbitMat);
        orbitLine.rotation.x = Math.PI / 2;
        scene.add(orbitLine);

        planetsRef.current.push({
          id: obj.id,
          mesh,
          orbitRadius: obj.orbitRadius,
          orbitSpeed: obj.orbitSpeed || 0.01,
          angle
        });
      }

      scene.add(mesh);
      clickableMeshes.push(mesh);
    });

    // 11. RAYCASTER FOR CLICK DETECTION
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      for (const hit of intersects) {
        const objData = hit.object.userData?.spaceObject as SpaceObject | undefined;
        if (objData) {
          handleFocusObject(objData);
          break;
        }
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('click', handlePointerDown);

    // 12. ANIMATION LOOP
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Rotate Galaxy Particles slowly
      if (galaxyParticlesRef.current) {
        galaxyParticlesRef.current.rotation.y += 0.0003 * speed;
      }

      // Orbit Planets
      if (speed > 0) {
        planetsRef.current.forEach((p) => {
          if (p.orbitRadius && p.orbitSpeed) {
            p.angle += p.orbitSpeed * 0.05 * speed;
            p.mesh.position.x = p.orbitRadius * Math.cos(p.angle);
            p.mesh.position.z = p.orbitRadius * Math.sin(p.angle);
            p.mesh.rotation.y += 0.01;
          }
        });
      }

      // Smooth Camera Lerp
      if (targetCameraPos.current && targetLookAt.current) {
        camera.position.lerp(targetCameraPos.current, 0.05);
        currentLookAt.current.lerp(targetLookAt.current, 0.05);
        controls.target.copy(currentLookAt.current);

        if (camera.position.distanceTo(targetCameraPos.current) < 0.2) {
          targetCameraPos.current = null;
          targetLookAt.current = null;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // 13. RESIZE HANDLER
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight || 550;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // CLEANUP
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('click', handlePointerDown);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [handleFocusObject, speed]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[calc(100vh-79px)] bg-[#060811] overflow-hidden shadow-2xl transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 h-screen rounded-none' : ''
      }`}
    >
      {/* UI Top Bar Controls */}
      <UniverseUIControls
        currentCategory={categoryFilter}
        onCategoryChange={handleCategoryChange}
        speed={speed}
        onSpeedChange={setSpeed}
        onResetCamera={handleResetCamera}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onSelectObject={handleFocusObject}
      />

      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Info Drawer */}
      <UniverseDrawer
        selectedObject={selectedObject}
        onClose={() => setSelectedObject(null)}
        onFocus={handleFocusObject}
      />

      {/* Subtle Bottom Instruction */}
      <div className="absolute bottom-4 left-6 z-20 pointer-events-none text-[11px] text-white/50 bg-[#0d1117]/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Navega con tu ratón (arrastrar para rotar, rueda para zoom). Haz clic en cualquier cuerpo celeste para explorarlo.</span>
      </div>
    </div>
  );
}
