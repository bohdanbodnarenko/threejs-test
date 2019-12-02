import * as THREE from "three";

import Shape from "../shape";

export class Cylinder extends Shape {
  constructor(name) {
    super(name);

    this.mesh.geometry = new THREE.CylinderGeometry(10, 10, 20, 32);
  }
}
