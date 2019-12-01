import * as shapeTypes from "./shapes/";

export const shapes = shapeTypes;
export class Editor {
  addShape(type, scene, position = { x: 0, y: 0, z: 0 }) {
    if (!shapes[type]) {
      console.warn(`Shape with type "${type}" does not exist`);
      return null;
    }
    const shape = new shapes[type](type, false);

    if (!position.x || !position.y || !position.y) {
      console.warn(`Position for shape ${type} is in incorrect format`);
    } else {
      shape.position = position;
    }

    shape.addToScene(scene);

    return shape;
  }
}
