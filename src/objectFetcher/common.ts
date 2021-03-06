import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Group, DoubleSide, Mesh, Vector3, Box3 } from 'three'
import { setCenter } from '@/utils'
// import { notification } from 'ant-design-vue'

const gltfLoader = new GLTFLoader()
// 获取gltf模型
export const fetchGLTFModel = (
  baseUrl = ''
): ((name: string, parent: Group, isSetCenter?: boolean) => Promise<Group>) => {
  const fun = (
    name: string,
    parent: Group,
    isSetCenter = true
  ): Promise<Group> => {
    return new Promise((resolve, reject) => {
      gltfLoader.load(
        `${baseUrl}${name}${baseUrl ? '.glb' : ''}`,
        function(gltf) {
          const object = gltf.scene
          isSetCenter && setCenter(object)
          parent.remove(...parent.children)
          parent.add(object)
          resolve(parent)
          object.traverse(obj => {
            if ((obj as Mesh).isMesh && /tree/.test(obj.name)) {
              const material = (obj as Mesh).material
              if (Array.isArray(material)) {
                material.map(item => {
                  item.transparent = true
                  item.side = DoubleSide
                })
              } else {
                material.transparent = true
                material.side = DoubleSide
              }
            }
          })
        },
        undefined,
        e => {
          resolve(parent)
        }
      )
    })
  }
  return fun
}

const goodsBaseUrl = 'models/gltf/goodsShelf/'
export const fetchGoodsComponentGLTFModel = fetchGLTFModel(goodsBaseUrl)

const compactBaseUrl = 'models/gltf/compactShelf/'
export const fetchCompactComponentGLTFModel = fetchGLTFModel(compactBaseUrl)

export const fetchUrlModel = fetchGLTFModel()

const setModelSizeInVector = (
  fetchModelPromise: Promise<Group>,
  vector: Vector3
) => {
  return fetchModelPromise.then(model => {
    const box = new Box3().setFromObject(model)
    box.getSize(vector)
    return model
  })
}

export const fetchModel = (pro: Promise<Group>, sizeVector: Vector3) => {
  return setModelSizeInVector(pro, sizeVector)
}
