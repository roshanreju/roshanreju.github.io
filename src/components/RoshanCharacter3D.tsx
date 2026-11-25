import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface RoshanCharacter3DProps {
  warping: boolean;
}

function createFeatherAlphaTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, size, size);

    const grad = ctx.createRadialGradient(
      size * 0.5,
      size * 0.48,
      size * 0.28,
      size * 0.5,
      size * 0.5,
      size * 0.49
    );
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.68, '#ffffff');
    grad.addColorStop(0.88, '#555555');
    grad.addColorStop(1, '#000000');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

export default function RoshanCharacter3D({ warping }: RoshanCharacter3DProps) {
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
    renderer.toneMappingExposure = 1.08;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050507, 0.04);

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    const applyCameraFraming = (w: number, h: number) => {
      camera.aspect = w / h;
      if (w >= 1024) {
        camera.setViewOffset(w, h, -w * 0.17, 0, w, h);
      } else {
        camera.clearViewOffset();
      }
      camera.updateProjectionMatrix();
    };
    applyCameraFraming(width, height);
    camera.position.set(0, 0.05, 5.4);

    // ── DYNAMIC STUDIO LIGHTING (Reacts to drag & mouse!) ──
    const ambient = new THREE.AmbientLight(0xffffff, 1.35);
    scene.add(ambient);

    const interactiveLight = new THREE.PointLight(0xffffff, 8, 12);
    interactiveLight.position.set(1.8, 1.6, 3.2);
    scene.add(interactiveLight);

    const crimsonRimLight = new THREE.PointLight(0xef4444, 16, 12);
    crimsonRimLight.position.set(-2.6, 1.2, 2.2);
    scene.add(crimsonRimLight);

    // ── 3D CONTOURED RELIEF PORTRAIT ROOT ──
    const bustRoot = new THREE.Group();
    scene.add(bustRoot);

    const loader = new THREE.TextureLoader();
    const portraitTex = loader.load('/roshan-3d.jpg');
    portraitTex.colorSpace = THREE.SRGBColorSpace;
    portraitTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const alphaTex = createFeatherAlphaTexture();

    // High-resolution mesh sculpted into a gentle organic 3D bust dome
    const planeGeo = new THREE.PlaneGeometry(3.45, 3.45, 84, 84);
    const posAttr = planeGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      // Smooth protruding 3D volume for face/head + broader subtle curve for shoulders
      const headDome = Math.exp(-((x / 0.72) ** 2 + ((y - 0.18) / 0.92) ** 2)) * 0.56;
      const shoulderDome = Math.exp(-((x / 1.45) ** 2 + ((y + 1.05) / 0.78) ** 2)) * 0.24;
      const z = headDome + shoulderDome;
      posAttr.setZ(i, z);
    }
    planeGeo.computeVertexNormals();

    const portraitMat = new THREE.MeshStandardMaterial({
      map: portraitTex,
      alphaMap: alphaTex,
      transparent: true,
      roughness: 0.42,
      metalness: 0.08,
      depthWrite: true,
    });

    const portraitMesh = new THREE.Mesh(planeGeo, portraitMat);
    bustRoot.add(portraitMesh);

    // ── REAL 3D SPATIAL DEPTH RINGS (Behind & framing the 3D portrait) ──
    const ringGroup = new THREE.Group();
    ringGroup.position.set(0, 0.02, -0.35);
    bustRoot.add(ringGroup);

    const outerRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.88, 0.012, 12, 120),
      new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.42 })
    );
    ringGroup.add(outerRing);

    const tiltedRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.12, 0.008, 10, 120),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.14 })
    );
    tiltedRing.rotation.x = 0.55;
    tiltedRing.rotation.y = 0.35;
    ringGroup.add(tiltedRing);

    // Subtle 3D orbital pips moving in front & behind for depth parallax
    const pipMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const pips: THREE.Mesh[] = [];
    for (let i = 0; i < 4; i++) {
      const pip = new THREE.Mesh(new THREE.SphereGeometry(0.036, 12, 12), pipMat);
      bustRoot.add(pip);
      pips.push(pip);
    }

    // Subtle floating 3D crimson embers in foreground & background
    const dustCount = 110;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 11;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dust = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({ color: 0xef4444, size: 0.032, transparent: true, opacity: 0.45 })
    );
    scene.add(dust);

    // ── SMOOTH INTERACTIVE DRAG-TO-ROTATE + CURSOR GAZE PARALLAX ──
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const drag = { active: false, startX: 0, startY: 0, rotY: 0, rotX: 0, targetRotY: 0, targetRotX: 0 };

    const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

    const onPointerDown = (e: PointerEvent) => {
      drag.active = true;
      drag.startX = e.clientX;
      drag.startY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = -(e.clientY / window.innerHeight) * 2 + 1;

      if (drag.active) {
        const dx = e.clientX - drag.startX;
        const dy = e.clientY - drag.startY;
        drag.startX = e.clientX;
        drag.startY = e.clientY;
        drag.targetRotY = clamp(drag.targetRotY + dx * 0.006, -0.72, 0.72);
        drag.targetRotX = clamp(drag.targetRotX + dy * 0.0045, -0.38, 0.38);
      }
    };

    const onPointerUp = () => {
      drag.active = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      applyCameraFraming(w, h);
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // ── ANIMATION LOOP ──
    const startTime = performance.now();
    let frameId = 0;

    const animate = () => {
      frameId = window.requestAnimationFrame(animate);
      const t = (performance.now() - startTime) / 1000;
      const isWarp = warpingRef.current;

      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;

      // Smoothly ease drag rotation; gently spring back toward cursor gaze when released
      if (!drag.active) {
        drag.targetRotY *= 0.965;
        drag.targetRotX *= 0.965;
      }
      drag.rotY += (drag.targetRotY - drag.rotY) * 0.1;
      drag.rotX += (drag.targetRotX - drag.rotX) * 0.1;

      // Living subtle float + combined drag + cursor parallax rotation
      bustRoot.position.y = Math.sin(t * 1.4) * 0.065;
      const desiredRotY = drag.rotY + pointer.x * 0.24;
      const desiredRotX = drag.rotX - pointer.y * 0.14;
      bustRoot.rotation.y += (desiredRotY - bustRoot.rotation.y) * 0.09;
      bustRoot.rotation.x += (desiredRotX - bustRoot.rotation.x) * 0.09;

      // Dynamic key & crimson light follow cursor across the 3D sculpted surface
      interactiveLight.position.x = 1.6 + pointer.x * 2.2;
      interactiveLight.position.y = 1.4 + pointer.y * 1.6;
      crimsonRimLight.intensity = 15 + Math.sin(t * 2.5) * 3 + (isWarp ? 18 : 0);

      // Orbital rings & 3D parallax pips
      const spin = isWarp ? 3.2 : 1;
      outerRing.rotation.z = t * 0.22 * spin;
      tiltedRing.rotation.z = -t * 0.3 * spin;
      tiltedRing.rotation.y = 0.35 + Math.sin(t * 0.4) * 0.2;

      pips.forEach((pip, idx) => {
        const angle = t * 0.55 * spin + (idx * Math.PI) / 2;
        pip.position.set(
          Math.cos(angle) * 1.95,
          Math.sin(t * 0.8 + idx) * 0.55,
          Math.sin(angle) * 1.15
        );
      });

      // Subtle rising dust
      const attr = dustGeo.getAttribute('position') as THREE.BufferAttribute;
      for (let i = 0; i < dustCount; i++) {
        let y = attr.getY(i) + (isWarp ? 0.05 : 0.004);
        if (y > 4) y = -4;
        attr.setY(i, y);
      }
      attr.needsUpdate = true;

      // Cinematic zoom dive when entering the shell
      if (isWarp) {
        camera.clearViewOffset();
        camera.updateProjectionMatrix();
        camera.position.z += (1.1 - camera.position.z) * 0.11;
      } else {
        camera.position.x += (pointer.x * 0.18 - camera.position.x) * 0.04;
        camera.position.y += (0.05 + pointer.y * 0.12 - camera.position.y) * 0.04;
      }
      camera.lookAt(0, 0.05, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      domEl.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', onResize);
      portraitTex.dispose();
      alphaTex.dispose();
      renderer.dispose();
      if (domEl.parentNode === container) {
        container.removeChild(domEl);
      }
    };
  }, []);

  if (webglFailed) {
    return (
      <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center lg:justify-end lg:pr-24">
        <img
          src="/roshan-3d.jpg"
          alt="Roshan Reju"
          className="h-80 w-80 rounded-full object-cover opacity-90 shadow-[0_0_80px_rgba(220,38,38,0.28)]"
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      title="Drag to tilt & inspect in 3D"
      className="fixed inset-0 z-0 cursor-grab active:cursor-grabbing"
    />
  );
}
