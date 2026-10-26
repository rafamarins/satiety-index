import * as THREE from 'three';
import { gsap } from 'gsap';

const PAPER = '#f7f6f2';
const PLATE_WIDTH = 15;
const PLATE_HEIGHT = 10;
const CACHE_LIMIT = 4;
const PLACES = {
  home: [0, 0], decide: [20, 1], deposit: [40, -3], budget: [60, 1],
  team: [80, 4], search: [100, -2], inspect: [120, 3],
  offer: [140, -3], mortgage: [160, 0], settlement: [180, 3], living: [200, 0],
};

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const fragmentShader = `
  uniform sampler2D uMap;
  uniform float uOpacity;
  uniform float uLife;
  uniform float uTime;
  varying vec2 vUv;
  float softRegion(vec2 uv, vec2 centre, vec2 radius) {
    return 1.0 - smoothstep(0.25, 1.0, length((uv - centre) / radius));
  }
  void main() {
    vec2 uv = vUv;
    float windowLight = 0.0;
    if (uLife > 0.0) {
      // Feathered, sub-pixel gestures keep the feet and the house structure still.
      float buyers = softRegion(uv, vec2(0.432, 0.455), vec2(0.046, 0.11));
      float partner = softRegion(uv, vec2(0.492, 0.422), vec2(0.043, 0.10));
      float adviser = softRegion(uv, vec2(0.095, 0.492), vec2(0.040, 0.075));
      float client = softRegion(uv, vec2(0.207, 0.492), vec2(0.043, 0.085));
      float inspector = softRegion(uv, vec2(0.826, 0.570), vec2(0.031, 0.095));
      uv.y += uLife * 0.00125 * (buyers * sin(uTime * 1.4)
        + partner * sin(uTime * 1.4 + 0.8) + adviser * sin(uTime * 1.1 + 1.7));
      uv.x += uLife * 0.0011 * (client * sin(uTime * 1.2)
        + inspector * sin(uTime * 1.35 + 0.4));
      float leaves = softRegion(uv, vec2(0.202, 0.805), vec2(0.104, 0.105))
        + softRegion(uv, vec2(0.915, 0.405), vec2(0.075, 0.105));
      uv.x += leaves * uLife * 0.0018 * sin(uTime * 1.6 + uv.y * 8.0);
      windowLight = uLife * (0.5 + 0.5 * sin(uTime * 0.65)) * 0.085
        * (softRegion(uv, vec2(0.643, 0.626), vec2(0.024, 0.048))
        + softRegion(uv, vec2(0.405, 0.626), vec2(0.022, 0.048)));
    }
    vec4 sampleColor = texture2D(uMap, uv);
    // Read encoded image values: the paper disappears, while fine ink remains.
    float luminance = dot(sampleColor.rgb, vec3(0.2126, 0.7152, 0.0722));
    float paper = 0.964;
    float coverage = clamp((paper - luminance - 0.012) / (paper - 0.012), 0.0, 1.0);
    float inkGate = 1.0 - smoothstep(0.86, 0.94, luminance);
    gl_FragColor = vec4(vec3(0.0), coverage * inkGate * sampleColor.a * uOpacity * (1.0 - windowLight));
  }
`;

/**
 * A small, demand-rendered 2.5D world. At rest each plate occupies exactly the
 * same rectangle as a 3:2 HTML image with object-fit: contain inside mount.
 */
