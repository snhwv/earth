import { Group, InstancedMesh, Geometry, Material } from "three";
export const App: {
  [key: string]: any;
  locations: InstancedMesh;
} = {
  earth: new Group(),
  text: new Group(),
  locations: new InstancedMesh(new Geometry(), new Material(), 0),
  showingLocation: new Group(),
};
