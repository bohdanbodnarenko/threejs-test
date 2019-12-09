import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import * as shapeTypes from "./shapes/";
import { Renderer } from "../utils/renderer";

export const shapes = shapeTypes;
export class Editor {
  constructor(targetElement) {
    this.shapes = {};
    this.dragShape = null;
    this.dragShapeInitValues = {
      collision: false
    };
    this.deleteOnClick = false;

    this.renderer = new Renderer(targetElement);
    this.renderer.onMouseMove(this.handleMouseMove);
    this.renderer.onMouseDown(this.handleMouseDown);
    this.renderer.onMouseUp(this.handleMouseUp);
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

    this.shapes[shape.id] = {
      ...shape,
      rotate: true
    };

    // this.dragControls = new DragControls(
    //   Object.values(this.shapes).map(({ mesh }) => mesh),
    //   this.renderer.camera,
    //   this.renderer.domElement
    // );
    // this.dragControls.addEventListener("dragstart", this.handleDragStart);
    // this.dragControls.addEventListener("drag", this.handleDrag);
    // this.dragControls.addEventListener("dragend", () => {
    //   this.renderer.enableOrbitControl();
    // });
  }

  unmount(requestID) {
    this.renderer.unmount(requestID);
  }

  addCustomModel = () => {
    const loader = new GLTFLoader();
    loader.load("Soldier.glb", gltf => {
      const model = gltf.scene;
      model.rotateY(Math.PI);
      model.scale.set(20, 20, 20);
      model.position.set(0, -50, 0);
      this.renderer.scene.add(model);
      model.traverse(object => {
        if (object.isMesh) object.castShadow = true;
      });
    });
  };

  render() {
    for (const { mesh } of Object.values(this.shapes).filter(
      ({ rotate }) => rotate
    )) {
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.01;
    }

    this.renderer.render();
  }

  handleMouseDown = event => {
    const intersect = this.renderer.checkMouseIntersection(
      event,
      Object.values(this.shapes).map(({ mesh }) => mesh)
    );
    if (intersect) {
      if (this.deleteOnClick) {
        delete this.shapes[intersect.object.uuid];
        intersect.object.userData.removeFromScene();
        return;
      }
      const { userData } = intersect.object;

      this.shapes[userData.id].rotate = false;

      const { position, color } = userData;
      this.dragShape = userData;
      this.dragShapeInitValues = { position: { ...position }, color };
      this.renderer.disableOrbitControl();
    }
  };

  handleMouseMove = event => {
    if (!this.dragShape) {
      return;
    }

    //TODO change x and y to shape limits
    const intersect = this.renderer.checkMouseIntersection(event);

    if (!intersect) {
      return;
    }

    const { uuid } = this.dragShape.mesh;
    const meshesForCollision = Object.entries(this.shapes).reduce(
      (acc, [key, { mesh }]) => (key !== uuid ? acc.concat(mesh) : acc),
      []
    );

    const shapeIntersect = this.renderer.checkMouseIntersection(
      event,
      meshesForCollision
    );

    if (shapeIntersect) {
      const firstBB = new THREE.Box3().setFromObject(intersect.object);
      const secondBB = new THREE.Box3().setFromObject(shapeIntersect.object);
      const collision = firstBB.intersectsBox(secondBB);

      if (collision) {
        this.dragShapeInitValues.collision = true;
        this.dragShape.color = "#ff0000";
      }
    } else {
      if (this.dragShapeInitValues.collision) {
        this.dragShapeInitValues.collision = false;
        this.dragShape.color = this.dragShapeInitValues.color;
      }
    }

    this.dragShape.opacity = 0.25;
    this.dragShape.position = intersect.point.clone();
  };

  handleMouseUp = () => {
    if (this.dragShape) {
      this.renderer.enableOrbitControl();

      const { position, color } = this.dragShapeInitValues;
      if (this.dragShapeInitValues.collision) {
        this.dragShape.position = position;
      }

      this.dragShape.color = color;
      this.dragShape.opacity = 1;
      this.shapes[this.dragShape.id].rotate = true;
      this.dragShape = null;
    }
  };
}
