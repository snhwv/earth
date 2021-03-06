import {
  fetchGoodsComponentGLTFModel,
  fetchCompactComponentGLTFModel,
  fetchModel
} from './common'
import { Group, Vector3 } from 'three'
import { generateClapboard } from '.'

// 单位货架
const levelComponentModel = new Group()
// 箱子
const boxModel = new Group()
// 外面的框
const frameComponentModel = new Group()
// 把手
const shelfHandleModel = new Group()
// 隔板
const shelfDividerModel = new Group()
// 层板
const shelfRowModel = new Group()
// 区域两边的面
const shelfSiderModel = new Group()

const levelComponentSize = new Vector3()
const boxSize = new Vector3()
const frameSize = new Vector3()
const handleSize = new Vector3()
const dividerSize = new Vector3()
const shelfRowModelSize = new Vector3()
const shelfSiderModelSize = new Vector3()

// 获取单位货架模型
const fetchLevelComponentModel = () =>
  fetchModel(
    fetchGoodsComponentGLTFModel('level_component', levelComponentModel),
    levelComponentSize
  )
// 获取箱子模型
const fetchBoxModel = () =>
  fetchModel(fetchGoodsComponentGLTFModel('box', boxModel), boxSize)
// 获取列外框模型
const fetchColComponentModel = () =>
  fetchModel(
    fetchCompactComponentGLTFModel('layer4_Frame', frameComponentModel),
    frameSize
  )
// 获取把手模型
const fetchShelfHandleModel = () =>
  fetchModel(
    fetchCompactComponentGLTFModel('layer4_handle', shelfHandleModel),
    handleSize
  )
// 获取列分隔模型
const fetchShelfDividerModel = () =>
  fetchModel(
    fetchCompactComponentGLTFModel('layer4_partition_1', shelfDividerModel),
    dividerSize
  )
// 获取层板模型
const fetchShelfRowModel = () =>
  fetchModel(
    fetchCompactComponentGLTFModel('layer4_partition_2', shelfRowModel),
    shelfRowModelSize
  )
// 获取区域两边的面模型
const fetchShelfSiderModel = () =>
  fetchModel(
    fetchCompactComponentGLTFModel('layer4_sideboard_left', shelfSiderModel),
    shelfSiderModelSize
  )
// 获取所有默认模型
const fetchComponentAll = async () => {
  await fetchShelfHandleModel()
  await fetchColComponentModel()
  await fetchShelfDividerModel()
  await fetchShelfRowModel()
  await fetchShelfSiderModel()
  await fetchBoxModel()

  await fetchLevelComponentModel()
  // 中间隔板，得在获取到密集架边框大小后，才能根据大小设置
  generateClapboard()
}

export { fetchComponentAll }
export {
  levelComponentModel,
  frameComponentModel,
  boxModel,
  shelfHandleModel,
  shelfDividerModel,
  shelfRowModel,
  shelfSiderModel
}
export {
  levelComponentSize,
  boxSize,
  frameSize,
  handleSize,
  dividerSize,
  shelfRowModelSize,
  shelfSiderModelSize
}
