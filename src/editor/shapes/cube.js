import * as THREE from "three";

import Shape from "../shape";

export class CubeShape extends Shape {
  constructor(name) {
    super(name);

    this.mesh.geometry = new THREE.BoxGeometry(10, 10, 10);
  }
}
