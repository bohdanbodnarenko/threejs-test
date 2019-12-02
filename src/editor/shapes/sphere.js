import * as THREE from "three";

import Shape from "../shape";

export class SphereShape extends Shape {
  constructor(name) {
    super(name);

    this.mesh.geometry = new THREE.SphereGeometry(5, 32, 32);
  }
}
