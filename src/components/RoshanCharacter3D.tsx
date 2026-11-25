import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface RoshanCharacter3DProps {
  warping: boolean;
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

    const getSize = () => ({
      w: container.clientWidth || window.innerWidth,
      h: container.clientHeight || window.innerHeight,
    });

    const initial = getSize();
    renderer.setSize(initial.w, initial.h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050507, 0.042);

    const camera = new THREE.PerspectiveCamera(36, initial.w / initial.h, 0.1, 100);
    const applyCameraFraming = (w: number, h: number) => {
      camera.aspect = w / h;
      if (window.innerWidth >= 1024) {
        camera.setViewOffset(w, h, -w * 0.17, 0, w, h);
      } else {
        camera.clearViewOffset();
      }
      camera.updateProjectionMatrix();
    };
    applyCameraFraming(initial.w, initial.h);
    camera.position.set(0.28, 0.65, window.innerWidth >= 1024 ? 5.3 : 5.1);

    // ── INTERACTIVE 360° ORBIT CONTROLS ──
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.enableZoom = window.innerWidth >= 1024;
    controls.minDistance = 3.5;
    controls.maxDistance = 7.4;
    controls.minPolarAngle = Math.PI * 0.28;
    controls.maxPolarAngle = Math.PI * 0.68;
    controls.target.set(0, 0.2, 0);
    controls.update();

    let isDragging = false;
    controls.addEventListener('start', () => {
      isDragging = true;
    });
    controls.addEventListener('end', () => {
      isDragging = false;
    });

    // ── STUDIO PORTRAIT LIGHTING ──
    const hemiLight = new THREE.HemisphereLight(0xfff1e6, 0x1a080b, 0.9);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff5eb, 2.05);
    keyLight.position.set(3.5, 5.2, 4.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xd4d4d8, 0.65);
    fillLight.position.set(-4.5, 2.2, 3.0);
    scene.add(fillLight);

    const crimsonRim = new THREE.PointLight(0xef4444, 22, 14);
    crimsonRim.position.set(-2.6, 2.4, -2.8);
    scene.add(crimsonRim);

    const crimsonSideRim = new THREE.PointLight(0xdc2626, 14, 12);
    crimsonSideRim.position.set(2.8, 1.0, -2.4);
    scene.add(crimsonSideRim);

    const screenUnderGlow = new THREE.PointLight(0xef4444, 4.5, 4.5);
    screenUnderGlow.position.set(0, -0.05, 1.05);
    scene.add(screenUnderGlow);

    // ── MATERIALS ──
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xbd8158,
      roughness: 0.56,
      metalness: 0.03,
    });

    const lipMat = new THREE.MeshStandardMaterial({
      color: 0x915744,
      roughness: 0.48,
      metalness: 0.02,
    });

    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x141418,
      roughness: 0.72,
      metalness: 0.06,
    });

    const beardMat = new THREE.MeshStandardMaterial({
      color: 0x18171c,
      roughness: 0.82,
      metalness: 0.04,
    });

    const scleraMat = new THREE.MeshStandardMaterial({
      color: 0xfafafa,
      roughness: 0.18,
    });

    const irisMat = new THREE.MeshStandardMaterial({
      color: 0x1c120d,
      roughness: 0.12,
      metalness: 0.1,
    });

    const catchlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x1d222b,
      roughness: 0.28,
      metalness: 0.45,
    });

    const lensMat = new THREE.MeshPhysicalMaterial({
      color: 0xdbeafe,
      transparent: true,
      opacity: 0.22,
      roughness: 0.05,
      metalness: 0.1,
      reflectivity: 0.9,
      clearcoat: 1.0,
    });

    const hoodieMat = new THREE.MeshStandardMaterial({
      color: 0x111116,
      roughness: 0.78,
      metalness: 0.06,
    });

    const hoodieShadowMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0e,
      roughness: 0.84,
      metalness: 0.05,
    });

    const crimsonAccentMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      roughness: 0.42,
      metalness: 0.2,
      emissive: 0x450606,
      emissiveIntensity: 0.35,
    });

    const laptopBodyMat = new THREE.MeshStandardMaterial({
      color: 0x18181f,
      roughness: 0.24,
      metalness: 0.88,
    });

    const laptopScreenMat = new THREE.MeshStandardMaterial({
      color: 0x18070a,
      emissive: 0xef4444,
      emissiveIntensity: 0.95,
      roughness: 0.15,
    });

    // ── CHARACTER ROOT ──
    const characterRoot = new THREE.Group();
    scene.add(characterRoot);

    // Pedestal
    const pedestalGroup = new THREE.Group();
    pedestalGroup.position.set(0, -1.25, 0);
    characterRoot.add(pedestalGroup);

    const disc = new THREE.Mesh(
      new THREE.CylinderGeometry(1.18, 1.32, 0.14, 48),
      new THREE.MeshStandardMaterial({ color: 0x0c0c11, metalness: 0.85, roughness: 0.25 })
    );
    disc.receiveShadow = true;
    pedestalGroup.add(disc);

    const discRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.22, 0.014, 12, 72),
      new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.7 })
    );
    discRing.rotation.x = Math.PI / 2;
    discRing.position.y = 0.07;
    pedestalGroup.add(discRing);

    // ── TORSO & ARMS ──
    const bodyGroup = new THREE.Group();
    characterRoot.add(bodyGroup);

    const torsoGeo = new THREE.CapsuleGeometry(0.58, 0.72, 16, 28);
    torsoGeo.scale(1.12, 1, 0.74);
    const torso = new THREE.Mesh(torsoGeo, hoodieMat);
    torso.position.set(0, -0.45, 0);
    torso.castShadow = true;
    bodyGroup.add(torso);

    const collarOuter = new THREE.Mesh(
      new THREE.TorusGeometry(0.42, 0.14, 16, 36),
      hoodieMat
    );
    collarOuter.rotation.x = Math.PI / 2.2;
    collarOuter.position.set(0, 0.22, -0.04);
    bodyGroup.add(collarOuter);

    const hoodBack = new THREE.Mesh(
      new THREE.SphereGeometry(0.48, 24, 20, 0, Math.PI * 2, 0, Math.PI * 0.6),
      hoodieShadowMat
    );
    hoodBack.rotation.x = -Math.PI * 0.62;
    hoodBack.scale.set(1.15, 0.7, 0.9);
    hoodBack.position.set(0, 0.16, -0.34);
    bodyGroup.add(hoodBack);

    const hoodInnerAccent = new THREE.Mesh(
      new THREE.TorusGeometry(0.36, 0.032, 12, 32),
      crimsonAccentMat
    );
    hoodInnerAccent.rotation.x = Math.PI / 2.15;
    hoodInnerAccent.position.set(0, 0.25, -0.02);
    bodyGroup.add(hoodInnerAccent);

    for (const side of [-1, 1]) {
      const string = new THREE.Mesh(
        new THREE.CylinderGeometry(0.016, 0.016, 0.42, 10),
        hoodieShadowMat
      );
      string.position.set(side * 0.16, -0.05, 0.43);
      string.rotation.z = side * 0.06;
      bodyGroup.add(string);

      const aglet = new THREE.Mesh(
        new THREE.CylinderGeometry(0.022, 0.022, 0.075, 10),
        crimsonAccentMat
      );
      aglet.position.set(side * 0.175, -0.26, 0.43);
      bodyGroup.add(aglet);
    }

    const buildArm = (side: -1 | 1) => {
      const arm = new THREE.Group();
      arm.position.set(side * 0.66, 0.06, 0.02);

      const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.24, 18, 18), hoodieMat);
      arm.add(shoulder);

      const upperArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 0.44, 12, 18), hoodieMat);
      upperArm.position.set(side * 0.08, -0.32, 0.12);
      upperArm.rotation.z = side * 0.22;
      upperArm.rotation.x = -0.35;
      arm.add(upperArm);

      const forearm = new THREE.Mesh(new THREE.CapsuleGeometry(0.15, 0.36, 12, 18), hoodieMat);
      forearm.position.set(side * -0.08, -0.58, 0.46);
      forearm.rotation.x = Math.PI * 0.44;
      forearm.rotation.z = side * -0.42;
      arm.add(forearm);

      const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.025, 10, 20), crimsonAccentMat);
      cuff.position.set(side * -0.2, -0.61, 0.65);
      cuff.rotation.y = side * 0.4;
      arm.add(cuff);

      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.125, 16, 16), skinMat);
      hand.scale.set(1.05, 0.72, 1.25);
      hand.position.set(side * -0.28, -0.61, 0.77);
      arm.add(hand);

      return arm;
    };

    bodyGroup.add(buildArm(-1));
    bodyGroup.add(buildArm(1));

    // Matte-Black Laptop
    const laptopGroup = new THREE.Group();
    laptopGroup.position.set(0, -0.66, 0.94);
    bodyGroup.add(laptopGroup);

    const laptopBase = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.04, 0.62), laptopBodyMat);
    laptopGroup.add(laptopBase);

    const laptopLidPivot = new THREE.Group();
    laptopLidPivot.position.set(0, 0.02, 0.3);
    laptopLidPivot.rotation.x = -0.32;
    laptopGroup.add(laptopLidPivot);

    const laptopLid = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.58, 0.03), laptopBodyMat);
    laptopLid.position.set(0, 0.29, 0);
    laptopLidPivot.add(laptopLid);

    const lidBadge = new THREE.Mesh(new THREE.OctahedronGeometry(0.065, 0), crimsonAccentMat);
    lidBadge.scale.set(1, 1, 0.3);
    lidBadge.position.set(0, 0.29, 0.022);
    laptopLidPivot.add(lidBadge);

    const laptopScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.86, 0.48), laptopScreenMat);
    laptopScreen.position.set(0, 0.29, -0.018);
    laptopScreen.rotation.y = Math.PI;
    laptopLidPivot.add(laptopScreen);

    // Neck
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.23, 0.34, 20), skinMat);
    neck.position.set(0, 0.36, 0.02);
    bodyGroup.add(neck);

    // ── HEAD GROUP WITH CLEAN UV GROOMED BEARD ──
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.95, 0.03);
    bodyGroup.add(headGroup);

    const headGeo = new THREE.SphereGeometry(0.54, 40, 36);
    const posAttr = headGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < posAttr.count; i++) {
      let x = posAttr.getX(i);
      let y = posAttr.getY(i);
      let z = posAttr.getZ(i);
      y *= 1.12;
      x *= 0.93;
      z *= 0.97;
      if (y < 0) {
        const taper = 1 - Math.abs(y) * 0.24;
        x *= taper;
        z *= 1 - Math.abs(y) * 0.1;
      }
      posAttr.setXYZ(i, x, y, z);
    }
    headGeo.computeVertexNormals();

    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // ── CLEAN 3D GROOMED BEARD (Low cheek line, bare skin around mouth, tidy chin & mustache) ──
    const beardGroup = new THREE.Group();
    headGroup.add(beardGroup);

    // Sleek lower-jaw & chin beard shell sitting cleanly below the cheeks and mouth
    const beardGeo = new THREE.SphereGeometry(
      0.548,
      36,
      24,
      0,
      Math.PI * 2,
      Math.PI * 0.68,
      Math.PI * 0.32
    );
    const bPos = beardGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < bPos.count; i++) {
      let x = bPos.getX(i);
      let y = bPos.getY(i);
      let z = bPos.getZ(i);
      y *= 1.125;
      x *= 0.94;
      z *= 0.985;
      if (y < 0) {
        const taper = 1 - Math.abs(y) * 0.23;
        x *= taper;
        z *= 1 - Math.abs(y) * 0.09;
      }
      // Dip subtly in the front center so bare skin flanks the mouth/soul-patch cleanly
      if (z > 0.15 && Math.abs(x) < 0.26 && y > -0.42) {
        y -= 0.035 * (1 - Math.abs(x) / 0.26);
      }
      // Trim back cleanly under jawline so it doesn't wrap behind the neck
      if (z < -0.1) {
        z = -0.1 + (z + 0.1) * 0.22;
      }
      bPos.setXYZ(i, x, y, z);
    }
    beardGeo.computeVertexNormals();
    const beardJaw = new THREE.Mesh(beardGeo, beardMat);
    beardGroup.add(beardJaw);

    // Tapered sideburn-to-jaw connectors hugging the sides neatly
    for (const side of [-1, 1]) {
      const jawStrip = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.28, 10, 14), beardMat);
      jawStrip.position.set(side * 0.41, -0.15, 0.15);
      jawStrip.rotation.z = side * 0.32;
      jawStrip.rotation.x = 0.26;
      beardGroup.add(jawStrip);

      const sideburn = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.18, 10, 12), beardMat);
      sideburn.position.set(side * 0.45, 0.04, 0.06);
      sideburn.rotation.z = side * -0.06;
      beardGroup.add(sideburn);
    }

    // Clean curved mustache framing the upper lip
    for (const side of [-1, 1]) {
      const stache = new THREE.Mesh(new THREE.CapsuleGeometry(0.026, 0.12, 10, 14), beardMat);
      stache.position.set(side * 0.08, -0.205, 0.486);
      stache.rotation.z = Math.PI / 2 - side * 0.26;
      stache.rotation.y = side * -0.22;
      beardGroup.add(stache);
    }

    // Subtle warm lip line & small neat rounded soul patch
    const mouth = new THREE.Mesh(new THREE.CapsuleGeometry(0.02, 0.13, 8, 12), lipMat);
    mouth.rotation.z = Math.PI / 2;
    mouth.position.set(0, -0.262, 0.48);
    headGroup.add(mouth);

    const soulPatch = new THREE.Mesh(new THREE.SphereGeometry(0.038, 12, 12), beardMat);
    soulPatch.scale.set(0.9, 1.35, 0.55);
    soulPatch.position.set(0, -0.335, 0.466);
    beardGroup.add(soulPatch);

    // Ears
    for (const side of [-1, 1]) {
      const ear = new THREE.Mesh(new THREE.SphereGeometry(0.115, 16, 16), skinMat);
      ear.scale.set(0.55, 1.18, 0.85);
      ear.position.set(side * 0.5, -0.03, -0.02);
      headGroup.add(ear);
    }

    // Nose
    const noseBridge = new THREE.Mesh(new THREE.CapsuleGeometry(0.048, 0.13, 10, 14), skinMat);
    noseBridge.position.set(0, -0.015, 0.505);
    noseBridge.rotation.x = -0.18;
    headGroup.add(noseBridge);

    const noseTip = new THREE.Mesh(new THREE.SphereGeometry(0.064, 14, 14), skinMat);
    noseTip.scale.set(1.12, 0.82, 0.92);
    noseTip.position.set(0, -0.105, 0.535);
    headGroup.add(noseTip);

    // Eyes with blinking & pupil gaze
    const leftEyeGroup = new THREE.Group();
    leftEyeGroup.position.set(-0.18, 0.07, 0.45);
    headGroup.add(leftEyeGroup);

    const rightEyeGroup = new THREE.Group();
    rightEyeGroup.position.set(0.18, 0.07, 0.45);
    headGroup.add(rightEyeGroup);

    const pupilGroups: THREE.Group[] = [];
    const eyelidMeshes: THREE.Mesh[] = [];

    [leftEyeGroup, rightEyeGroup].forEach((eyeGrp) => {
      const sclera = new THREE.Mesh(new THREE.SphereGeometry(0.085, 18, 18), scleraMat);
      sclera.scale.set(1.12, 0.92, 0.65);
      eyeGrp.add(sclera);

      const pupilGrp = new THREE.Group();
      const iris = new THREE.Mesh(new THREE.SphereGeometry(0.048, 16, 16), irisMat);
      iris.scale.set(1, 1, 0.55);
      iris.position.set(0, 0, 0.042);
      pupilGrp.add(iris);

      const catchlight = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), catchlightMat);
      catchlight.position.set(0.018, 0.02, 0.068);
      pupilGrp.add(catchlight);

      eyeGrp.add(pupilGrp);
      pupilGroups.push(pupilGrp);

      const lid = new THREE.Mesh(
        new THREE.SphereGeometry(0.092, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55),
        skinMat
      );
      lid.scale.set(1.15, 0.96, 0.72);
      lid.rotation.x = -Math.PI * 0.48;
      eyeGrp.add(lid);
      eyelidMeshes.push(lid);
    });

    // Eyebrows
    for (const side of [-1, 1]) {
      const brow = new THREE.Mesh(new THREE.CapsuleGeometry(0.028, 0.17, 8, 12), hairMat);
      brow.rotation.z = Math.PI / 2 - side * 0.08;
      brow.position.set(side * 0.18, 0.21, 0.47);
      headGroup.add(brow);
    }

    // Thick Dark Rectangular Glasses
    const glassesGroup = new THREE.Group();
    glassesGroup.position.set(0, 0.07, 0.55);
    headGroup.add(glassesGroup);

    const buildLensFrame = (side: -1 | 1) => {
      const grp = new THREE.Group();
      grp.position.set(side * 0.205, 0, 0);

      const topBar = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.036, 0.042), frameMat);
      topBar.position.y = 0.11;
      grp.add(topBar);

      const botBar = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.028, 0.04), frameMat);
      botBar.position.y = -0.105;
      grp.add(botBar);

      const outerBar = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.23, 0.04), frameMat);
      outerBar.position.x = side * 0.15;
      grp.add(outerBar);

      const innerBar = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.22, 0.04), frameMat);
      innerBar.position.x = side * -0.145;
      grp.add(innerBar);

      const lens = new THREE.Mesh(new THREE.PlaneGeometry(0.27, 0.19), lensMat);
      grp.add(lens);

      return grp;
    };

    glassesGroup.add(buildLensFrame(-1));
    glassesGroup.add(buildLensFrame(1));

    const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.036, 0.04), frameMat);
    bridge.position.set(0, 0.07, 0.01);
    glassesGroup.add(bridge);

    for (const side of [-1, 1]) {
      const temple = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.032, 0.58), frameMat);
      temple.position.set(side * 0.36, 0.07, -0.27);
      temple.rotation.y = side * -0.16;
      glassesGroup.add(temple);
    }

    // Voluminous Swept Black Hair
    const hairGroup = new THREE.Group();
    headGroup.add(hairGroup);

    const hairBase = new THREE.Mesh(
      new THREE.SphereGeometry(0.555, 30, 22, 0, Math.PI * 2, 0, Math.PI * 0.56),
      hairMat
    );
    hairBase.scale.set(0.95, 1.12, 0.99);
    hairBase.rotation.x = -0.22;
    hairBase.position.set(0, 0.03, -0.04);
    hairGroup.add(hairBase);

    const hairPuffs: [number, number, number, number, number, number][] = [
      [0.0, 0.58, 0.12, 0.34, 0.22, 0.28],
      [-0.22, 0.54, 0.18, 0.24, 0.18, 0.22],
      [0.24, 0.56, 0.16, 0.26, 0.2, 0.24],
      [0.12, 0.65, 0.02, 0.32, 0.22, 0.28],
      [-0.14, 0.62, -0.02, 0.28, 0.2, 0.25],
      [0.34, 0.45, 0.06, 0.2, 0.18, 0.22],
      [-0.35, 0.42, 0.06, 0.19, 0.17, 0.2],
      [0.0, 0.52, -0.22, 0.36, 0.24, 0.26],
      [-0.24, 0.44, -0.26, 0.26, 0.22, 0.22],
      [0.24, 0.44, -0.26, 0.26, 0.22, 0.22],
      [0.06, 0.54, 0.32, 0.24, 0.16, 0.16],
      [-0.16, 0.49, 0.31, 0.2, 0.14, 0.14],
    ];

    const puffGeo = new THREE.SphereGeometry(1, 18, 16);
    hairPuffs.forEach(([x, y, z, sx, sy, sz]) => {
      const puff = new THREE.Mesh(puffGeo, hairMat);
      puff.position.set(x, y, z);
      puff.scale.set(sx, sy, sz);
      puff.castShadow = true;
      hairGroup.add(puff);
    });

    // Subtle dust
    const dustCount = 80;
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 12;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 1;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dust = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({ color: 0xef4444, size: 0.032, transparent: true, opacity: 0.4 })
    );
    scene.add(dust);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: MouseEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    const onResize = () => {
      if (!container) return;
      const { w, h } = getSize();
      applyCameraFraming(w, h);
      controls.enableZoom = window.innerWidth >= 1024;
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    const startTime = performance.now();
    let nextBlinkAt = 2.8;
    let frameId = 0;

    const animate = () => {
      frameId = window.requestAnimationFrame(animate);
      const t = (performance.now() - startTime) / 1000;
      const isWarp = warpingRef.current;

      mouse.x += (mouse.tx - mouse.x) * 0.07;
      mouse.y += (mouse.ty - mouse.y) * 0.07;

      bodyGroup.position.y = Math.sin(t * 1.5) * 0.045;
      laptopGroup.position.y = -0.66 + Math.sin(t * 1.5 + 0.5) * 0.02;

      const targetHeadY = isDragging ? 0 : mouse.x * 0.4;
      const targetHeadX = isDragging ? 0 : -mouse.y * 0.2;
      headGroup.rotation.y += (targetHeadY - headGroup.rotation.y) * 0.08;
      headGroup.rotation.x += (targetHeadX - headGroup.rotation.x) * 0.08;

      pupilGroups.forEach((p) => {
        p.position.x = isDragging ? 0 : mouse.x * 0.018;
        p.position.y = isDragging ? 0 : mouse.y * 0.014;
      });

      let blinkClosed = 0;
      if (t >= nextBlinkAt && t < nextBlinkAt + 0.16) {
        blinkClosed = Math.sin(((t - nextBlinkAt) / 0.16) * Math.PI);
      } else if (t >= nextBlinkAt + 0.16) {
        nextBlinkAt = t + 3.2 + Math.random() * 2.4;
      }
      eyelidMeshes.forEach((lid) => {
        lid.rotation.x = -Math.PI * 0.48 + blinkClosed * Math.PI * 0.52;
      });

      screenUnderGlow.intensity = 4.0 + Math.sin(t * 3.5) * 0.9 + (isWarp ? 12 : 0);
      laptopScreenMat.emissiveIntensity = 0.85 + Math.sin(t * 3.5) * 0.2 + (isWarp ? 2.5 : 0);
      dust.rotation.y = t * 0.025;

      if (isWarp) {
        controls.enabled = false;
        camera.clearViewOffset();
        camera.updateProjectionMatrix();
        camera.position.lerp(new THREE.Vector3(0, -0.35, 1.35), 0.12);
        camera.lookAt(0, -0.35, 0.9);
      } else {
        controls.update();
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
      controls.dispose();
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
        className="h-full w-full bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.2),transparent_60%)]"
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-full w-full cursor-grab touch-none active:cursor-grabbing"
    />
  );
}
