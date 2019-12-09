import * as THREE from "three";

export default class Shape {
  constructor(name) {
    this.mesh = new THREE.Mesh();
    this.mesh.receiveShadow = true;
    this.mesh.name = name;
    this.mesh.material = new THREE.MeshPhongMaterial({
      color: Math.random() * 0xffffff,
      emissive: 0x072534,
      side: THREE.DoubleSide,
      flatShading: true
    });
    this.mesh.userData = this;
  }

  get id() {
    return this.mesh.uuid;
  }

  get name() {
    return this.mesh.name;
  }

  set name(value) {
    this.mesh.name = value;
  }

  get position() {
    return this.mesh.position;
  }

  set position(value) {
    this.mesh.position.copy(value);
  }

  get color() {
    return `#${this.mesh.material.color.getHexString()}`;
  }

  set color(value) {
    this.mesh.material.color.set(value);
  }

  get opacity() {
    return this.mesh.material.opacity;
  }

  set opacity(value) {
    this.mesh.material.transparent = value !== 1;
    this.mesh.material.opacity = value;
  }

  addToScene(scene) {
    scene.add(this.mesh);
  }

  removeFromScene() {
    if (this.mesh.parent) {
      this.mesh.parent.remove(this.mesh);
    }
  }
}
