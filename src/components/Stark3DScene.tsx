import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ChapterId } from '../engine/storyEngine';

interface Stark3DSceneProps {
  chapter: ChapterId;
  overdrive: boolean;
}

interface CameraPreset {
  pos: [number, number, number];
  lookAt: [number, number, number];
  suitX: number;
  suitY: number;
}

const CAMERA_PRESETS: Record<ChapterId, CameraPreset> = {
  boot: { pos: [0, 0.45, 6.2], lookAt: [0, 0.25, 0], suitX: 0, suitY: 0.1 },
  origin: { pos: [-2.1, 0.8, 5.1], lookAt: [-0.8, 0.55, 0], suitX: -1.65, suitY: 0.2 },
  missions: { pos: [2.4, 0.5, 5.8], lookAt: [0.6, 0.2, 0], suitX: 1.7, suitY: 0.05 },
  lab: { pos: [0.4, 2.35, 5.7], lookAt: [0, 0.15, 0], suitX: -1.5, suitY: 0.15 },
  vault: { pos: [0, -0.35, 5.4], lookAt: [0, 0.45, 0], suitX: 0, suitY: 0.25 },
};

export default function Stark3DScene({ chapter, overdrive }: Stark3DSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chapterRef = useRef<ChapterId>(chapter);
  const overdriveRef = useRef<boolean>(overdrive);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    chapterRef.current = chapter;
  }, [chapter]);

  useEffect(() => {
    overdriveRef.current = overdrive;
  }, [overdrive]);

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
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050507, 0.055);

    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 100);
    camera.position.set(0, 0.45, 6.2);

    // ── LIGHTING (Stark Dramatic Black/Crimson/Gold Studio) ──
    const ambient = new THREE.AmbientLight(0x1f1417, 1.4);
    scene.add(ambient);

    const crimsonKey = new THREE.PointLight(0xef4444, 28, 22);
    crimsonKey.position.set(3.5, 3.2, 4.5);
    scene.add(crimsonKey);

    const goldRim = new THREE.PointLight(0xf59e0b, 18, 20);
    goldRim.position.set(-4, 2.5, 2.5);
    scene.add(goldRim);

    const backRedRim = new THREE.PointLight(0xdc2626, 22, 18);
    backRedRim.position.set(0, 1.5, -4.5);
    scene.add(backRedRim);

    const reactorLight = new THREE.PointLight(0x38bdf8, 8, 8);
    reactorLight.position.set(0, 0.35, 1.4);
    scene.add(reactorLight);

    // ── MATERIALS ──
    const obsidianArmorMat = new THREE.MeshStandardMaterial({
      color: 0x0d0d13,
      metalness: 0.88,
      roughness: 0.28,
    });

    const crimsonArmorMat = new THREE.MeshStandardMaterial({
      color: 0xb91c1c,
      metalness: 0.82,
      roughness: 0.22,
      emissive: 0x3b0505,
      emissiveIntensity: 0.35,
    });

    const starkGoldMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.92,
      roughness: 0.2,
      emissive: 0x451a03,
      emissiveIntensity: 0.3,
    });

    const eyeGlowMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
    });

    const reactorCoreMat = new THREE.MeshBasicMaterial({
      color: 0xff3b3b,
    });

    const holoRedWireMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });

    const holoGoldWireMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    });

    // ── BUILD 3D CHARACTER: MARK-R4 IRON-HACKER SENTINEL ──
    const suitRoot = new THREE.Group();
    scene.add(suitRoot);

    // 1. Head / Helmet Group (tracks cursor!)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.52, 0);
    suitRoot.add(headGroup);

    // Cranium dome (crimson armor)
    const craniumGeo = new THREE.OctahedronGeometry(0.56, 2);
    craniumGeo.scale(0.88, 1.08, 0.96);
    const cranium = new THREE.Mesh(craniumGeo, crimsonArmorMat);
    headGroup.add(cranium);

    // Sleek Iron-Man style gold faceplate
    const faceplateGeo = new THREE.CylinderGeometry(0.37, 0.27, 0.72, 6);
    const faceplate = new THREE.Mesh(faceplateGeo, starkGoldMat);
    faceplate.position.set(0, -0.04, 0.24);
    faceplate.scale.set(1, 1, 0.55);
    headGroup.add(faceplate);

    // Forehead crimson crest plate
    const crest = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 0.16), crimsonArmorMat);
    crest.position.set(0, 0.32, 0.41);
    headGroup.add(crest);

    // Jaw / chin guard (obsidian)
    const chin = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.14, 0.22), obsidianArmorMat);
    chin.position.set(0, -0.34, 0.32);
    headGroup.add(chin);

    // Angular Glowing Iron Man Eye Slits
    const eyeGeo = new THREE.BoxGeometry(0.17, 0.045, 0.05);
    const leftEye = new THREE.Mesh(eyeGeo, eyeGlowMat);
    leftEye.position.set(-0.14, 0.07, 0.46);
    leftEye.rotation.z = -0.14;
    headGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeGlowMat);
    rightEye.position.set(0.14, 0.07, 0.46);
    rightEye.rotation.z = 0.14;
    headGroup.add(rightEye);

    // Side ear sensor pods
    const earGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.1, 8);
    earGeo.rotateZ(Math.PI / 2);
    const leftEar = new THREE.Mesh(earGeo, obsidianArmorMat);
    leftEar.position.set(-0.48, 0, 0.02);
    headGroup.add(leftEar);
    const rightEar = new THREE.Mesh(earGeo, obsidianArmorMat);
    rightEar.position.set(0.48, 0, 0.02);
    headGroup.add(rightEar);

    // 2. Neck & Armored Torso
    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.25, 0.3, 10),
      obsidianArmorMat
    );
    neck.position.set(0, 0.96, 0);
    suitRoot.add(neck);

    // Upper chest plate (crimson)
    const chestGeo = new THREE.CylinderGeometry(0.76, 0.52, 1.05, 8);
    chestGeo.scale(1.12, 1, 0.68);
    const chest = new THREE.Mesh(chestGeo, crimsonArmorMat);
    chest.position.set(0, 0.35, 0);
    suitRoot.add(chest);

    // Obsidian tactical collar & sternum armor trim
    const sternumTrim = new THREE.Mesh(
      new THREE.BoxGeometry(1.12, 0.32, 0.72),
      obsidianArmorMat
    );
    sternumTrim.position.set(0, 0.68, 0.05);
    suitRoot.add(sternumTrim);

    // Lower abdomen / core armor
    const abs = new THREE.Mesh(
      new THREE.CylinderGeometry(0.46, 0.38, 0.62, 8),
      obsidianArmorMat
    );
    abs.scale.set(1.05, 1, 0.66);
    abs.position.set(0, -0.42, 0);
    suitRoot.add(abs);

    // Gold abdominal ribs
    for (let i = 0; i < 3; i++) {
      const rib = new THREE.Mesh(new THREE.BoxGeometry(0.56 - i * 0.06, 0.07, 0.48), starkGoldMat);
      rib.position.set(0, -0.22 - i * 0.14, 0.08);
      suitRoot.add(rib);
    }

    // 3. 3D ARC REACTOR (Chest Centerpiece!)
    const reactorGroup = new THREE.Group();
    reactorGroup.position.set(0, 0.36, 0.52);
    suitRoot.add(reactorGroup);

    const reactorBezel = new THREE.Mesh(
      new THREE.TorusGeometry(0.24, 0.042, 14, 32),
      starkGoldMat
    );
    reactorGroup.add(reactorBezel);

    const reactorCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.14, 1), reactorCoreMat);
    reactorGroup.add(reactorCore);

    const reactorInnerRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.18, 0.015, 10, 24),
      new THREE.MeshBasicMaterial({ color: 0xfef08a })
    );
    reactorGroup.add(reactorInnerRing);

    // 4. Floating Armored Shoulders & Repulsor Arms
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-1.08, 0.55, 0);
    suitRoot.add(leftArmGroup);

    const pauldronGeo = new THREE.DodecahedronGeometry(0.36, 0);
    pauldronGeo.scale(1.15, 0.85, 0.95);
    const leftPauldron = new THREE.Mesh(pauldronGeo, crimsonArmorMat);
    leftArmGroup.add(leftPauldron);

    const leftBicep = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.14, 0.68, 8),
      obsidianArmorMat
    );
    leftBicep.position.set(-0.1, -0.5, 0.05);
    leftBicep.rotation.z = 0.12;
    leftArmGroup.add(leftBicep);

    const leftGauntlet = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.13, 0.62, 8),
      crimsonArmorMat
    );
    leftGauntlet.position.set(-0.14, -1.05, 0.24);
    leftGauntlet.rotation.x = -0.35;
    leftArmGroup.add(leftGauntlet);

    const leftRepulsor = new THREE.Mesh(new THREE.SphereGeometry(0.085, 12, 12), reactorCoreMat);
    leftRepulsor.position.set(-0.14, -1.34, 0.36);
    leftArmGroup.add(leftRepulsor);

    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(1.08, 0.55, 0);
    suitRoot.add(rightArmGroup);

    const rightPauldron = new THREE.Mesh(pauldronGeo, crimsonArmorMat);
    rightArmGroup.add(rightPauldron);

    const rightBicep = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.14, 0.68, 8),
      obsidianArmorMat
    );
    rightBicep.position.set(0.1, -0.5, 0.05);
    rightBicep.rotation.z = -0.12;
    rightArmGroup.add(rightBicep);

    const rightGauntlet = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.13, 0.62, 8),
      crimsonArmorMat
    );
    rightGauntlet.position.set(0.14, -1.05, 0.24);
    rightGauntlet.rotation.x = -0.35;
    rightArmGroup.add(rightGauntlet);

    const rightRepulsor = new THREE.Mesh(new THREE.SphereGeometry(0.085, 12, 12), reactorCoreMat);
    rightRepulsor.position.set(0.14, -1.34, 0.36);
    rightArmGroup.add(rightRepulsor);

    // ── HOLOGRAPHIC STARK HUD RINGS AROUND SUIT ──
    const holoGroup = new THREE.Group();
    holoGroup.position.set(0, 0.35, 0);
    suitRoot.add(holoGroup);

    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(2.15, 0.014, 8, 96),
      new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.45 })
    );
    ring1.rotation.x = Math.PI / 2.25;
    holoGroup.add(ring1);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(2.55, 0.01, 8, 96),
      new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.3 })
    );
    ring2.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 5;
    holoGroup.add(ring2);

    const ring3 = new THREE.Mesh(
      new THREE.TorusGeometry(1.72, 0.012, 8, 64),
      new THREE.MeshBasicMaterial({ color: 0xdc2626, transparent: true, opacity: 0.35 })
    );
    ring3.rotation.y = Math.PI / 2.5;
    holoGroup.add(ring3);

    // Outer subtle wireframe dome
    const outerDome = new THREE.Mesh(new THREE.IcosahedronGeometry(3.4, 1), holoRedWireMat);
    holoGroup.add(outerDome);

    // 4 Orbiting Holographic Data Nodes (representing the 4 chapters)
    const satellites: THREE.Mesh[] = [];
    for (let i = 0; i < 4; i++) {
      const sat = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.14, 0),
        i % 2 === 0 ? holoGoldWireMat : holoRedWireMat
      );
      holoGroup.add(sat);
      satellites.push(sat);
    }

    // ── CYBER FLOOR GRID ──
    const gridHelper = new THREE.GridHelper(32, 32, 0xdc2626, 0x26090b);
    gridHelper.position.y = -2.1;
    scene.add(gridHelper);

    // ── FLOATING 3D DATA EMBERS (PARTICLES) ──
    const particleCount = 320;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const colorRed = new THREE.Color(0xef4444);
    const colorGold = new THREE.Color(0xf59e0b);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14 - 1;
      const c = Math.random() > 0.25 ? colorRed : colorGold;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ── MOUSE INTERACTION ──
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handlePointerMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // ── ANIMATION LOOP ──
    const startTime = performance.now();
    const targetCamPos = new THREE.Vector3();
    const currentLookAt = new THREE.Vector3(0, 0.25, 0);
    const targetLookAt = new THREE.Vector3();
    let frameId = 0;

    const animate = () => {
      frameId = window.requestAnimationFrame(animate);
      const t = (performance.now() - startTime) / 1000;
      const preset = CAMERA_PRESETS[chapterRef.current];
      const isOverdrive = overdriveRef.current;
      const speed = isOverdrive ? 2.6 : 1;

      // Smooth mouse easing
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      // Responsive suit horizontal offset (keep centered on narrow screens)
      const isWide = window.innerWidth >= 1024;
      const desiredSuitX = isWide ? preset.suitX : 0;

      // Levitating Iron-Hacker Character motion
      suitRoot.position.x += (desiredSuitX - suitRoot.position.x) * 0.05;
      suitRoot.position.y +=
        (preset.suitY + Math.sin(t * 1.5) * 0.14 - suitRoot.position.y) * 0.08;
      suitRoot.rotation.y += (mouse.x * 0.35 - suitRoot.rotation.y) * 0.05;

      // Head tracks cursor smoothly
      headGroup.rotation.y = mouse.x * 0.45;
      headGroup.rotation.x = -mouse.y * 0.22;

      // Subtle arm hover
      leftArmGroup.position.y = 0.55 + Math.sin(t * 1.8 + 0.6) * 0.05;
      rightArmGroup.position.y = 0.55 + Math.sin(t * 1.8 + 2.2) * 0.05;

      // Arc Reactor & Eye pulse
      reactorCore.rotation.y = t * 1.8 * speed;
      reactorCore.rotation.x = t * 1.1 * speed;
      reactorInnerRing.rotation.z = -t * 2.2 * speed;
      const pulse = 0.92 + Math.sin(t * 4 * speed) * 0.14;
      reactorCore.scale.setScalar(pulse);
      reactorCoreMat.color.setHex(isOverdrive ? 0xfef08a : 0xff3b3b);
      reactorLight.color.setHex(isOverdrive ? 0xf59e0b : 0xef4444);
      reactorLight.intensity = isOverdrive ? 18 : 10;

      // Holographic rings & satellites
      ring1.rotation.z = t * 0.35 * speed;
      ring2.rotation.z = -t * 0.45 * speed;
      ring3.rotation.x = t * 0.3 * speed;
      outerDome.rotation.y = t * 0.08 * speed;
      outerDome.rotation.x = Math.sin(t * 0.15) * 0.15;

      satellites.forEach((sat, idx) => {
        const angle = t * 0.55 * speed + (idx * Math.PI) / 2;
        sat.position.set(
          Math.cos(angle) * 2.35,
          Math.sin(t * 0.9 + idx) * 0.65,
          Math.sin(angle) * 2.35
        );
        sat.rotation.y = t * 1.5;
        sat.rotation.x = t * 1.1;
      });

      // Rising ember particles
      const posAttr = particleGeo.getAttribute('position') as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        let y = posAttr.getY(i) + 0.008 * speed;
        if (y > 5.2) y = -3.5;
        posAttr.setY(i, y);
      }
      posAttr.needsUpdate = true;
      particles.rotation.y = t * 0.03;

      // Smooth cinematic camera flight to active chapter preset
      targetCamPos.set(
        preset.pos[0] + mouse.x * 0.45,
        preset.pos[1] + mouse.y * 0.25,
        preset.pos[2]
      );
      camera.position.lerp(targetCamPos, 0.045);

      targetLookAt.set(
        isWide ? preset.lookAt[0] : 0,
        preset.lookAt[1],
        preset.lookAt[2]
      );
      currentLookAt.lerp(targetLookAt, 0.055);
      camera.lookAt(currentLookAt);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
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
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.22),transparent_62%)]"
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
