import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { scene, camera, renderer } from "@/Base";
import { Vector2 } from "three";

const params = {
  exposure: 0.5,
  bloomStrength: 0.3,
  bloomThreshold: 0,
  bloomRadius: 1.55,
};
export let composer: EffectComposer;
export const initComposer = () => {
  const renderScene = new RenderPass(scene, camera);
  const bloomPass = new UnrealBloomPass(
    new Vector2(window.innerWidth, window.innerHeight),
    params.bloomStrength,
    params.bloomRadius,
    params.bloomThreshold
  );
  bloomPass.renderToScreen = true


  composer = new EffectComposer(renderer);
  composer.setSize(window.innerWidth, window.innerHeight)
  composer.addPass(renderScene);
  // composer.addPass(bloomPass);
};
