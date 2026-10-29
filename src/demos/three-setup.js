import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

export { THREE, OrbitControls };

export function createScene(canvas, options = {}) {
  const {
    bloom = true,
    bloomStrength = 1.5,
    bloomRadius = 0.4,
    bloomThreshold = 0.85,
    orbit = true,
    autoRotate = true,
    autoRotateSpeed = 0.5,
    background = 0x000000,
    fog = 0,
    fov = 45,
    near = 0.1,
    far = 200,
    toneMapping = THREE.ACESFilmicToneMapping,
    exposure = 1.2,
  } = options;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = toneMapping;
  renderer.toneMappingExposure = exposure;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(background);
  if (fog) scene.fog = new THREE.FogExp2(background, fog);

  const camera = new THREE.PerspectiveCamera(fov, 1, near, far);

  let controls;
  if (orbit) {
    controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.minDistance = 2;
    controls.maxDistance = 20;
    if (autoRotate) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = autoRotateSpeed;
    }
  }

  let composer;
  if (bloom) {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(256, 256), bloomStrength, bloomRadius, bloomThreshold));
  }

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (composer) composer.setSize(w, h);
  }
  resize();

  const clock = new THREE.Clock();
  let frame;

  function start(animate) {
    const tick = () => {
      const dt = clock.getDelta();
      const t = clock.getElapsedTime();
      controls?.update();
      animate?.(t, dt);
      if (composer) composer.render();
      else renderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
  }

  function dispose() {
    cancelAnimationFrame(frame);
    window.removeEventListener("resize", resize);
    controls?.dispose();
    composer?.dispose();
    renderer.dispose();
    scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
        else obj.material.dispose();
      }
    });
  }

  return { scene, camera, renderer, controls, composer, start, dispose, resize };
}
