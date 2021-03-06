import { Box3, Object3D, Box3Helper, Color } from 'three'

export function generateBox3Helper(obj: Object3D) {
  const box = new Box3()
  box.setFromObject(obj)

  const helper = new Box3Helper(box, new Color(0xffff00))
  obj.add(helper)
  // return helper
}
