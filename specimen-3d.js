/* ============================================================
   GreenKart Organics — Field Study
   A procedural 3D specimen (wild blueberries cluster).
   Built with Three.js, no external models. Lazy-loaded.
   ============================================================ */

import * as THREE from 'https://esm.sh/three@0.160.0';

export function createSpecimenScene(wrap) {
  const canvas = wrap.querySelector('canvas');

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'low-power',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0.3, 5.4);
  camera.lookAt(0, 0, 0);

  /* ---- Lighting: editorial studio key + rim ---- */
  scene.add(new THREE.AmbientLight(0xffeecc, 0.35));

  const key = new THREE.DirectionalLight(0xfff1d6, 1.6);
  key.position.set(3, 4, 3);
  scene.add(key);

  const fill = new THREE.DirectionalLight(0xa6c8ff, 0.55);
  fill.position.set(-3, 1.5, 2);
  scene.add(fill);

  const rim = new THREE.DirectionalLight(0xffffff, 0.6);
  rim.position.set(0, 2, -3);
  scene.add(rim);

  /* ---- The specimen: a cluster of varied berries ---- */
  const cluster = new THREE.Group();

  const berryGeom = new THREE.IcosahedronGeometry(0.38, 3);
  // slight per-vertex noise so berries aren't perfect spheres
  const pos = berryGeom.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const v = new THREE.Vector3().fromBufferAttribute(pos, i);
    const n = 1 + (Math.sin(v.x * 13) + Math.cos(v.y * 11) + Math.sin(v.z * 9)) * 0.012;
    v.multiplyScalar(n);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  berryGeom.computeVertexNormals();

  // Procedurally-placed positions with varied sizes & tints
  const seed = (n) => {
    // tiny deterministic PRNG so each render is identical
    const x = Math.sin(n * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  };

  const berries = [];
  for (let i = 0; i < 14; i++) {
    const r1 = seed(i + 1);
    const r2 = seed(i + 100);
    const r3 = seed(i + 200);
    const r4 = seed(i + 300);

    // spherical cluster distribution, biased inward
    const theta = r1 * Math.PI * 2;
    const phi = Math.acos(1 - 2 * r2);
    const radius = 0.35 + r3 * 0.5;

    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color().setHSL(
        0.66 + (r4 - 0.5) * 0.04,   // deep blue with slight variance
        0.38 + r4 * 0.18,
        0.14 + r1 * 0.06,
      ),
      roughness: 0.45 + r2 * 0.15,
      metalness: 0.0,
      clearcoat: 0.4,
      clearcoatRoughness: 0.4,
      sheen: 0.8,
      sheenRoughness: 0.5,
      sheenColor: new THREE.Color(0xd3c8ff),   // the pale "bloom" berries carry
    });
    const berry = new THREE.Mesh(berryGeom, mat);

    berry.position.set(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi) * 0.9,
      radius * Math.sin(phi) * Math.sin(theta),
    );
    const s = 0.78 + r3 * 0.36;
    berry.scale.setScalar(s);
    berry.rotation.set(r1 * Math.PI, r2 * Math.PI, r3 * Math.PI);

    cluster.add(berry);
    berries.push(berry);
  }

  // Small "calyx" spot on top of the nearest-to-camera berries
  const calyxMat = new THREE.MeshStandardMaterial({
    color: 0x1a1208, roughness: 0.9, metalness: 0,
  });
  const calyxGeom = new THREE.CircleGeometry(0.06, 6);
  berries.slice(0, 5).forEach((b, i) => {
    const c = new THREE.Mesh(calyxGeom, calyxMat);
    c.position.copy(b.position).multiplyScalar(1.02);
    c.position.y += 0.28;
    c.rotation.x = -Math.PI / 2;
    cluster.add(c);
  });

  scene.add(cluster);

  /* ---- Paper disc under the cluster (subtle shadow catcher) ---- */
  const paper = new THREE.Mesh(
    new THREE.CircleGeometry(1.7, 48),
    new THREE.MeshStandardMaterial({
      color: 0xe8e0c8, roughness: 1, metalness: 0,
      transparent: true, opacity: 0.55,
    }),
  );
  paper.rotation.x = -Math.PI / 2;
  paper.position.y = -0.6;
  scene.add(paper);

  /* ---- Interaction: drag to rotate, auto-spin when idle ---- */
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let autoRotate = !reducedMotion;
  let isDragging = false;
  let lastX = 0, lastY = 0;
  let targetRotY = 0, targetRotX = 0;
  let idleTimer = null;

  const onDown = (e) => {
    isDragging = true;
    autoRotate = false;
    lastX = e.clientX;
    lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
    canvas.style.cursor = 'grabbing';
    clearTimeout(idleTimer);
  };
  const onMove = (e) => {
    if (!isDragging) return;
    targetRotY += (e.clientX - lastX) * 0.008;
    targetRotX += (e.clientY - lastY) * 0.008;
    targetRotX = Math.max(-0.9, Math.min(0.9, targetRotX));
    lastX = e.clientX;
    lastY = e.clientY;
  };
  const onUp = (e) => {
    if (!isDragging) return;
    isDragging = false;
    canvas.releasePointerCapture?.(e.pointerId);
    canvas.style.cursor = 'grab';
    if (!reducedMotion) {
      idleTimer = setTimeout(() => { autoRotate = true; }, 2500);
    }
  };
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);
  canvas.addEventListener('pointerleave', onUp);
  canvas.style.touchAction = 'none';
  canvas.style.cursor = 'grab';

  /* ---- Only render while visible ---- */
  let isVisible = false;
  const obs = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
  }, { threshold: 0.05 });
  obs.observe(canvas);

  /* ---- Size tracking via ResizeObserver ---- */
  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w === 0 || h === 0) return;
    if (canvas.width !== Math.floor(w * renderer.getPixelRatio()) ||
        canvas.height !== Math.floor(h * renderer.getPixelRatio())) {
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  /* ---- Animation loop ---- */
  let lastTime = 0;
  let running = true;

  function animate(time) {
    if (!running) return;
    requestAnimationFrame(animate);
    if (!isVisible) return;

    const dt = (time - lastTime) / 1000;
    lastTime = time;

    if (autoRotate) targetRotY += dt * 0.35;

    // inertial easing toward target rotation
    cluster.rotation.y += (targetRotY - cluster.rotation.y) * 0.08;
    cluster.rotation.x += (targetRotX - cluster.rotation.x) * 0.08;

    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);

  /* ---- Mark ready and return disposer ---- */
  requestAnimationFrame(() => wrap.classList.add('is-3d-ready'));

  return function dispose() {
    running = false;
    obs.disconnect();
    ro.disconnect();
    renderer.dispose();
    berries.forEach(b => b.material.dispose());
    berryGeom.dispose();
    calyxGeom.dispose();
    paper.geometry.dispose();
    paper.material.dispose();
  };
}