export function createWorld({ mount, imageMap, reducedMotion = false, onReady, onError, onRest }) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true, alpha: false, powerPreference: 'low-power',
      depth: true, stencil: false, preserveDrawingBuffer: false,
    });
  } catch (error) {
    let canceled = false;
    queueMicrotask(() => { if (!canceled) onError?.(error); });
    return { goTo: async () => false, focusAt: async () => false, resetFocus: async () => false, setReading() {}, setMotion() {}, dispose() { canceled = true; } };
  }

  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'display:block;width:100%;height:100%;pointer-events:none;';
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(PAPER, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  mount.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-7.5, 7.5, 5, -5, 0.1, 100);
  camera.position.z = 30;
  const plateGeometry = new THREE.PlaneGeometry(PLATE_WIDTH, PLATE_HEIGHT);
  const cache = new Map();
  const pending = new Map();
  const position = { x: 0, y: 0, zoom: 1 };
  let motionEnabled = !reducedMotion;
  let disposed = false;
  let failed = false;
  let ready = false;
  let moving = false;
  let currentId = null;
  let targetId = 'home';
  let routeVersion = 0;
  let useCounter = 0;
  let renderFrame = 0;
  let travel = null;
  let focusTween = null;
  let focusResolve = null;
  let focusDestination = null;
  let focused = false;
  let reading = false;
  let ambientTimer = 0;
  let pendingTravelResolve = null;
  let transitionOverlay = null;
  let width = 0;
  let height = 0;

  const pathPoints = Object.values(PLACES).map(([x, y]) => new THREE.Vector3(x, y - 5.6, -0.1));
  const pathGeometry = new THREE.BufferGeometry().setFromPoints(pathPoints);
  const pathMaterial = new THREE.LineDashedMaterial({
    color: '#a09b8e', transparent: true, opacity: 0.35, dashSize: 0.075, gapSize: 0.19,
  });
  const path = new THREE.Line(pathGeometry, pathMaterial);
  path.computeLineDistances();
  path.visible = false;
  scene.add(path);

  function cancelFrame() {
    if (renderFrame) cancelAnimationFrame(renderFrame);
    renderFrame = 0;
  }

  function canAnimateLife() {
    return motionEnabled && ready && currentId === 'home' && !moving && !focused
      && !reading && !focusTween && !document.hidden && !disposed && !failed;
  }

  function stopAmbient() {
    clearTimeout(ambientTimer);
    ambientTimer = 0;
    const uniform = cache.get('home')?.mesh.material.uniforms.uLife;
    if (uniform && uniform.value !== 0) {
      uniform.value = 0;
      requestRender();
    }
  }

  function scheduleAmbient(delay = 1100) {
    if (ambientTimer || !canAnimateLife()) return;
    ambientTimer = setTimeout(() => {
      ambientTimer = 0;
      if (!canAnimateLife()) return;
      const started = performance.now();
      const uniforms = cache.get('home').mesh.material.uniforms;
      function tick() {
        ambientTimer = 0;
        if (!canAnimateLife()) { stopAmbient(); return; }
        const progress = Math.min((performance.now() - started) / 5200, 1);
        uniforms.uTime.value = progress * 5.2;
        // Each small gesture eases back into the original engraving, then rests.
        uniforms.uLife.value = progress < 1 ? Math.sin(progress * Math.PI) ** 2 : 0;
        requestRender();
        if (progress < 1) ambientTimer = setTimeout(tick, 1000 / 24);
        else scheduleAmbient(3400);
      }
      tick();
    }, delay);
  }

  function stopFocus() {
    focusTween?.kill();
    focusTween = null;
    focusResolve?.(false);
    focusResolve = null;
  }

  function moveFocus(destination, immediate) {
    stopFocus();
    stopAmbient();
    focusDestination = destination;
    if (immediate || !motionEnabled) {
      Object.assign(position, destination);
      requestRender();
      scheduleAmbient();
      return Promise.resolve(true);
    }
    return new Promise(resolve => {
      focusResolve = resolve;
      focusTween = gsap.to(position, {
        ...destination, duration: 0.7, ease: 'power2.inOut', paused: document.hidden,
        onUpdate: requestRender,
        onComplete() {
          focusTween = null;
          focusResolve = null;
          scheduleAmbient();
          resolve(true);
        },
      });
    });
  }

  function focusAt(xPercent, yPercent, { immediate = false } = {}) {
    if (!ready || moving || disposed || failed || !currentId
      || !Number.isFinite(xPercent) || !Number.isFinite(yPercent)) return Promise.resolve(false);
    focused = true;
    const [x, y] = PLACES[currentId];
    const clamp = value => Math.max(0, Math.min(100, value));
    return moveFocus({
      x: x + (clamp(xPercent) / 100 - 0.5) * PLATE_WIDTH * 0.4,
      y: y + (0.5 - clamp(yPercent) / 100) * PLATE_HEIGHT * 0.4,
      zoom: 1.3,
    }, immediate);
  }

  function resetFocus({ immediate = false } = {}) {
    if (!currentId || moving || disposed || failed) return Promise.resolve(false);
    focused = false;
    const [x, y] = PLACES[currentId];
    return moveFocus({ x, y, zoom: 1 }, immediate);
  }

  function setReading(value) {
    reading = Boolean(value);
    if (reading) { stopAmbient(); requestRender(); }
    else scheduleAmbient();
  }

  function clearTransition() {
    if (!transitionOverlay) return;
    scene.remove(transitionOverlay.group);
    transitionOverlay.outgoing.material.dispose();
    transitionOverlay.incoming.material.dispose();
    transitionOverlay = null;
    for (const record of cache.values()) record.mesh.visible = true;
  }

  function createTransition(fromId, toId) {
    const from = cache.get(fromId);
    const to = cache.get(toId);
    if (!from || !to) return null;
    const group = new THREE.Group();
    const outgoing = new THREE.Mesh(plateGeometry, from.mesh.material.clone());
    const incoming = new THREE.Mesh(plateGeometry, to.mesh.material.clone());
    // Share existing textures; only these two tiny materials are temporary.
    outgoing.material.uniforms.uMap.value = from.texture;
    incoming.material.uniforms.uMap.value = to.texture;
    incoming.material.uniforms.uOpacity.value = 0;
    outgoing.renderOrder = 2;
    incoming.renderOrder = 3;
    group.add(outgoing, incoming);
    for (const record of cache.values()) record.mesh.visible = false;
    scene.add(group);
    transitionOverlay = { group, outgoing, incoming };
    return transitionOverlay;
  }

  function stopTravel() {
    const wasTraveling = Boolean(travel);
    travel?.kill();
    travel = null;
    if (pendingTravelResolve) pendingTravelResolve(false);
    pendingTravelResolve = null;
    clearTransition();
    if (wasTraveling && currentId) {
      const [x, y] = PLACES[currentId];
      Object.assign(position, { x, y, zoom: 1 });
      path.visible = false;
      requestRender();
    }
  }

  function fail(error) {
    if (failed || disposed) return;
    failed = true;
    stopAmbient();
    stopFocus();
    stopTravel();
    cancelFrame();
    for (const request of pending.values()) request.controller.abort();
    canvas.style.visibility = 'hidden';
    onError?.(error instanceof Error ? error : new Error(String(error)));
  }

  function renderNow() {
    if (disposed || failed || document.hidden || width < 2 || height < 2) return false;
    if (renderFrame) cancelAnimationFrame(renderFrame);
    renderFrame = 0;
    camera.position.x = position.x;
    camera.position.y = position.y;
    if (transitionOverlay) {
      transitionOverlay.group.position.set(camera.position.x, camera.position.y, 0);
    }
    if (camera.zoom !== position.zoom) {
      camera.zoom = position.zoom;
      camera.updateProjectionMatrix();
    }
    try {
      renderer.render(scene, camera);
      return true;
    } catch (error) {
      fail(error);
      return false;
    }
  }

  function requestRender() {
    if (renderFrame || disposed || failed || document.hidden) return;
    renderFrame = requestAnimationFrame(() => {
      renderFrame = 0;
      renderNow();
    });
  }

  function resize() {
    if (disposed || failed) return;
    const bounds = mount.getBoundingClientRect();
    const nextWidth = Math.round(bounds.width);
    const nextHeight = Math.round(bounds.height);
    if (nextWidth < 2 || nextHeight < 2) return;
    if (nextWidth === width && nextHeight === height) return;
    width = nextWidth;
    height = nextHeight;
    const aspect = width / height;
    const halfHeight = Math.max(PLATE_HEIGHT / 2, PLATE_WIDTH / (2 * aspect));
    camera.left = -halfHeight * aspect;
    camera.right = halfHeight * aspect;
    camera.top = halfHeight;
    camera.bottom = -halfHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    requestRender();
  }

  function release(record) {
    scene.remove(record.mesh);
    record.mesh.material.dispose();
    record.texture.dispose();
    record.bitmap?.close?.();
  }

  function trimCache() {
    if (cache.size <= CACHE_LIMIT) return;
    const expendable = [...cache.entries()]
      .filter(([id]) => id !== currentId && id !== targetId)
      .sort((a, b) => a[1].lastUsed - b[1].lastUsed);
    for (const [id, record] of expendable) {
      if (cache.size <= CACHE_LIMIT) break;
      release(record);
      cache.delete(id);
    }
  }

  async function decodeImage(blob) {
    if (typeof createImageBitmap === 'function') {
      return {
        image: await createImageBitmap(blob, {
          imageOrientation: 'flipY', premultiplyAlpha: 'none', colorSpaceConversion: 'none',
        }),
        flipY: false,
        bitmap: true,
      };
    }
    const url = URL.createObjectURL(blob);
    const image = new Image();
    try {
      image.src = url;
      await image.decode();
      return { image, flipY: true, bitmap: false };
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  function loadPlate(id) {
    const hit = cache.get(id);
    if (hit) {
      hit.lastUsed = ++useCounter;
      return Promise.resolve(hit);
    }
    const existing = pending.get(id);
    if (existing && !existing.controller.signal.aborted) return existing.promise;
    const request = { controller: new AbortController(), promise: null };
    request.promise = (async () => {
      const response = await fetch(imageMap[id], { signal: request.controller.signal });
      if (!response.ok) throw new Error(`Illustration could not load (${response.status}): ${id}`);
      const decoded = await decodeImage(await response.blob());
      if (disposed || failed || request.controller.signal.aborted) {
        if (decoded.bitmap) decoded.image.close();
        throw new DOMException('Scene load superseded', 'AbortError');
      }
      const texture = new THREE.Texture(decoded.image);
      texture.colorSpace = THREE.NoColorSpace;
      texture.flipY = decoded.flipY;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = true;
      texture.needsUpdate = true;
      const material = new THREE.ShaderMaterial({
        uniforms: { uMap: { value: texture }, uOpacity: { value: 1 }, uLife: { value: 0 }, uTime: { value: 0 } }, vertexShader, fragmentShader,
        transparent: true, depthWrite: false, toneMapped: false,
      });
      const mesh = new THREE.Mesh(plateGeometry, material);
      mesh.position.set(...PLACES[id], 0);
      scene.add(mesh);
      const record = { mesh, texture, bitmap: decoded.bitmap ? decoded.image : null, lastUsed: ++useCounter };
      cache.set(id, record);
      trimCache();
      return record;
    })().finally(() => {
      if (pending.get(id) === request) pending.delete(id);
    });
    pending.set(id, request);
    return request.promise;
  }

  function arrive(id, version) {
    if (disposed || failed || version !== routeVersion) return false;
    clearTransition();
    const [x, y] = PLACES[id];
    Object.assign(position, { x, y, zoom: 1 });
    moving = false;
    path.visible = false;
    currentId = id;
    const rendered = renderNow();
    if (failed || disposed) return false;
    if (!ready && rendered) {
      ready = true;
      onReady?.();
    }
    trimCache();
    onRest?.(id);
    scheduleAmbient();
    return true;
  }

  async function goTo(id, { immediate = false } = {}) {
    if (disposed || failed) return false;
    if (!Object.hasOwn(PLACES, id) || !imageMap[id]) {
      fail(new Error(`Unknown illustrated destination: ${id}`));
      return false;
    }
    const version = ++routeVersion;
    targetId = id;
    moving = true;
    focused = false;
    focusDestination = null;
    stopAmbient();
    stopFocus();
    stopTravel();
    for (const [loadingId, request] of pending) {
      if (loadingId !== id) request.controller.abort();
    }
    try {
      await loadPlate(id);
    } catch (error) {
      if (error.name !== 'AbortError' && version === routeVersion) fail(error);
      return false;
    }
    if (disposed || failed || version !== routeVersion) return false;
    if (immediate || !motionEnabled || currentId === null || currentId === id) return arrive(id, version);

    // Both plates share the same frame; only their ink opacity changes.
    const overlay = createTransition(currentId, id);
    if (!overlay) return arrive(id, version);
    path.visible = false;
    return new Promise((resolve) => {
      pendingTravelResolve = resolve;
      travel = gsap.timeline({
        paused: document.hidden,
        onUpdate: requestRender,
        onComplete: () => {
          travel = null;
          pendingTravelResolve = null;
          resolve(arrive(id, version));
        },
      });
      travel.to(overlay.outgoing.material.uniforms.uOpacity, { value: 0, duration: 0.24, ease: 'power1.inOut' }, 0);
      travel.to(overlay.incoming.material.uniforms.uOpacity, { value: 1, duration: 0.24, ease: 'power1.inOut' }, 0);
    });
  }

  function visibilityChange() {
    if (disposed || failed) return;
    if (document.hidden) {
      stopAmbient();
      cancelFrame();
      focusTween?.pause();
      travel?.pause();
    } else {
      resize();
      focusTween?.resume();
      travel?.resume();
      if (!ready && currentId && renderNow()) {
        ready = true;
        onReady?.();
      } else requestRender();
      scheduleAmbient();
    }
  }

  function contextLost(event) {
    event.preventDefault();
    fail(new Error('The illustration renderer lost its graphics context.'));
  }

  function setMotion(enabled) {
    motionEnabled = Boolean(enabled);
    if (disposed || failed) return;
    if (motionEnabled) { scheduleAmbient(); return; }
    stopAmbient();
    if (focusTween) {
      const resolve = focusResolve;
      focusResolve = null;
      stopFocus();
      if (focusDestination) Object.assign(position, focusDestination);
      resolve?.(true);
    }
    if (travel) {
      const resolve = pendingTravelResolve;
      pendingTravelResolve = null;
      travel.kill();
      travel = null;
      resolve?.(arrive(targetId, routeVersion));
    } else requestRender();
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(mount);
  document.addEventListener('visibilitychange', visibilityChange);
  canvas.addEventListener('webglcontextlost', contextLost);
  resize();
  // A synchronously requested deep link takes precedence over the default home.
  queueMicrotask(() => { if (!routeVersion && !disposed && !failed) void goTo('home', { immediate: true }); });

  function dispose() {
    if (disposed) return;
    disposed = true;
    routeVersion++;
    stopAmbient();
    stopFocus();
    stopTravel();
    cancelFrame();
    resizeObserver.disconnect();
    document.removeEventListener('visibilitychange', visibilityChange);
    canvas.removeEventListener('webglcontextlost', contextLost);
    for (const request of pending.values()) request.controller.abort();
    pending.clear();
    for (const record of cache.values()) release(record);
    cache.clear();
    plateGeometry.dispose();
    pathGeometry.dispose();
    pathMaterial.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  }

  return { goTo, focusAt, resetFocus, setReading, setMotion, dispose };
}
