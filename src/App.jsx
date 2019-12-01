import React, { Component, Fragment } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Editor, shapes } from "./editor/editor";

const randomFromRange = (min, max) => Math.random() * (max - min) + min;
const shapeNames = Object.keys(shapes);

class App extends Component {
  componentDidMount() {
    this.shapes = {};
    this.sceneSetup();
    this.startAnimationLoop();
    window.addEventListener("resize", this.handleWindowResize);
  }

  constructor() {
    super();
    this.editor = new Editor();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
    window.cancelAnimationFrame(this.requestID);
    this.controls.dispose();
  }

  sceneSetup = () => {
    const width = this.el.clientWidth;
    const height = this.el.clientHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xe1e1e1);
    this.scene.name = "Scene";

    const ambientLight = new THREE.AmbientLight(0xcccccc, 1);
    ambientLight.name = "AmbientLight";
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight.name = "DirectionalLight";
    directionalLight.position.set(1, 1, 1).multiplyScalar(10);
    this.scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.4);
    pointLight.name = "PointLight";
    pointLight.position.set(0, 200, 0);
    this.scene.add(pointLight);

    this.camera = new THREE.PerspectiveCamera(
      75, // fov = field of view
      width / height, // aspect ratio
      0.1, // near plane
      1000 // far plane
    );
    this.camera.position.z = 5; // is used here to set some distance from a cube that is located at z = 0
    // OrbitControls allow a camera to orbit around the object
    // https://threejs.org/docs/#examples/controls/OrbitControls
    this.controls = new OrbitControls(this.camera, this.el);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);

    window.THREE = THREE;
    window.controls = this.controls;
    window.scene = this.scene;
    window.renderer = this.renderer;

    this.el.appendChild(this.renderer.domElement); // mount using React ref
  };

  addRandomMesh = () => {
    const shapeIndex = Math.round(randomFromRange(0, shapeNames.length - 1)),
      shapePosition = {
        x: randomFromRange(-4, 4),
        y: randomFromRange(-3, 3),
        z: randomFromRange(-1, 2)
      };
    const shape = this.editor.addShape(
      shapeNames[shapeIndex],
      this.scene,
      shapePosition
    );
    this.shapes[shape.id] = shape;
  };

  startAnimationLoop = () => {
    for (const { mesh } of Object.values(this.shapes)) {
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.01;
    }

    this.renderer.render(this.scene, this.camera);
    this.controls.update();

    this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
  };

  handleWindowResize = () => {
    const width = this.el.clientWidth;
    const height = this.el.clientHeight;

    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;

    this.camera.updateProjectionMatrix();
  };

  render() {
    return (
      <Fragment>
        <button className={"add-shape-button"} onClick={this.addRandomMesh}>
          Add shape
        </button>
        <div className={"viewport"} ref={ref => (this.el = ref)} />
      </Fragment>
    );
  }
}

export default App;
