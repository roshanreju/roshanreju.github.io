import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Operative3DProps {
  warping: boolean;
}

export default function Operative3D({ warping }: Operative3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const warpingRef = useRef(warping);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    warpingRef.current = warping;
  }, [warping]);

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
    scene.fog = new THREE.FogExp2(0x050507, 0.052);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.35, 6.4);

    // ── DRAMATIC ARCHITECTURAL STUDIO LIGHTING ──
    const ambient = new THREE.AmbientLight(0x141013, 1.5);
    scene.add(ambient);

    const rimWhite = new THREE.DirectionalLight(0xf4f4f5, 2.0);
    rimWhite.position.set(4.5, 5.5, 4);
    scene.add(rimWhite);

    const crimsonKey = new THREE.PointLight(0xef4444, 26, 18);
    crimsonKey.position.set(-3.2, 2.2, 3.8);
    scene.add(crimsonKey);

    const crimsonBack = new THREE.PointLight(0xdc2626, 22, 16);
    crimsonBack.position.set(0.5, 1.5, -4.2);
    scene.add(crimsonBack);

    const visorLight = new THREE.PointLight(0xff2a3c, 6, 4);
    visorLight.position.set(0, 1.15, 0.9);
    scene.add(visorLight);

    // ── SLEEK OBSIDIAN & CRIMSON MATERIALS ──
    const matteObsidian = new THREE.MeshStandardMaterial({
      color: 0x0b0b10,
      metalness: 0.72,
      roughness: 0.36,
    });

    const carbonArmor = new THREE.MeshStandardMaterial({
      color: 0x15151d,
      metalness: 0.88,
      roughness: 0.22,
    });

    const crimsonTrim = new THREE.MeshStandardMaterial({
      color: 0xb91c1c,
      metalness: 0.85,
      roughness: 0.2,
      emissive: 0x450606,
      emissiveIntensity: 0.5,
    });

    const glowingCrimson = new THREE.MeshStandardMaterial({
      color: 0xff3b47,
      emissive: 0xef4444,
      emissiveIntensity: 2.2,
      roughness: 0.1,
    });

    const wireCrimson = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });

    // ── SCULPTED 3D CYBER-OPERATIVE BUST FIGURE ──
    const figureRoot = new THREE.Group();
    scene.add(figureRoot);

    // Head & Stealth Hood Group (tracks visitor mouse!)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.18, 0);
    figureRoot.add(headGroup);

    // Outer sleek stealth hood shell
    const hoodGeo = new THREE.IcosahedronGeometry(0.66, 2);
    hoodGeo.scale(0.94, 1.12, 1.02);
    const hood = new THREE.Mesh(hoodGeo, matteObsidian);
    headGroup.add(hood);

    // Subtle crimson seam crest along top of hood
    const hoodCrest = new THREE.Mesh(
      new THREE.TorusGeometry(0.65, 0.014, 10, 48, Math.PI * 0.8),
      crimsonTrim
    );
    hoodCrest.rotation.y = Math.PI / 2;
    hoodCrest.rotation.z = 0.25;
    headGroup.add(hoodCrest);

    // Sculpted dark carbon mask / face shield
    const maskGeo = new THREE.CylinderGeometry(0.42, 0.3, 0.78, 8);
    maskGeo.scale(0.98, 1, 0.65);
    const mask = new THREE.Mesh(maskGeo, carbonArmor);
    mask.position.set(0, -0.05, 0.28);
    headGroup.add(mask);

    // Sleek single horizontal glowing crimson optical visor slit
    const visorBar = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.055, 0.08), glowingCrimson);
    visorBar.position.set(0, 0.06, 0.54);
    headGroup.add(visorBar);

    // Subtle dark visor bezel
    const visorBezel = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.12, 0.06), matteObsidian);
    visorBezel.position.set(0, 0.06, 0.51);
    headGroup.add(visorBezel);

    // Side acoustic / comms pods
    const podGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.12, 12);
    podGeo.rotateZ(Math.PI / 2);
    const leftPod = new THREE.Mesh(podGeo, crimsonTrim);
    leftPod.position.set(-0.58, 0.02, 0.04);
    headGroup.add(leftPod);
    const rightPod = new THREE.Mesh(podGeo, crimsonTrim);
    rightPod.position.set(0.58, 0.02, 0.04);
    headGroup.add(rightPod);

    // Neck & High Tactical Collar
    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.32, 0.36, 12),
      carbonArmor
    );
    neck.position.set(0, 0.45, -0.02);
    figureRoot.add(neck);

    const collar = new THREE.Mesh(
      new THREE.TorusGeometry(0.46, 0.085, 12, 32),
      matteObsidian
    );
    collar.rotation.x = Math.PI / 2.25;
    collar.position.set(0, 0.34, 0.04);
    figureRoot.add(collar);

    // Sculpted Shoulders & Stealthed Jacket Torso
    const torsoGeo = new THREE.CylinderGeometry(0.95, 0.62, 1.38, 10);
    torsoGeo.scale(1.18, 1, 0.58);
    const torso = new THREE.Mesh(torsoGeo, matteObsidian);
    torso.position.set(0, -0.36, -0.02);
    figureRoot.add(torso);

    // Crisp angular shoulder plates
    const shoulderGeo = new THREE.OctahedronGeometry(0.44, 1);
    shoulderGeo.scale(1.25, 0.72, 0.9);
    const leftShoulder = new THREE.Mesh(shoulderGeo, carbonArmor);
    leftShoulder.position.set(-1.02, 0.08, -0.02);
    leftShoulder.rotation.z = 0.22;
    figureRoot.add(leftShoulder);

    const rightShoulder = new THREE.Mesh(shoulderGeo, carbonArmor);
    rightShoulder.position.set(1.02, 0.08, -0.02);
    rightShoulder.rotation.z = -0.22;
    figureRoot.add(rightShoulder);

    // Subtle geometric crimson sternum accent (minimal, architectural)
    const sternumCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.11, 0), glowingCrimson);
    sternumCore.position.set(0, -0.05, 0.56);
    figureRoot.add(sternumCore);

    const sternumFrame = new THREE.Mesh(
      new THREE.TorusGeometry(0.19, 0.018, 12, 32),
      crimsonTrim
    );
    sternumFrame.position.set(0, -0.05, 0.54);
    figureRoot.add(sternumFrame);

    // Minimal Precision Spatial Rings behind the figure
    const haloGroup = new THREE.Group();
    haloGroup.position.set(0, 0.55, -0.65);
    figureRoot.add(haloGroup);

    const haloOuter = new THREE.Mesh(
      new THREE.TorusGeometry(2.15, 0.01, 10, 120),
      new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.35 })
    );
    haloGroup.add(haloOuter);

    const haloInner = new THREE.Mesh(
      new THREE.TorusGeometry(1.62, 0.008, 10, 96),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.14 })
    );
    haloInner.rotation.x = 0.45;
    haloGroup.add(haloInner);

    const outerCage = new THREE.Mesh(new THREE.IcosahedronGeometry(2.85, 1), wireCrimson);
    haloGroup.add(outerCage);

    // Subtle floating embers
    const count = 160;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12 - 1;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const dust = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({ color: 0xef4444, size: 0.036, transparent: true, opacity: 0.5 })
    );
    scene.add(dust);

    // Mouse tracking + optional drag-to-orbit
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: MouseEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    const startTime = performance.now();
    let frameId = 0;

    const animate = () => {
      frameId = window.requestAnimationFrame(animate);
      const t = (performance.now() - startTime) / 1000;
      const isWarp = warpingRef.current;

      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;

      const isWide = window.innerWidth >= 1024;
      const baseSuitX = isWide ? 1.55 : 0;

      // Subtle levitation + mouse gaze tracking
      figureRoot.position.x += ((isWarp ? 0 : baseSuitX) - figureRoot.position.x) * 0.07;
      figureRoot.position.y = Math.sin(t * 1.3) * 0.1 - 0.1;
      figureRoot.rotation.y += (mouse.x * 0.25 - figureRoot.rotation.y) * 0.05;

      headGroup.rotation.y = mouse.x * 0.45;
      headGroup.rotation.x = -mouse.y * 0.2;

      // Subtle pulse on sternum core & visor
      sternumCore.rotation.y = t * 1.6;
      glowingCrimson.emissiveIntensity = (isWarp ? 4.5 : 2.0) + Math.sin(t * 3) * 0.35;

      haloOuter.rotation.z = t * (isWarp ? 2.4 : 0.22);
      haloInner.rotation.y = -t * (isWarp ? 2.2 : 0.3);
      outerCage.rotation.y = t * (isWarp ? 1.5 : 0.08);
      outerCage.rotation.x = Math.sin(t * 0.2) * 0.15;

      // Rising ember drift
      const attr = dustGeo.getAttribute('position') as THREE.BufferAttribute;
      for (let i = 0; i < count; i++) {
        let y = attr.getY(i) + (isWarp ? 0.06 : 0.005);
        if (y > 5) y = -5;
        attr.setY(i, y);
      }
      attr.needsUpdate = true;

      // Warp zoom camera right into the crimson visor when transitioning into Terminal!
      const targetCamX = isWarp ? 0 : mouse.x * 0.3;
      const targetCamY = isWarp ? 1.12 : 0.35 + mouse.y * 0.18;
      const targetCamZ = isWarp ? 0.85 : 6.4;

      camera.position.x += (targetCamX - camera.position.x) * (isWarp ? 0.1 : 0.05);
      camera.position.y += (targetCamY - camera.position.y) * (isWarp ? 0.1 : 0.05);
      camera.position.z += (targetCamZ - camera.position.z) * (isWarp ? 0.11 : 0.05);
      camera.lookAt(isWarp ? 0 : isWide ? 0.65 : 0, isWarp ? 1.12 : 0.3, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMove);
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
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_68%_45%,rgba(220,38,38,0.2),transparent_58%)]"
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
