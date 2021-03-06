import { App } from "./../App";
import {
  Group,
  MeshBasicMaterial,
  Mesh,
  Vector3,
  CatmullRomCurve3,
  Line,
  Geometry,
  LineBasicMaterial,
  BufferGeometry,
  Vector2,
  Color,
  TextureLoader,
  RepeatWrapping,
  NormalBlending,
  PlaneBufferGeometry,
  TubeBufferGeometry,
  DoubleSide,
  BackSide,
  ShaderMaterial,
} from "three";
import { fetchGLTFModel } from "@/objectFetcher/common";
import { scene, controls, camera } from "@/Base";
import TWEEN from "@tweenjs/tween.js";
import { MeshLine, MeshLineMaterial } from "three.meshline";

const texture2 = new TextureLoader().load("./imgs/light1.png");
texture2.wrapS = texture2.wrapT = RepeatWrapping; //每个都重复
texture2.offset.set(4, 1);
texture2.rotation = Math.PI / 2;
const uniforms = {
  lightTexture: { value: texture2 },
  lightColor: { value: new Color("yellow") },
  baseColor: { value: new Color("green") },
};
const shaderMaterial = new ShaderMaterial({
  uniforms: uniforms,
  transparent: true,
  side: BackSide,
  vertexShader: `
      precision highp float;
      varying vec2 vUv;

			void main() {
        vUv = uv;
				vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_Position = projectionMatrix * mvPosition;
      }
      `,
  fragmentShader: `
			uniform sampler2D lightTexture;
			uniform vec3 baseColor;
			uniform vec3 lightColor;
      varying vec2 vUv;

			void main() {
        vec4 texture = texture2D( lightTexture, vUv );
        vec4 resultColor = vec4(baseColor.rgb,1.0);
        if(texture.r > 0.0) {
          // texture * lightColor
          // resultColor = vec4(0.0,0.0,1.0,1.0);
          gl_FragColor = texture * vec4(lightColor.rgb,1.0) * vec4(baseColor.rgb,1.0);
        } else {
          gl_FragColor = vec4(resultColor.rgb, 1.0);
        }
      }
  `,
});
const posCamera = async (pos: Vector3) => {
  return new Promise((resolve, reject) => {
    pos.multiplyScalar(1.1);
    const tween: any = new TWEEN.Tween(controls.object.position as any)
      .to(
        {
          x: pos.x,
          y: pos.y,
          z: pos.z,
        },
        1000
      )
      .easing(TWEEN.Easing.Linear.None)
      .onUpdate(() => {
        controls.object.lookAt(new Vector3());
      })
      .onComplete(() => {
        resolve();
      });
    // .onUpdate(() => {
    //   points.rotation.y += 0.001;
    // })
    tween.start();
  });
};
let CamPositions: Vector3[] = [];
let CamPositionCopy: Vector3[] = [];
const moveCam = () => {
  const cam = controls.object;
  const current = CamPositions.shift();
  if (current) {
    const pro = new Promise((resolve, reject) => {
      const tween: any = new TWEEN.Tween(cam.position as any)
        .to({ x: current.x, y: current.y, z: current.z }, 100)
        .onComplete(() => {
          moveCam();
        })
        .onUpdate(() => {
          cam.lookAt(new Vector3(-5, 0, 7));
        })
        .easing(TWEEN.Easing.Linear.None);
      tween.start();
    });
  } else {
    cam.lookAt(new Vector3(-5, 0, 7));
    controls.target.copy(new Vector3(-5, 0, 7));
    // controls.object.position.copy(cam.position)
  }
};
const cameraExplor = () => {
  const curve = new CatmullRomCurve3([
    new Vector3(10, 4, 0),
    new Vector3(5, 1, 2),
    new Vector3(0, 0, 5),
    new Vector3(-4.5, 0, 6),
  ]);

  const positions = curve.getPoints(40);
  const geo = new Geometry().setFromPoints(positions);
  const line = new Line(geo, new LineBasicMaterial({ color: "red" }));
  scene.add(line);
  CamPositions = positions;
  CamPositionCopy = positions;
  moveCam();
};

export const initLocation = async (currentData: any) => {
  const pos = currentData.position;
  await posCamera(pos);
  const yuhang = new Group();
  await fetchGLTFModel("./models/locations/")("yuhang", yuhang);
  console.log(yuhang);
  const roof = yuhang.getObjectByName("interpreter (1)_buildings_1") as Mesh;
  const roadsPrimary = yuhang.getObjectByName(
    "interpreter_(1)_roads_primary"
  ) as Mesh;
  const profileRoadsSecondary = yuhang.getObjectByName(
    "interpreter_(1)_roads_secondary"
  ) as Mesh;
  if (roof) {
    roof.material = new MeshBasicMaterial({ color: "red" });
  }
  if (roadsPrimary) {
    roadsPrimary.material = new MeshBasicMaterial({ color: "blue" });
  }
  
  const scale = 0.001;
  if (profileRoadsSecondary) {
  profileRoadsSecondary.material = new MeshBasicMaterial({
    color: "red",
  });
}
  yuhang.scale.set(scale, scale, scale);
  scene.add(yuhang);
  App.showingLocation.add(yuhang);
  App.earth.visible = false;
  App.locations.visible = false;
  scene.add(App.showingLocation);

  cameraExplor();

  console.log(CamPositionCopy);

  const tween: any = new TWEEN.Tween({ x: 1 })
    .to(
      {
        x: 2,
      },
      40000
    )
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate(() => {
      texture2.offset.y -= 0.01;
    })
    .repeat(Infinity);
  tween.start();

  const curve = new CatmullRomCurve3(CamPositionCopy);
  const geometry = new TubeBufferGeometry(curve, 20, 0.1, 8, false);
  const material1 = new MeshBasicMaterial({
    // color: 0x00ff00,
    map: texture2,
    transparent: true,
    side: BackSide,
  });
  const mesh = new Mesh(geometry, material1);
  scene.add(mesh);
};
