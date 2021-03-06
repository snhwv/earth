import {
  Object3D,
  Box3,
  Vector3,
  Mesh,
  Group,
  Scene,
} from "three";
import store from "@/store";
const { commit, getters } = store;
/**
 *返回传入dom的boundingRect
 *
 * @param {HTMLElement} currentDOM
 * @returns
 */
export const getDomSize = (currentDOM: HTMLElement) => {
  return currentDOM.getBoundingClientRect();
};

/**
 *获取传入object3D的长宽高以及最小点与最大点
 * @param {Object3D} obj
 * @returns
 */
export function getBox(obj: Object3D) {
  const box = new Box3();
  const center = new Vector3();
  const size = new Vector3();
  box.setFromObject(obj);
  box.getSize(size);
  box.getCenter(center);
  return {
    size,
    center,
    box,
    max: box.max,
    min: box.min,
  };
}

export function setCenter(obj: Object3D) {
  const box = new Box3();
  box.setFromObject(obj);

  const center = new Vector3();

  box.getCenter(center);
  obj.position.add(center.negate());
  return box;
}

/**
 *生成自适应大小的文本canvas贴图
 * @param {*} text
 * @param {number} [fontSize=40] 字体大小
 * @returns
 */
export function generateCanvasMap(text: string, fontSize = 40) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }
  ctx.font = fontSize + "px 黑体";
  ctx.fillStyle = "black";
  ctx.textBaseline = "middle";

  const a = ctx.measureText(text);

  canvas.width = a.width + fontSize * 1;
  canvas.height = fontSize + fontSize * 0;

  ctx.font = fontSize + "px 黑体";
  ctx.fillStyle = "black";
  ctx.textBaseline = "middle";

  ctx.fillText(text, fontSize / 2, canvas.height / 2);

  return {
    size: {
      width: canvas.width,
      height: canvas.height,
    },
    // map: new CanvasTexture(canvas),
    canvas,
  };
}

export const findParentByCondition = (
  object: Object3D,
  condition: (object: Object3D) => boolean
) => {
  let parentObject: Object3D | null = null;
  if (condition(object)) {
    parentObject = object;
  } else {
    object.traverseAncestors((parent: Object3D) => {
      if (condition(parent) && !parentObject) {
        parentObject = parent;
      }
    });
  }
  return parentObject;
};
export function cleanObject(object: Group | Scene) {
  object.traverse((obj) => {
    const child = obj as Mesh;
    if (child.isMesh) {
      child.geometry.dispose();
      if (Array.isArray(child.material)) {
        child.material.map((item) => item.dispose());
      } else {
        child.material.dispose();
      }
    }
  });
  object.remove(...object.children);
}

export function getParentKey(treeData: any[], uuid: string): string[] {
  const keys = [];
  for (let i = 0; i < treeData.length; i++) {
    const thisLevelKey = treeData[i].key;
    if (treeData[i].key === uuid) {
      keys.push(thisLevelKey);
      break;
    } else {
      if (treeData[i]?.children?.length) {
        keys.push(...getParentKey(treeData[i].children, uuid));
        if (keys.length > 0) {
          keys.unshift(thisLevelKey);
          break;
        }
      }
    }
  }
  if (!keys.includes(uuid)) {
    keys.length = 0;
  }
  return keys;
}