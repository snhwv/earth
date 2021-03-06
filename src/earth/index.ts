import { App } from "./../App";
import {
  SphereBufferGeometry,
  MeshBasicMaterial,
  TextureLoader,
  Mesh,
  ShaderMaterial,
  DoubleSide,
  Vector3,
  Group,
  TorusBufferGeometry,
  Euler,
  BufferGeometry,
  BufferAttribute,
  CircleBufferGeometry,
  MathUtils,
  Float32BufferAttribute,
  PointsMaterial,
  Points,
  InstancedMesh,
  Object3D,
  CatmullRomCurve3,
  ArrowHelper,
  Line,
  LineBasicMaterial,
  FrontSide,
  AdditiveBlending,
  Vector2,
  Color,
  Geometry,
} from "three";
import { scene, camera, controls, css3Scene } from "@/Base";
import TWEEN from "@tweenjs/tween.js";
import { MeshLine, MeshLineMaterial } from "three.meshline";
import {
  CSS3DObject,
  CSS3DSprite,
} from "three/examples/jsm/renderers/CSS3DRenderer";
import { initLocation } from '@/Location';

export let Locations: InstancedMesh | null = null;

const lineTexture = new TextureLoader().load("./imgs/merge_from_ofoct.jpg");
const fillTexture = new TextureLoader().load("./imgs/earth_1.png");
const mapTexture = new TextureLoader().load("./imgs/dot.png");
const cloudTexture = new TextureLoader().load("./imgs/clouds.jpg");
const lightTexture = new TextureLoader().load("./imgs/light1.png");
const testTexture = new TextureLoader().load("./imgs/preloader.png");
const uniforms = {
  lineTexture: { value: lineTexture },
  fillTexture: { value: fillTexture },
  mapTexture: { value: mapTexture },
};
const cloudUniforms = {
  lineTexture: { value: cloudTexture },
};
const lightUniforms = {
  lightTexture: { value: lightTexture },
  // color: { value: lightTexture },
};
function lglt2v({ x: lng, y: lat }: { x: number; y: number }, radius: number) {
  lng = lng - 12;
  lat = lat - 3;
  const phi = (180 + lng) * (Math.PI / 180);

  const theta = (90 - lat) * (Math.PI / 180);

  return new Vector3(
    -radius * Math.sin(theta) * Math.cos(phi),

    radius * Math.cos(theta),

    radius * Math.sin(theta) * Math.sin(phi)
  );
}
const shaderMaterial = new ShaderMaterial({
  uniforms: uniforms,
  side: DoubleSide,
  vertexShader: `
      precision highp float;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying float _alpha;

			void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
				vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

        gl_Position = projectionMatrix * mvPosition;
        
        // vec4 worldPosition = modelMatrix * vec4( vec3( position ), 1.0 );
        // vec3 cameraToVertex = normalize( cameraPosition - worldPosition.xyz);				
        //  _alpha = 1.0 - max( 0.0, dot( normal, cameraToVertex ) );				
        // float alphaProportion = 0.8;
        // _alpha = max( 0.0, (_alpha - alphaProportion) / (1.0 - alphaProportion) );
        // _alpha = 1.0 - _alpha;
        // if(_alpha < 0.2) {
        //   _alpha = 0.2;
        // }
      }
      `,
  fragmentShader: `
			uniform sampler2D lineTexture;
			uniform sampler2D fillTexture;
			uniform sampler2D mapTexture;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying float _alpha;

			void main() {
        vec4 lineColor = texture2D( lineTexture, vUv );
        vec4 fillColor = texture2D( fillTexture, vUv );
        float silhouette = dot(vec3(0.0, 0.0, 1.0) ,vNormal );
        lineColor = vec4(lineColor.rgb,1.0);
        float z = gl_FragCoord.z;
        // if(z < 1.0 ) {
        //   z = 0.0;
        // }
        if(lineColor.r <= 0.1) {
          if(fillColor.r <= 0.1) {
            float x = sin(vUv.x * 1000.0) * 0.5 + 0.5;
            float y = sin(vUv.y * 1000.0) * 0.5 + 0.5;
            vec4 mapColor = texture2D( mapTexture, vec2(x, y) );
              float c = pow(1.0 - abs(silhouette), 1.0);
              if(c < 0.2) {
                c = 0.2;
              }
              // lineColor = vec4(c,c,c, 1.0) * mapColor.rgb;
              lineColor = vec4(c,c,c, 1.0);
          } else {
             discard;
          }
        }
        gl_FragColor = vec4(lineColor.rgb * vec3(0.0,1.0,167.0 / 255.0), 1.0);
      }
      // vec3(13.0 / 255.0,180.0 / 255.0,123.0 / 255.0)
  `,
  transparent: true,
});
const cloudShaderMaterial = new ShaderMaterial({
  uniforms: cloudUniforms,
  vertexShader: `
      precision highp float;
      varying vec2 vUv;
      varying vec3 vNormal;

			void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
				vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

        gl_Position = projectionMatrix * mvPosition;
      }
      `,
  fragmentShader: `
			uniform sampler2D lineTexture;
      varying vec2 vUv;
      varying vec3 vNormal;

			void main() {
        vec4 lineColor = texture2D( lineTexture, vUv );
        float silhouette = dot(vec3(0.0, 0.0, 1.0) ,vNormal );
        lineColor = vec4(lineColor.rgb,1.0);
        float c = 0.0;
        if(lineColor.r <= 0.1) {
          discard;
        } else {
          lineColor = vec4(c,c,c, 1.0);
            if(silhouette > 0.5 && silhouette < 0.8) {
              c =1.0 -  pow((silhouette - 0.5) * 3.3, 2.1);
            } else {
              c = 0.0;
              discard;
            }
       }
        gl_FragColor = vec4(vec3(1.0,1.0,1.0) * c, c * 0.1);
			}
  `,
  transparent: true,
});
const lightShaderMaterial = new ShaderMaterial({
  uniforms: lightUniforms,
  side: DoubleSide,
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
			uniform vec3 color;
      varying vec2 vUv;

			void main() {
        vec4 lightColor = texture2D( lightTexture, vUv );
        gl_FragColor = vec4(lightColor.rgb, 1.0);
			}
  `,
  transparent: true,
});
const SatelliteLineShaderMaterial = new ShaderMaterial({
  side: DoubleSide,
  vertexShader: `
      precision highp float;
			void main() {
				vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_Position = projectionMatrix * mvPosition;
      }
      `,
  fragmentShader: `
  void main() {
    float length = 1.0 - (gl_FragCoord.z / gl_FragCoord.w) / 40.0;
    if(length > 1.0) {
      length = 1.0;
    }else if(length < 0.3) {
      length = 0.3;
    }
    gl_FragColor = vec4(vec3(0.0,1.0,167.0 / 255.0) * length, length);
  }
`,
  transparent: true,
});
export const locationDataList: {
  x: number;
  y: number;
  name: string;
  position?: Vector3;
  sprite?: CSS3DSprite;
}[] = [
  {
    x: 117.079938,
    y: 36.779526,
    name: "北京",
  },
  {
    x: 113.304199,
    y: 23.147831,
    name: "广州",
  },
  {
    x: 121.462143,
    y: 31.222836,
    name: "上海",
  },
  {
    x: 117.211019,
    y: 31.83075,
    name: "合肥",
  },
  {
    x: 120.262604,
    y: 30.473382,
    name: "杭州",
  },
];
const generateLocals = () => {
  const geo = new CircleBufferGeometry(0.08, 10);
  const mater = new MeshBasicMaterial({ color: "red", side: DoubleSide });
  const temp = new Object3D();
  Locations = new InstancedMesh(geo, mater, locationDataList.length);
  locationDataList.forEach((item, index) => {
    const v = lglt2v(item, 10);
    temp.position.copy(v);
    temp.lookAt(new Vector3());
    temp.updateMatrix();
    const m = temp.matrix;
    Locations?.setMatrixAt(index, m);
    item.position = v;
    const element = document.createElement("div");
    element.className = "element";
    element.innerHTML = item.name;
    const object = new CSS3DSprite(element);
    object.scale.set(0.01, 0.01, 0.01);
    object.position.copy(v.clone().multiplyScalar(1.1));
    object.visible = false;
    item.sprite = object;
    App.text.add(object);
    App.text.visible = false;
    scene.add(App.text);
  });
  return Locations;
};
const generateTarget = () => {
  const v0 = new Vector3(0, 0, -1);
  const e = new Euler();
  e.y = (Math.PI * 2) / 3;
  const v1 = v0.clone().applyEuler(e);
  const v2 = v1.clone().applyEuler(e);
  const v3 = new Vector3(0, 2, 0);
  const bg = new BufferGeometry();
  const vertices = new Float32Array([
    v0.x,
    v0.y,
    v0.z,
    v1.x,
    v1.y,
    v1.z,
    v2.x,
    v2.y,
    v2.z,

    v1.x,
    v1.y,
    v1.z,
    v2.x,
    v2.y,
    v2.z,
    v3.x,
    v3.y,
    v3.z,

    v0.x,
    v0.y,
    v0.z,
    v1.x,
    v1.y,
    v1.z,
    v3.x,
    v3.y,
    v3.z,

    v2.x,
    v2.y,
    v2.z,
    v0.x,
    v0.y,
    v0.z,
    v3.x,
    v3.y,
    v3.z,
  ]);
  // itemSize = 3 因为每个顶点都是一个三元组。
  bg.setAttribute("position", new BufferAttribute(vertices, 3));
  bg.rotateX(Math.PI / 2);
  const wireMaterial = new MeshBasicMaterial({
    wireframe: true,
    color: 0xff0000,
  });
  const fillMaterial = new MeshBasicMaterial({
    side: DoubleSide,
    color: "green",
    transparent: true,
  });
  const bm = new Mesh(bg, wireMaterial);
  const bmfill = new Mesh(bg, fillMaterial);
  const g = new Group();
  g.add(bm);
  g.add(bmfill);
  return g;
};
const initPositionPoint = () => {
  const x = 117.079938;
  const y = 36.779526;
  const v = lglt2v({ x, y }, 10);
  const vc = v.multiplyScalar(1.1);
  const p = generateTarget();
  p.position.copy(vc);
  p.lookAt(new Vector3());

  const scale = 0.2;
  p.scale.set(scale, scale, scale);

  const mesh = generateLocals();
  App.locations = mesh;
  const g = new Group();
  g.add(mesh);
  g.add(p);
  const tween: any = new TWEEN.Tween({ x: 1 })
    .to(
      {
        x: 2,
      },
      40000
    )
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate(() => {
      p.rotation.z += 0.01;
    })
    .repeat(Infinity);
    tween.start();
  return g;
};
const initSatelliteLine = () => {
  const geometry = new TorusBufferGeometry(11, 0.02, 16, 40);
  const torus = new Mesh(geometry, SatelliteLineShaderMaterial);

  const torus1 = torus.clone();
  const scale1 = 1.04;
  torus1.rotateY(Math.PI / 3);
  torus1.scale.set(scale1, scale1, scale1);

  const scale2 = 1.1;
  const torus2 = torus.clone();
  torus2.rotateX((Math.PI * 2) / 3);
  torus2.scale.set(scale2, scale2, scale2);

  const scale3 = 1.08;
  const torus3 = torus.clone();
  torus3.rotateX((Math.PI * 2) / 5);
  torus3.scale.set(scale3, scale3, scale3);

  const g = new Group();
  g.add(torus);
  g.add(torus1);
  g.add(torus2);
  g.add(torus3);

  const tween: any = new TWEEN.Tween({ x: 1 })
    .to(
      {
        x: 2,
      },
      40000
    )
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate(() => {
      torus.rotation.y += 0.0006;
      torus1.rotation.x += 0.0003;
      torus2.rotation.y += 0.0002;
      torus3.rotation.y += 0.0001;
    })
    .repeat(Infinity);
    tween.start();

  return g;
};
const initPointsSys = () => {
  const vertices = [];

  for (let i = 0; i < 1000; i++) {
    const v = new Vector3(
      MathUtils.randFloatSpread(1),
      MathUtils.randFloatSpread(1),
      MathUtils.randFloatSpread(1)
    );
    v.normalize().multiplyScalar(Math.random() * 10 + 12);
    const x = v.x;
    const y = v.y;
    const z = v.z;

    vertices.push(x, y, z);
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));

  const material = new PointsMaterial({
    color: 0x004d33,
    size: 0.12,
    transparent: true,
  });

  const points = new Points(geometry, material);

  const tween: any = new TWEEN.Tween({ x: 1 })
    .to(
      {
        x: 2,
      },
      40000
    )
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate(() => {
      points.rotation.y += 0.001;
    })
    .repeat(Infinity);
    tween.start();
  App.earth.add(points);
};
const connectLine = (v0: Vector3, v1: Vector3) => {
  const midV = v0.clone().lerp(v1.clone(), 0.25);
  const midV1 = v0.clone().lerp(v1.clone(), 0.5);
  const midV2 = v0.clone().lerp(v1.clone(), 0.75);
  const distance = v0.clone().distanceTo(v1.clone());
  midV.normalize().multiplyScalar(10 + distance / 8);
  midV1.normalize().multiplyScalar(10 + distance / 6);
  midV2.normalize().multiplyScalar(10 + distance / 8);

  const spline = new CatmullRomCurve3(
    [v0, midV, midV1, midV2, v1],
    false,
    "chordal",
    0.5
  );

  const positions = spline.getPoints(30);
  const geometry = new Geometry();
  geometry.vertices.push(...positions);
  const meshLine = new MeshLine();
  meshLine.setGeometry(geometry);
  const resolution = new Vector2(window.innerWidth, window.innerHeight);
  const material = new MeshLineMaterial({
    useMap: false,
    color: new Color("red"),
    opacity: 1,
    resolution: resolution,
    dashArray: 0.0, // 破折号之间的长度和间距。(0 -无破折号)
    dashRatio: 0, // 定义可见和不可见之间的比率(0 -更可见，1 -更不可见)。
    dashOffset: 0,
    sizeAttenuation: true,
    lineWidth: 0.02,
    transparent: true,
    near: camera.near,
    far: camera.far,
  });
  const line = new Mesh(meshLine.geometry, material);
  App.earth.add(line);
};

const initCamera = () => {
  const tween: any = new TWEEN.Tween(controls.object.position as any)
    .to(
      {
        x: -8,
        y: 16,
        z: -24,
      },
      2000
    )
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate(() => {
      controls.object.lookAt(0, 0, 0);
    });
    tween.start();
};

export const initEarch = () => {
  const geo = new SphereBufferGeometry(10, 100, 100);
  const mesh = new Mesh(geo, shaderMaterial);

  const geoOut = new SphereBufferGeometry(12, 100, 100);

  const meshOut = new Mesh(geoOut, cloudShaderMaterial);
  meshOut.renderOrder = 2;
  const lines = initSatelliteLine();
  const g = new Group();
  g.add(mesh);
  g.add(meshOut);
  g.add(lines);
  const locals = initPositionPoint();
  g.add(locals);
  initPointsSys();
  // 北京
  const v = lglt2v(locationDataList[0], 10);
  // 广州
  const v1 = lglt2v(locationDataList[1], 10);
  // 上海
  const v2 = lglt2v(locationDataList[2], 10);
  // 合肥
  const v3 = lglt2v(locationDataList[3], 10);
  // 杭州
  const v4 = lglt2v(locationDataList[4], 10);

  const v5 = lglt2v({ x: -50, y: 50 }, 10);
  connectLine(v, v1);

  connectLine(v1, v2);
  connectLine(v3, v2);
  connectLine(v3, v);

  // connectLine(v1, v5);

  // const material = new LineBasicMaterial({
  //   color: 0x0000ff
  // });

  // const points = [];
  // points.push( new Vector3( - 10, 0, 0 ) );
  // points.push( new Vector3( 0, 10, 0 ) );
  // points.push( new Vector3( 10, 0, 0 ) );

  // const geometry = new BufferGeometry().setFromPoints( points );

  // const line = new Line( geometry, material );
  // scene.add( line );

  // new TWEEN.Tween({ x: 1 })
  //   .to(
  //     {
  //       x: 2,
  //     },
  //     40000
  //   )
  //   .easing(TWEEN.Easing.Linear.None)
  //   .onUpdate(() => {
  //     g.rotation.y += 0.001;
  //   })
  //   .repeat(Infinity)
  //   .start();
  App.earth.add(g);
  scene.add(App.earth);
  initCamera();

  const currentData = locationDataList[0];
  locationDataList.map((item) => ((item.sprite as any).visible = false));
  // initLocation(currentData);
  // const mainDom = getMainDom();
  // mainDom?.removeEventListener("mousemove", earthMouseMoveHandler);
};
