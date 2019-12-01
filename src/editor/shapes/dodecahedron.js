import * as THREE from "three";

import Shape from "../shape";

export class DodecahedronShape extends Shape {
  constructor(name) {
    super(name);

    this.mesh.geometry = new THREE.DodecahedronGeometry(0.5, 0).translate(
      0,
      0.5,
      0
    );
  }
}
