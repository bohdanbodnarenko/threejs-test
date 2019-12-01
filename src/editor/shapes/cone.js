import * as THREE from "three";

import Shape from "../shape";

export class Cone extends Shape {
  constructor(name) {
    super(name);

    this.mesh.geometry = new THREE.ConeGeometry(0.5, 3, 16);
  }
}
