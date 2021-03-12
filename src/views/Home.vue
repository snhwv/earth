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
import { initEarch } from "@/earth";
import { initComposer } from "@/postprocess";
import { addEarthListener } from "@/earth/event";
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
