import { DragControls } from "three/examples/jsm/controls/DragControls";

import * as shapeTypes from "./shapes/";
import { Renderer } from "../utils/renderer";

export const shapes = shapeTypes;
export class Editor {
  constructor(targetElement) {
    this.shapes = {};
    this.movingShapes = [];

    this.renderer = new Renderer(targetElement);
    this.renderer.onMouseMove(this.handleMouseMove);
    this.renderer.onMouseDown(this.handleMouseDown);
  }

  addShape(type, position = { x: 0, y: 0, z: 0 }) {
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

    shape.addToScene(this.renderer.scene);

    this.shapes[shape.id] = shape;

    this.dragControls = new DragControls(
      Object.values(this.shapes).map(({ mesh }) => mesh),
      this.renderer.camera,
      this.renderer.domElement
    );
    this.dragControls.addEventListener("dragstart", this.handleDragStart);
    this.dragControls.addEventListener("dragend", () => {
      this.renderer.enableOrbitControl();
    });
  }

  unmount(requestID) {
    this.renderer.unmount(requestID);
  }

  render() {
    for (const id of this.movingShapes) {
      this.shapes[id].mesh.rotation.x += 0.01;
      this.shapes[id].mesh.rotation.y += 0.01;
    }

    this.renderer.render();
  }

  handleDragStart = event => {
    console.log(event);
    this.renderer.disableOrbitControl();
  };

  handleMouseMove(event) {}
  handleMouseDown = event => {
    const intersect = this.renderer.checkMouseIntersection(
      event,
      Object.values(this.shapes).map(({ mesh }) => mesh)
    );
    if (intersect) {
      const { uuid } = intersect.object;
      if (this.movingShapes.includes(uuid)) {
        const index = this.movingShapes.indexOf(uuid);
        this.movingShapes.splice(index, 1);
      } else {
        this.movingShapes.push(uuid);
      }
    }
  };
}
