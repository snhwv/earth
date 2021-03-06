import {
  Vector2,
  Raycaster,
  Object3D,
  Intersection,
  Vector3,
  Matrix4,
  Mesh,
  Box3,
} from "three";
import { size, camera, offset } from "@/Base";
import store from "@/store";
import { Locations, locationDataList } from ".";
import { initLocation } from "@/Location";
import { App } from "@/App";
const { commit, getters, dispatch } = store;
let activeColMesh: Mesh;
// 鼠标点击射线
const raycaster = new Raycaster();
// 鼠标点击点
const mouse = new Vector2();
// 场景div
const getMainDom = () => document.getElementById("main-container");
const getShelfDetailDom = () => document.getElementById("shelfDetail");

/**
 *根据event事件设置点击射线
 *
 * @param {MouseEvent} event
 * 点击事件
 */
const setRaycaster = (event: MouseEvent, isDetail: boolean) => {
  const x = event.clientX;
  const y = event.clientY;

  mouse.x = ((x - offset.x) / size.width) * 2 - 1;
  mouse.y = -((y - offset.y) / size.height) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
};

/**
 *获取在给定object中第一个点击到的物体，没有获取到返回undfined
 *
 * @param {MouseEvent} event
 * 点击事件
 * @param {(Object3D[] | Object3D)} object
 * 点击范围对象|对象数组
 * @param {boolean} [recursive=false]
 * 是否检测子元素
 * @returns
 */
const getIntersects = (
  event: MouseEvent,
  object: Object3D[] | Object3D,
  recursive = false,
  isDetail = false
) => {
  setRaycaster(event, isDetail);
  let intersects: Intersection[] = [];
  if (Array.isArray(object)) {
    intersects = raycaster.intersectObjects(object, recursive);
  } else {
    intersects = raycaster.intersectObject(object, recursive);
  }

  if (intersects.length == 0) {
    return;
  }

  return intersects[0];
};
const earthMouseMoveHandler = (event: MouseEvent) => {
  const ele = Locations ? Locations : [];
  if (!Locations?.visible) {
    return;
  }
  const intersect = getIntersects(event, ele, false, true);
  if (intersect?.object) {
    if (intersect.instanceId !== undefined) {
      const currentData = locationDataList[intersect.instanceId];
      if (currentData.sprite) {
        locationDataList.map((item) => ((item.sprite as any).visible = false));
        currentData.sprite.visible = true;
      }
    }
  }
};
const onEarthClick = (event: MouseEvent) => {
  const ele = Locations ? Locations : [];
  if (!Locations?.visible) {
    return;
  }
  const intersect = getIntersects(event, ele, false, true);
  if (intersect?.object) {
    if (intersect.instanceId !== undefined) {
      const currentData = locationDataList[intersect.instanceId];
      locationDataList.map((item) => ((item.sprite as any).visible = false));
      initLocation(currentData);
      const mainDom = getMainDom();
      mainDom?.removeEventListener("mousemove", earthMouseMoveHandler);
    }
  }
};
/**
 *编辑模式，绑定点击事件
 *
 */
const earthMouseDownHandler = () => {
  const mainDom = getMainDom();
  mainDom?.addEventListener("mouseup", onEarthClick);
  const timer = setTimeout(() => {
    mainDom?.removeEventListener("mouseup", onEarthClick);
    clearTimeout(timer);
  }, 300);
};
export const addEarthListener = () => {
  const mainDom = getMainDom();
  mainDom?.addEventListener("mousedown", earthMouseDownHandler);
  mainDom?.addEventListener("mousemove", earthMouseMoveHandler);
};
export const removeEarthListener = () => {
  const mainDom = getMainDom();
  mainDom?.removeEventListener("mousedown", earthMouseDownHandler);
  mainDom?.removeEventListener("mousemove", earthMouseMoveHandler);
};
