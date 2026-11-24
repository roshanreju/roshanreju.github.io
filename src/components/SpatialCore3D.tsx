import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface SpatialCore3DProps {
  scrollProgress: number; // 0 to 1
  pulseTrigger: number; // increments when user triggers a 3D breach/pulse
}

export default function SpatialCore3D({ scrollProgress, pulseTrigger }: SpatialCore3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(scrollProgress);
  const pulseEnergyRef = useRef(0);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    if (pulseTrigger > 0) {
      pulseEnergyRef.current = 1.0;
    }
  }, [pulseTrigger]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050507, 0.048);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    // ── MINIMAL STUDIO LIGHTING (Obsidian + Surgical Crimson) ──
    const ambient = new THREE.AmbientLight(0x181416, 1.3);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(5, 6, 5);
    scene.add(keyLight);

    const crimsonKey = new THREE.PointLight(0xef4444, 24, 18);
    crimsonKey.position.set(-3.5, 2.2, 3.8);
    scene.add(crimsonKey);

    const rimLight = new THREE.PointLight(0xdc2626, 18, 16);
    rimLight.position.set(3.8, -2.5, -3.5);
    scene.add(rimLight);

    const coreGlowLight = new THREE.PointLight(0xff2a3c, 10, 8);
    coreGlowLight.position.set(0, 0, 0);
    scene.add(coreGlowLight);

    // ── MATERIALS ──
    const obsidianMat = new THREE.MeshStandardMaterial({
      color: 0x0b0b0f,
      metalness: 0.92,
      roughness: 0.18,
    });

    const brushedTitaniumMat = new THREE.MeshStandardMaterial({
      color: 0x1c1c24,
      metalness: 0.95,
      roughness: 0.24,
    });

    const crimsonMetalMat = new THREE.MeshStandardMaterial({
      color: 0xb91c1c,
      metalness: 0.85,
      roughness: 0.2,
      emissive: 0x450606,
      emissiveIntensity: 0.45,
    });

    const coreEmissiveMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xdc2626,
      emissiveIntensity: 1.6,
      metalness: 0.3,
      roughness: 0.15,
    });

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      wireframe: true,
      transparent: true,
      opacity: 0.24,
    });

    const softRingMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.32,
    });

    // ── SCULPTURE ROOT: OBSIDIAN GYROSCOPIC CORE ──
    const coreRoot = new THREE.Group();
    scene.add(coreRoot);

    // 1. Inner Glowing Crimson Crystal
    const innerCrystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.56, 0), coreEmissiveMat);
    coreRoot.add(innerCrystal);

    // 2. Sculpted Obsidian Split-Shell (8 Floating Octant Armor Shards that explode on scroll!)
    const shellShards: { mesh: THREE.Mesh; dir: THREE.Vector3; baseRot: THREE.Euler }[] = [];
    const shardOffsets: [number, number, number][] = [
      [1, 1, 1],
      [-1, 1, 1],
      [1, -1, 1],
      [-1, -1, 1],
      [1, 1, -1],
      [-1, 1, -1],
      [1, -1, -1],
      [-1, -1, -1],
    ];

    const shardGeo = new THREE.TetrahedronGeometry(0.56, 1);
    shardOffsets.forEach(([x, y, z], idx) => {
      const dir = new THREE.Vector3(x, y, z).normalize();
      const mesh = new THREE.Mesh(shardGeo, idx % 3 === 0 ? crimsonMetalMat : obsidianMat);
      mesh.position.copy(dir).multiplyScalar(0.58);
      mesh.lookAt(dir.clone().multiplyScalar(2));
      coreRoot.add(mesh);
      shellShards.push({ mesh, dir, baseRot: mesh.rotation.clone() });
    });

    // 3. Precision Wireframe Geodesic Cage
    const innerCage = new THREE.Mesh(new THREE.IcosahedronGeometry(1.22, 1), wireMat);
    coreRoot.add(innerCage);

    // 4. Three Precision-Machined Gyroscopic Gimbal Rings
    const ringGroupA = new THREE.Group();
    const gimbalA = new THREE.Mesh(
      new THREE.TorusGeometry(1.68, 0.032, 20, 120),
      brushedTitaniumMat
    );
    ringGroupA.add(gimbalA);
    // Tiny glowing crimson telemetry nodes on Ring A
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2;
      const pip = new THREE.Mesh(new THREE.SphereGeometry(0.048, 12, 12), coreEmissiveMat);
      pip.position.set(Math.cos(a) * 1.68, Math.sin(a) * 1.68, 0);
      ringGroupA.add(pip);
    }
    coreRoot.add(ringGroupA);

    const ringGroupB = new THREE.Group();
    const gimbalB = new THREE.Mesh(
      new THREE.TorusGeometry(2.08, 0.022, 16, 120),
      crimsonMetalMat
    );
    ringGroupB.add(gimbalB);
    coreRoot.add(ringGroupB);

    const ringGroupC = new THREE.Group();
    const gimbalC = new THREE.Mesh(new THREE.TorusGeometry(2.48, 0.008, 12, 140), softRingMat);
    ringGroupC.add(gimbalC);
    coreRoot.add(ringGroupC);

    // ── QUIET FLOATING DUST FIELD ──
    const particleCount = 150;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xef4444,
      size: 0.035,
      transparent: true,
      opacity: 0.45,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // ── POINTER PARALLAX ──
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // ── SMOOTH ANIMATION & SCROLL CHOREOGRAPHY ──
    const startTime = performance.now();
    let smoothScroll = 0;
    let frameId = 0;

    const animate = () => {
      frameId = window.requestAnimationFrame(animate);
      const t = (performance.now() - startTime) / 1000;

      // Decay breach/pulse energy smoothly
      pulseEnergyRef.current *= 0.965;
      const pulse = pulseEnergyRef.current;

      // Smoothly interpolate scroll & pointer
      smoothScroll += (scrollRef.current - smoothScroll) * 0.06;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      const isWide = window.innerWidth >= 1024;

      // Subtle spatial lateral drift as user scrolls through chapters
      // Hero (0): right side | About (0.25): left | Experience (0.5): right | Work (0.75): left | Contact (1): centered subtle
      const horizontalWave = isWide ? Math.cos(smoothScroll * Math.PI * 2.5) * 2.15 : 0;
      const targetX = horizontalWave * (1 - smoothScroll * 0.25);
      const targetY = Math.sin(t * 0.9) * 0.14 - (smoothScroll - 0.5) * 0.4;
      const targetZ = -0.3 - Math.sin(smoothScroll * Math.PI) * 0.65;

      coreRoot.position.x += (targetX - coreRoot.position.x) * 0.05;
      coreRoot.position.y += (targetY - coreRoot.position.y) * 0.06;
      coreRoot.position.z += (targetZ - coreRoot.position.z) * 0.05;

      coreRoot.rotation.y = t * 0.18 + smoothScroll * Math.PI * 1.4 + mouse.x * 0.45;
      coreRoot.rotation.x = mouse.y * 0.28 + Math.sin(smoothScroll * Math.PI) * 0.25;

      // Exploded blueprint effect peaks in the middle chapters + on pulse!
      const explodeFactor = Math.sin(smoothScroll * Math.PI) * 0.58 + pulse * 0.72;
      shellShards.forEach((item, idx) => {
        const radius = 0.58 + explodeFactor;
        item.mesh.position.copy(item.dir).multiplyScalar(radius);
        item.mesh.rotation.x = item.baseRot.x + explodeFactor * 0.7 + Math.sin(t + idx) * 0.06;
        item.mesh.rotation.y = item.baseRot.y + explodeFactor * 0.9;
      });

      // Inner crystal & cage motion
      const speedBoost = 1 + pulse * 3.5;
      innerCrystal.rotation.y = -t * 0.9 * speedBoost;
      innerCrystal.rotation.x = t * 0.6 * speedBoost;
      const breath = 0.95 + Math.sin(t * 2.4) * 0.08 + pulse * 0.28;
      innerCrystal.scale.setScalar(breath);

      coreEmissiveMat.emissiveIntensity = 1.45 + Math.sin(t * 2.4) * 0.25 + pulse * 2.4;
      coreGlowLight.intensity = 9 + Math.sin(t * 2.4) * 2 + pulse * 16;

      innerCage.rotation.y = t * 0.22 * speedBoost;
      innerCage.rotation.z = -t * 0.14;
      const cageScale = 1 + explodeFactor * 0.45;
      innerCage.scale.setScalar(cageScale);

      // Precision gyroscopic gimbal rings
      ringGroupA.rotation.x = Math.PI / 3 + t * 0.28 * speedBoost;
      ringGroupA.rotation.y = t * 0.22 * speedBoost + smoothScroll * 2.2;

      ringGroupB.rotation.x = -Math.PI / 4 + t * 0.18 * speedBoost;
      ringGroupB.rotation.z = -t * 0.26 * speedBoost;
      ringGroupB.scale.setScalar(1 + explodeFactor * 0.15);

      ringGroupC.rotation.y = Math.PI / 2.2 + t * 0.12 * speedBoost;
      ringGroupC.rotation.x = Math.sin(t * 0.3) * 0.35 + smoothScroll * 1.2;

      // Subtle dust parallax
      dust.rotation.y = t * 0.018 + mouse.x * 0.08;
      dust.rotation.x = mouse.y * 0.05;

      // Subtle camera parallax
      camera.position.x += (mouse.x * 0.35 - camera.position.x) * 0.04;
      camera.position.y += (mouse.y * 0.22 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (webglFailed) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_70%_40%,rgba(220,38,38,0.18),transparent_60%)]"
      />
    );
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
