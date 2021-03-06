<template>
  <div>
    <!-- <button @click="exportscence">sdfasadf</button> -->
    <div ref="container" id="container" class="home"></div>
    <!-- <div id="map" class="map"></div> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
// import { init, scene } from "@/Base";
// import { scene } from "@/Base";

declare let AMap: any;
@Component({
  components: {
    HelloWorld
  }
})
export default class Home extends Vue {
  @Ref("container") container!: HTMLElement;

  lon = 120.195613;
  lat = 30.264339;
  zoom = 11;
  map: any;
  async mounted() {
    // init(this.container);
    this.initMap();
    this.loadGltf();
  }
  initMap() {
    const map = new AMap.Map("container", {
      center: [this.lon, this.lat],
      viewMode: "3D",
      pitch: 60,
      rotation: -35,
      // 隐藏默认楼块
      features: ["bg", "road", "point"],
      mapStyle: "amap://styles/89eec4f7f1719ef5acb8c76fab951c62",
      layers: [
        // 高德默认标准图层
        new AMap.TileLayer.Satellite(),
        new AMap.TileLayer.RoadNet(),
        // 楼块图层
        new AMap.Buildings({
          zooms: [14, 18],
          zIndex: 10,
          heightFactor: 2 //2倍于默认高度，3D下有效
        })
      ],
      zoom: 16
    });
    this.map = map;
    console.log(map)
  }
  loadGltf() {
    // 创建Object3DLayer图层
    const { map, lon, lat } = this;
    const object3Dlayer = new AMap.Object3DLayer();
    map.add(object3Dlayer);
    console.log(map);
    // 加载AMap.GltfLoader插件
    AMap.plugin(["AMap.GltfLoader"], function() {
      // 创建AMap.GltfLoader插件实例
      const gltf = new AMap.GltfLoader();

      // 调用load方法，加载 glTF 模型资源
      const urlDuck = "https://a.amap.com/jsapi_demos/static/gltf/Duck.gltf"; // 模型资源文件路径，远程/本地文件均可
      gltf.load(urlDuck, function(gltfCity: any) {
        // gltfCity 为解析后的gltf对象
        const option = {
          position: new AMap.LngLat(lon, lat), // 必须, 设置gltf模型位置
          scale: 1200, // 非必须，设置模型缩放倍数
          height: 100, // 非必须，设置模型高度
          scene: 0 // 非必须，设置当前场景序号
        };
        gltfCity.setOption(option);
        gltfCity.rotateX(90);
        object3Dlayer.add(gltfCity);
      });

      // 可多次调用load方法，加载多个 glTF 模型资源
      // const urlCity =
      //   "https://a.amap.com/jsapi_demos/static/gltf-online/shanghai/scene.gltf";
      // gltf.load(urlCity, function(gltfDuck: any) {
      //   // gltfDuck 为解析后的gltf对象
      // });
    });
  }
}
</script>

<style lang="less" scoped>
.home {
  width: 100%;
  height: 100vh;
}
// #container {
//   margin: 0;
//   padding: 0;
//   width: 100%;
//   height: 100%;
// }
.map {
  width: 100%;
  height: 100vh;
}
</style>
