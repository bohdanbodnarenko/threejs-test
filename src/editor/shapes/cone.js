import * as THREE from "three";

import Shape from "../shape";

export class Cone extends Shape {
  constructor(name) {
    super(name);

    this.mesh.geometry = new THREE.ConeGeometry(5, 20, 32   );
  }
}
