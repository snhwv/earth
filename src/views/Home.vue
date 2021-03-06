<template>
  <div>
    <!-- <button @click="exportscence">sdfasadf</button> -->
    <div id="main-container" ref="container" class="home"></div>
    <!-- <div id="map" ref="container" class="home"></div> -->
  </div>
</template>

<script lang="ts">
import "@/window";
import { Component, Vue, Ref } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import { init, scene } from "@/Base";
// import { scene } from "@/Base";
import {
  PlaneBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  Float32BufferAttribute,
  TextureLoader,
  Texture,
  DoubleSide
  // Camera,
  // Scene,
  // DirectionalLight,
  // WebGLRenderer,
  // Matrix4,
  // Vector3,
  // BoxBufferGeometry,
  // Box3,
  // AmbientLight
} from "three";
import { initEarch } from "@/earth";
import { initComposer } from "@/postprocess";
import { addEarthListener } from "@/earth/event";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

// import mapboxgl from "mapbox-gl"; // or "const mapboxgl = require('mapbox-gl');"
declare let OSMBuildings: any;
const link = document.createElement("a");
link.style.display = "none";
document.body.appendChild(link); // Firefox workaround, see #6594
@Component({
  components: {
    HelloWorld
  }
})
export default class Home extends Vue {
  @Ref("container") container!: HTMLElement;

  lon = 46.5763;
  lat = 7.9904;
  zoom = 11;
  async mounted() {
    initComposer();
    init(this.container);
    initEarch();
    addEarthListener();
    // this.init();
  }
  init() {
    const osmb = new OSMBuildings({
      container: "map",
      position: { latitude: 52.52, longitude: 13.41 },
      zoom: 16,
      minZoom: 15,
      maxZoom: 22
    });

    // osmb.addMapTiles(
    //   "https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/15/17604/10743?access_token=pk.eyJ1Ijoic25od3YiLCJhIjoiY2tlM3prYm14MG8xcDJ6bWFlbmtteHRscSJ9.W7bZOb-dAol3Ino-jQN-Ig"
    //   // https://d.tiles.mapbox.com/v4//15/17604/10743.png"
    // );

    // osmb.addGeoJSONTiles(
    //   "http://d.data.osmbuildings.org/0.2/anonymous/tile/15/17604/10743.json"
    // );
    osmb.addMapTiles(
      "https://api.mapbox.com/styles/v1/osmbuildings/cjt9gq35s09051fo7urho3m0f/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoib3NtYnVpbGRpbmdzIiwiYSI6IjNldU0tNDAifQ.c5EU_3V8b87xO24tuWil0w"
    );
    osmb.addGeoJSONTiles(
      "https://{s}.data.osmbuildings.org/0.2/dixw8kmb/tile/{z}/{x}/{y}.json"
    );
  }
}
</script>

<style lang="less" scoped>
.home {
  width: 100%;
  height: 100vh;
  background-image: url("~@/assets/imgs/bg.jpg");
  background-size: 100% 100%;
}
.map {
  width: 100%;
  height: 100vh;
}
</style>
<style lang="less">
.css3Renderer {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}
.element {
  background: black;
  color: #00ffa7;
  font-weight: 900;
  padding: 4px 24px;
  border-radius: 6px;
  box-shadow: 0px 0px 10px 1px;
}
</style>
