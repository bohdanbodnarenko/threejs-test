import React, { Component, Fragment } from "react";

import { Editor, shapes } from "./editor/editor";
import { Renderer } from "./utils/renderer";

const randomFromRange = (min, max) => Math.random() * (max - min) + min;
const shapeNames = Object.keys(shapes);

class App extends Component {
  componentDidMount() {
    this.shapes = {};
    this.renderer = new Renderer(this.el);
    this.scene = this.renderer.scene;
    this.editor = new Editor(this.scene);
    this.animate();
  }

  componentWillUnmount() {
    this.renderer.unmount(this.requestID);
  }

  addRandomMesh = () => {
    const shapeIndex = Math.round(randomFromRange(0, shapeNames.length - 1)),
      shapePosition = {
        x: randomFromRange(-4, 4),
        y: randomFromRange(-3, 3),
        z: randomFromRange(-1, 2)
      };
    const shape = this.editor.addShape(shapeNames[shapeIndex], shapePosition);
    this.shapes[shape.id] = shape;
  };

  animate = () => {
    for (const { mesh } of Object.values(this.shapes)) {
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.01;
    }

    this.renderer.render();
    this.requestID = window.requestAnimationFrame(this.animate);
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
