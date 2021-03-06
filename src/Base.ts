import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Matrix4,
  Vector3,
  Quaternion,
  ACESFilmicToneMapping,
  sRGBEncoding,
  Box3,
  Group,
  AmbientLight,
  DirectionalLight,
  AxesHelper,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  CSS3DRenderer,
  CSS3DSprite,
} from "three/examples/jsm/renderers/CSS3DRenderer.js";
import TWEEN from "@tweenjs/tween.js";
import store from "@/store";
import { composer } from "./postprocess";
const { getters } = store;

const scene = new Scene();
const css3Scene = new Scene();

const camera = new PerspectiveCamera(
  ...[
    45, // fov — 摄像机视锥体垂直视野角度
    1, // aspect — 摄像机视锥体长宽比
    0.01, // near — 摄像机视锥体近端面
    1000, // far — 摄像机视锥体远端面
  ]
);
const renderer = new WebGLRenderer({ alpha: true, antialias: true });
const css3Renderer = new CSS3DRenderer();
// renderer.toneMapping = ACESFilmicToneMapping
// renderer.toneMappingExposure = 0.5
// renderer.outputEncoding = sRGBEncoding

export const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
const controls = new OrbitControls(camera, renderer.domElement);

let mountDom!: HTMLElement;
const size = {
  width: 0,
  height: 0,
};
const offset = {
  x: 0,
  y: 0,
};

export const getDomSize = (currentDOM: HTMLElement) => {
  return currentDOM.getBoundingClientRect();
};
const localGetDomSize = (mountDom: HTMLElement) => {
  const rect = getDomSize(mountDom);
  size.width = rect.width;
  size.height = rect.height;
  offset.x = rect.x;
  offset.y = rect.y;
  return rect;
};
export const onWindowResize = () => {
  const { width, height } = localGetDomSize(mountDom);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  css3Renderer.setSize(width, height);
};

const listen = () => {
  window.addEventListener("resize", onWindowResize, false);
};

//渲染循环
const animate = () => {
  requestAnimationFrame(animate);

  (TWEEN as any).update();
  composer.render();
  css3Renderer.render(scene, camera);
};

// 控制的最小距离与最大距离
export const controlSetting = {
  minDistance: 1,
  maxDistance: 160,
};

const initLight = () => {
  const group = new Group();

  // lights
  group.add(new AmbientLight(0x666666));

  const light = new DirectionalLight(0xffffff, 1);

  light.position.set(0, 1, 0);
  // light.position.multiplyScalar(2)

  // const light2 = new DirectionalLight(0xdfebff, 0.5)
  // light2.position.set(50, 200, 100)
  // light2.position.multiplyScalar(2)

  group.add(light);
  // group.add(light2)

  scene.add(group);
};
// 相机起始位置x: -8,
// y: 16,
// z: -24,
export const cameraInitPosition = new Vector3(-8, 16, -24).multiplyScalar(0.1);
// export const cameraInitPosition = new Vector3(1, 0, 0);
const init = (initDom: HTMLElement) => {
  mountDom = initDom;

  const { width, height } = localGetDomSize(mountDom);

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  css3Renderer.setSize(width, height);

  mountDom.appendChild(renderer.domElement);
  const cssDom = css3Renderer.domElement;
  cssDom.classList.add("css3Renderer");
  mountDom.appendChild(cssDom);

  controls.minDistance = controlSetting.minDistance;
  controls.maxDistance = controlSetting.maxDistance;

  camera.position.copy(cameraInitPosition);
  camera.lookAt(0, 0, 0);

  listen();
  initLight();
  animate();

  const help = new AxesHelper(20);
  scene.add(help);
};

export {
  init,
  scene,
  css3Scene,
  camera,
  renderer,
  css3Renderer,
  controls,
  size,
  offset,
};
