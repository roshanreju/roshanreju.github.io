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

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050507, 0.042);

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    const applyCameraFraming = (w: number, h: number) => {
      camera.aspect = w / h;
      if (window.innerWidth >= 1024) {
        // Shift viewport offset so character sits cleanly on the right while rotating around his true center
        camera.setViewOffset(w, h, -w * 0.17, 0, w, h);
      } else {
        camera.clearViewOffset();
      }
      camera.updateProjectionMatrix();
    };
    applyCameraFraming(width, height);
    camera.position.set(0.35, 0.72, window.innerWidth >= 1024 ? 5.4 : 5.1);

    // ── INTERACTIVE 360° ORBIT CONTROLS (Drag to spin, look from any angle!) ──
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.enableZoom = window.innerWidth >= 1024;
    controls.minDistance = 3.4;
    controls.maxDistance = 7.4;
    controls.minPolarAngle = Math.PI * 0.28;
    controls.maxPolarAngle = Math.PI * 0.68;
    controls.target.set(0, 0.25, 0);
    controls.update();

    let isDragging = false;
    controls.addEventListener('start', () => {
      isDragging = true;
    });
    controls.addEventListener('end', () => {
      isDragging = false;
    });

    // ── STUDIO PORTRAIT LIGHTING (Warm key + Crimson rim + Laptop underglow) ──
    const hemiLight = new THREE.HemisphereLight(0xfff1e6, 0x1a080b, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff5eb, 2.1);
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

    // ── STYLIZED PIXAR / COLLECTIBLE CHARACTER MATERIALS ──
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xbd8158,
      roughness: 0.56,
      metalness: 0.03,
    });

    const lipMat = new THREE.MeshStandardMaterial({
      color: 0x8f5542,
      roughness: 0.5,
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
      color: 0x0d0e12,
      roughness: 0.16,
      metalness: 0.35,
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

    // Floating obsidian studio pedestal with subtle crimson ring
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

    // ── TORSO & ARMS GROUP (Breathing idle motion!) ──
    const bodyGroup = new THREE.Group();
    characterRoot.add(bodyGroup);

    // Torso (Athletic shoulders + Black Streetwear Hoodie)
    const torsoGeo = new THREE.CapsuleGeometry(0.59, 0.72, 16, 28);
    torsoGeo.scale(1.18, 1, 0.74);
    const torso = new THREE.Mesh(torsoGeo, hoodieMat);
    torso.position.set(0, -0.45, 0);
    torso.castShadow = true;
    bodyGroup.add(torso);

    // Crisp Hoodie Collar + Relaxed Back Hood with Crimson Inner Lining
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

    // Hoodie Drawstrings with Crimson Aglets
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

    // Arms & Hands angled naturally forward toward floating laptop
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

    // Sleek Matte-Black Hacker Laptop Resting in Front
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

    // Subtle crimson emblem on back of laptop lid (visible when rotating 360°!)
    const lidBadge = new THREE.Mesh(new THREE.OctahedronGeometry(0.065, 0), crimsonAccentMat);
    lidBadge.scale.set(1, 1, 0.3);
    lidBadge.position.set(0, 0.29, 0.022);
    laptopLidPivot.add(lidBadge);

    // Glowing inner terminal screen
    const laptopScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.86, 0.48), laptopScreenMat);
    laptopScreen.position.set(0, 0.29, -0.018);
    laptopScreen.rotation.y = Math.PI;
    laptopLidPivot.add(laptopScreen);

    // Neck
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.23, 0.34, 20), skinMat);
    neck.position.set(0, 0.36, 0.02);
    bodyGroup.add(neck);

    // ── HEAD GROUP (Tracks cursor + blinks naturally!) ──
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.95, 0.03);
    bodyGroup.add(headGroup);

    // Sculpted Organic Stylized Human Head (slight jawline taper)
    const headGeo = new THREE.SphereGeometry(0.54, 36, 32);
    const posAttr = headGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < posAttr.count; i++) {
      let x = posAttr.getX(i);
      let y = posAttr.getY(i);
      let z = posAttr.getZ(i);
      // Slightly oval head shape
      y *= 1.12;
      x *= 0.93;
      z *= 0.97;
      // Gently taper lower jaw into natural chin
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

    // Ears
    for (const side of [-1, 1]) {
      const ear = new THREE.Mesh(new THREE.SphereGeometry(0.115, 16, 16), skinMat);
      ear.scale.set(0.55, 1.18, 0.85);
      ear.position.set(side * 0.5, -0.03, -0.02);
      headGroup.add(ear);
    }

    // Soft Sculpted Nose
    const noseBridge = new THREE.Mesh(new THREE.CapsuleGeometry(0.052, 0.13, 10, 14), skinMat);
    noseBridge.position.set(0, -0.02, 0.51);
    noseBridge.rotation.x = -0.18;
    headGroup.add(noseBridge);

    const noseTip = new THREE.Mesh(new THREE.SphereGeometry(0.068, 14, 14), skinMat);
    noseTip.scale.set(1.15, 0.85, 0.95);
    noseTip.position.set(0, -0.11, 0.54);
    headGroup.add(noseTip);

    // Eyes (with animated blink & subtle pupil gaze!)
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

      // Eyelid for smooth natural blinking
      const lid = new THREE.Mesh(
        new THREE.SphereGeometry(0.092, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55),
        skinMat
      );
      lid.scale.set(1.15, 0.96, 0.72);
      lid.rotation.x = -Math.PI * 0.48;
      eyeGrp.add(lid);
      eyelidMeshes.push(lid);
    });

    // Expressive Thick Dark Eyebrows
    for (const side of [-1, 1]) {
      const brow = new THREE.Mesh(new THREE.CapsuleGeometry(0.028, 0.17, 8, 12), hairMat);
      brow.rotation.z = Math.PI / 2 - side * 0.08;
      brow.position.set(side * 0.18, 0.21, 0.47);
      headGroup.add(brow);
    }

    // ── SIGNATURE BOLD BLACK WAYFARER GLASSES (Matching Photos #1, #4, #5) ──
    const glassesGroup = new THREE.Group();
    glassesGroup.position.set(0, 0.07, 0.55);
    headGroup.add(glassesGroup);

    const buildLensFrame = (side: -1 | 1) => {
      const grp = new THREE.Group();
      grp.position.set(side * 0.205, 0, 0);

      // Bold glossy black Wayfarer browline + clean rectangular rims
      const topBar = new THREE.Mesh(new THREE.BoxGeometry(0.335, 0.048, 0.046), frameMat);
      topBar.position.y = 0.112;
      grp.add(topBar);

      const botBar = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.032, 0.042), frameMat);
      botBar.position.y = -0.105;
      grp.add(botBar);

      const outerBar = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.235, 0.044), frameMat);
      outerBar.position.x = side * 0.152;
      grp.add(outerBar);

      const innerBar = new THREE.Mesh(new THREE.BoxGeometry(0.034, 0.225, 0.042), frameMat);
      innerBar.position.x = side * -0.146;
      grp.add(innerBar);

      const lens = new THREE.Mesh(new THREE.PlaneGeometry(0.27, 0.19), lensMat);
      grp.add(lens);

      return grp;
    };

    glassesGroup.add(buildLensFrame(-1));
    glassesGroup.add(buildLensFrame(1));

    // Bold Wayfarer nose bridge & side temples
    const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.135, 0.044, 0.044), frameMat);
    bridge.position.set(0, 0.078, 0.01);
    glassesGroup.add(bridge);

    for (const side of [-1, 1]) {
      const temple = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.044, 0.58), frameMat);
      temple.position.set(side * 0.362, 0.075, -0.27);
      temple.rotation.y = side * -0.16;
      glassesGroup.add(temple);
    }

    // ── CRISP BOXED FULL BEARD & MUSTACHE (Matched to all 5 angles: front + side profiles #4 & #5) ──
    const beardGroup = new THREE.Group();
    headGroup.add(beardGroup);

    // Clean boxed full jaw & chin shell with crisp low cheek line and sharp vertical back-jaw line
    const beardGeo = new THREE.SphereGeometry(0.546, 36, 26, 0, Math.PI * 2, Math.PI * 0.595, Math.PI * 0.405);
    const bPos = beardGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < bPos.count; i++) {
      let x = bPos.getX(i);
      let y = bPos.getY(i);
      let z = bPos.getZ(i);
      y *= 1.128;
      x *= 0.942;
      z *= 0.985;
      if (y < 0) {
        const taper = 1 - Math.abs(y) * 0.225;
        x *= taper;
      }
      // Crisp vertical back-jawline edge cleanly in front of ear lobe (matching side profiles #4 & #5)
      if (z < -0.02) {
        z = -0.02 + (z + 0.02) * 0.16;
        x *= 0.94;
      }
      bPos.setXYZ(i, x, y, z);
    }
    beardGeo.computeVertexNormals();
    const beardJaw = new THREE.Mesh(beardGeo, beardMat);
    beardGroup.add(beardJaw);

    // Slim flush sideburn fade connecting beard neatly toward temples
    for (const side of [-1, 1]) {
      const sideburn = new THREE.Mesh(new THREE.CapsuleGeometry(0.034, 0.16, 8, 12), beardMat);
      sideburn.position.set(side * 0.445, -0.01, 0.07);
      sideburn.rotation.z = side * -0.08;
      beardGroup.add(sideburn);
    }

    // Connected full curved mustache
    for (const side of [-1, 1]) {
      const stache = new THREE.Mesh(new THREE.CapsuleGeometry(0.032, 0.135, 8, 12), beardMat);
      stache.position.set(side * 0.085, -0.208, 0.488);
      stache.rotation.z = Math.PI / 2 - side * 0.27;
      stache.rotation.y = side * -0.22;
      beardGroup.add(stache);
    }

    // Confident slight warm smile + neat small rounded soul patch
    const mouth = new THREE.Mesh(new THREE.CapsuleGeometry(0.02, 0.135, 8, 12), lipMat);
    mouth.rotation.z = Math.PI / 2;
    mouth.position.set(0, -0.268, 0.482);
    headGroup.add(mouth);

    const soulPatch = new THREE.Mesh(new THREE.SphereGeometry(0.036, 12, 12), beardMat);
    soulPatch.scale.set(0.88, 1.2, 0.48);
    soulPatch.position.set(0, -0.34, 0.468);
    beardGroup.add(soulPatch);

    // ── CURLY TEXTURED BLACK TOP + CLEAN HIGH SKIN FADE (Matched to Photos #1-#5!) ──
    const hairGroup = new THREE.Group();
    headGroup.add(hairGroup);

    // Raised tapered cap leaving clean high-fade sides above the ears
    const hairBase = new THREE.Mesh(
      new THREE.SphereGeometry(0.552, 30, 22, 0, Math.PI * 2, 0, Math.PI * 0.44),
      hairMat
    );
    hairBase.scale.set(0.94, 1.11, 0.98);
    hairBase.rotation.x = -0.18;
    hairBase.position.set(0, 0.08, -0.04);
    hairGroup.add(hairBase);

    // Tightly clustered natural curly texture across the crown & forward fringe
    const curlyClusters: [number, number, number, number][] = [
      // Front fringe & curly top volume
      [0.0, 0.62, 0.22, 0.18],
      [-0.17, 0.59, 0.25, 0.16],
      [0.18, 0.6, 0.23, 0.16],
      [-0.31, 0.52, 0.18, 0.14],
      [0.31, 0.53, 0.17, 0.14],
      [-0.08, 0.56, 0.34, 0.13],
      [0.11, 0.57, 0.33, 0.13],
      [-0.24, 0.51, 0.3, 0.12],
      [0.24, 0.52, 0.29, 0.12],
      // Upper crown dense curls
      [0.0, 0.71, 0.06, 0.19],
      [-0.18, 0.69, 0.06, 0.17],
      [0.19, 0.7, 0.05, 0.17],
      [-0.33, 0.6, 0.02, 0.14],
      [0.33, 0.6, 0.02, 0.14],
      [-0.09, 0.74, -0.06, 0.16],
      [0.11, 0.73, -0.07, 0.16],
      // Mid/back crown tapering cleanly into high fade
      [0.0, 0.64, -0.18, 0.19],
      [-0.21, 0.59, -0.17, 0.16],
      [0.21, 0.59, -0.17, 0.16],
      [-0.32, 0.49, -0.14, 0.13],
      [0.32, 0.49, -0.14, 0.13],
      [0.0, 0.51, -0.32, 0.17],
      [-0.18, 0.47, -0.31, 0.15],
      [0.18, 0.47, -0.31, 0.15],
    ];

    const curlGeo = new THREE.IcosahedronGeometry(1, 1);
    curlyClusters.forEach(([x, y, z, r], idx) => {
      const curl = new THREE.Mesh(curlGeo, hairMat);
      curl.position.set(x, y, z);
      curl.scale.set(r * 1.08, r * 0.92, r * 1.04);
      curl.rotation.set(idx * 0.7, idx * 1.1, idx * 0.4);
      curl.castShadow = true;
      hairGroup.add(curl);
    });

    // Subtle floating studio crimson dust specks
    const dustCount = 90;
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
      new THREE.PointsMaterial({ color: 0xef4444, size: 0.032, transparent: true, opacity: 0.42 })
    );
    scene.add(dust);

    // ── POINTER GAZE TRACKING ──
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
      applyCameraFraming(w, h);
      controls.enableZoom = window.innerWidth >= 1024;
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // ── ANIMATION LOOP (Breathing, Blinking, Cursor Gaze, Orbit Damping & Warp!) ──
    const startTime = performance.now();
    let nextBlinkAt = 2.8;
    let frameId = 0;

    const animate = () => {
      frameId = window.requestAnimationFrame(animate);
      const t = (performance.now() - startTime) / 1000;
      const isWarp = warpingRef.current;

      mouse.x += (mouse.tx - mouse.x) * 0.07;
      mouse.y += (mouse.ty - mouse.y) * 0.07;

      // Subtle living breathing + float
      bodyGroup.position.y = Math.sin(t * 1.5) * 0.045;
      laptopGroup.position.y = -0.66 + Math.sin(t * 1.5 + 0.5) * 0.02;

      // Head & eyes naturally look toward visitor cursor when not dragging
      const targetHeadY = isDragging ? 0 : mouse.x * 0.42;
      const targetHeadX = isDragging ? 0 : -mouse.y * 0.22;
      headGroup.rotation.y += (targetHeadY - headGroup.rotation.y) * 0.08;
      headGroup.rotation.x += (targetHeadX - headGroup.rotation.x) * 0.08;

      pupilGroups.forEach((p) => {
        p.position.x = isDragging ? 0 : mouse.x * 0.018;
        p.position.y = isDragging ? 0 : mouse.y * 0.014;
      });

      // Natural blinking every ~3.5-5 seconds
      let blinkClosed = 0;
      if (t >= nextBlinkAt && t < nextBlinkAt + 0.16) {
        blinkClosed = Math.sin(((t - nextBlinkAt) / 0.16) * Math.PI);
      } else if (t >= nextBlinkAt + 0.16) {
        nextBlinkAt = t + 3.2 + Math.random() * 2.4;
      }
      eyelidMeshes.forEach((lid) => {
        lid.rotation.x = -Math.PI * 0.48 + blinkClosed * Math.PI * 0.52;
      });

      // Laptop terminal pulse
      screenUnderGlow.intensity = 4.0 + Math.sin(t * 3.5) * 0.9 + (isWarp ? 12 : 0);
      laptopScreenMat.emissiveIntensity = 0.85 + Math.sin(t * 3.5) * 0.2 + (isWarp ? 2.5 : 0);

      // Gentle drifting embers
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
