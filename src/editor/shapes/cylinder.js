import * as THREE from "three";

import Shape from "../shape";

export class Cylinder extends Shape {
  constructor(name) {
    super(name);

    this.mesh.geometry = new THREE.CylinderGeometry(1, 1, 1.5, 32);
  }
}
