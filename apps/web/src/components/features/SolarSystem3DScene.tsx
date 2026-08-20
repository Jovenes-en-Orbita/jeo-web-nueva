'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SpaceObject, UNIVERSE_OBJECTS } from '@/lib/universeData';
import { UniverseDrawer } from './UniverseDrawer';
import { FiRotateCw, FiMaximize, FiMinimize, FiZap } from 'react-icons/fi';

export function SolarSystem3DScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedObject, setSelectedObject] = useState<SpaceObject | null>(null);
  const [speed, setSpeed] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Filter only solar system objects
  const solarObjects = UNIVERSE_OBJECTS.filter((o) => o.viewCategory === 'solar');

  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const planetsRef = useRef<{ id: string; mesh: THREE.Mesh; orbitRadius?: number; orbitSpeed?: number; angle: number }[]>([]);
  const targetCameraPos = useRef<THREE.Vector3 | null>(null);
  const targetLookAt = useRef<THREE.Vector3 | null>(null);
  const currentLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  // Reset Camera Position
  const handleResetCamera = useCallback(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    setSelectedObject(null);
    targetCameraPos.current = new THREE.Vector3(0, 120, 240);
    targetLookAt.current = new THREE.Vector3(0, 0, 0);
  }, []);

  // Focus Camera on Object
  const handleFocusObject = useCallback((obj: SpaceObject) => {
    setSelectedObject(obj);
    if (!cameraRef.current || !controlsRef.current) return;

    let targetPos: THREE.Vector3;
    const pData = planetsRef.current.find((p) => p.id === obj.id);
    if (pData) {
      const pPos = pData.mesh.position;
      targetPos = new THREE.Vector3(pPos.x + obj.size * 3.5 + 10, pPos.y + obj.size * 2 + 5, pPos.z + obj.size * 3.5 + 10);
      targetLookAt.current = pPos.clone();
    } else {
      targetPos = new THREE.Vector3(obj.position[0] + 30, obj.position[1] + 20, obj.position[2] + 40);
      targetLookAt.current = new THREE.Vector3(...obj.position);
    }
    targetCameraPos.current = targetPos;
  }, []);

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
    scene.fog = new THREE.FogExp2(0x060811, 0.0006);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);
    camera.position.set(0, 120, 240);
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
    controls.maxDistance = 800;
    controls.minDistance = 5;
    controlsRef.current = controls;

    // 4. LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xfff7ed, 3.5, 800, 0.2);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // 5. STARFIELD BACKGROUND
    const starCount = 4000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const r = 600 + Math.random() * 800;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = r * Math.cos(phi);

      const color = new THREE.Color();
      color.setHSL(0.55 + Math.random() * 0.15, 0.6, 0.7 + Math.random() * 0.3);
      starColors[i * 3] = color.r;
      starColors[i * 3 + 1] = color.g;
      starColors[i * 3 + 2] = color.b;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    const starMat = new THREE.PointsMaterial({ size: 1.5, vertexColors: true, transparent: true, opacity: 0.8 });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 6. ASTEROID BELT PARTICLES
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

    // 7. PLANETS & SUN
    planetsRef.current = [];

    solarObjects.forEach((obj) => {
      const isSun = obj.id === 'sol';
      const geometry = new THREE.SphereGeometry(obj.size, isSun ? 32 : 24, isSun ? 32 : 24);
      let material: THREE.Material;

      if (isSun) {
        material = new THREE.MeshBasicMaterial({ color: new THREE.Color(obj.color) });
      } else {
        material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(obj.color),
          roughness: 0.5,
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
            opacity: 0.75
          });
          const ring = new THREE.Mesh(ringG, ringM);
          ring.rotation.x = Math.PI / 2.2;
          mesh.add(ring);
        }

        // Orbit Line
        const orbitGeo = new THREE.RingGeometry(obj.orbitRadius - 0.2, obj.orbitRadius + 0.2, 90);
        const orbitMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.12 });
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
    });

    // 8. RAYCASTER FOR CLICK DETECTION
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

    // 9. ANIMATION LOOP
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

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

    // 10. RESIZE HANDLER
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
  }, [handleFocusObject, speed, solarObjects]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[550px] bg-[#060811] overflow-hidden rounded-2xl border border-white/10 shadow-2xl transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 h-screen rounded-none' : ''
      }`}
    >
      {/* Top Controls Bar */}
      <div className="absolute top-4 left-4 right-4 z-30 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Quick Jump Selector */}
        <div className="pointer-events-auto">
          <select
            onChange={(e) => {
              const obj = solarObjects.find((o) => o.id === e.target.value);
              if (obj) handleFocusObject(obj);
            }}
            defaultValue=""
            className="px-3.5 py-2 bg-[#0d1117]/80 backdrop-blur-xl border border-white/10 rounded-2xl text-xs text-white shadow-xl outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="" disabled>
              🪐 Seleccionar planeta...
            </option>
            {solarObjects.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Speed Toggle */}
          <button
            onClick={() => setSpeed(speed === 1 ? 3 : speed === 3 ? 0 : 1)}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#0d1117]/80 backdrop-blur-xl border border-white/10 rounded-2xl text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 shadow-xl transition-colors"
            title="Velocidad de simulación"
          >
            <FiZap className="w-3.5 h-3.5 text-amber-400" />
            <span>{speed === 0 ? 'Pausado' : `${speed}x`}</span>
          </button>

          {/* Reset Camera */}
          <button
            onClick={handleResetCamera}
            className="p-2.5 bg-[#0d1117]/80 backdrop-blur-xl border border-white/10 rounded-2xl text-white/80 hover:text-white hover:bg-white/10 shadow-xl transition-colors"
            title="Restablecer vista"
          >
            <FiRotateCw className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2.5 bg-[#0d1117]/80 backdrop-blur-xl border border-white/10 rounded-2xl text-white/80 hover:text-white hover:bg-white/10 shadow-xl transition-colors"
            title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          >
            {isFullscreen ? <FiMinimize className="w-3.5 h-3.5" /> : <FiMaximize className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Info Drawer */}
      <UniverseDrawer
        selectedObject={selectedObject}
        onClose={() => setSelectedObject(null)}
        onFocus={handleFocusObject}
      />

      {/* Subtle Bottom Hint */}
      <div className="absolute bottom-4 left-6 z-20 pointer-events-none text-[11px] text-white/50 bg-[#0d1117]/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span>Haz clic en el Sol o cualquier planeta para enfocarlo e inspeccionarlo.</span>
      </div>
    </div>
  );
}
