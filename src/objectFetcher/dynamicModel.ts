import { fetchUrlModel, fetchModel } from './common'
import {
  Group,
  Mesh,
  MeshBasicMaterial,
  DoubleSide,
  TextureLoader,
  RepeatWrapping,
  PlaneBufferGeometry,
  Vector3,
  Box3
} from 'three'
import { frameSize } from './components'

const floorModel = new Group()
const floorSize = new Vector3()
const buildingSize = new Vector3()
const fetchFloorModel = (url: string) => {
  floorModel.remove(...floorModel.children)
  floorModel.position.copy(new Vector3())
  return fetchModel(fetchUrlModel(url, floorModel), floorSize).then(() => {
    floorModel.translateY(floorSize.y / 2)
  })
}
const outSceneModel = new Group()
const fetchOutSceneModel = (url: string) =>
  fetchUrlModel(url, outSceneModel, false)

const buildingModel = new Group()
const fetchBuildingModel = (url: string) =>
  fetchModel(fetchUrlModel(url, buildingModel, false), buildingSize)

const ClapboardMat = new MeshBasicMaterial({
  side: DoubleSide
})
const ClapboardMatMap = new TextureLoader().load('images/clapboard.png')
ClapboardMatMap.wrapS = ClapboardMatMap.wrapT = RepeatWrapping
ClapboardMat.map = ClapboardMatMap

export const clapboardGroup = new Group()
export const generateClapboard = () => {
  const clapboard = new PlaneBufferGeometry(
    frameSize.z - 0.01,
    frameSize.y - 0.01
  )
  clapboard.rotateY(Math.PI / 2)
  const clapboardMesh = new Mesh(clapboard, ClapboardMat)
  clapboardGroup.add(clapboardMesh)
}
export { fetchFloorModel, fetchOutSceneModel, fetchBuildingModel }
export { floorModel, outSceneModel, buildingModel }
export { buildingSize, floorSize }
