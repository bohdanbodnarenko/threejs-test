import React, { Component, Fragment } from "react";

import { Editor, shapes } from "./editor/editor";

const randomFromRange = (min, max) => Math.random() * (max - min) + min;
const shapeNames = Object.keys(shapes);

class App extends Component {
  state = {
    position: {
      x: {
        min: -130,
        max: 130
      },
      y: {
        min: -70,
        max: 70
      },
      z: {
        min: -100,
        max: 100
      }
    }
  };

  componentDidMount() {
    this.editor = new Editor(this.el);
    this.animate();
  }

  componentWillUnmount() {
    // this.editor.unmount(this.requestID);
  }

  addRandomMesh = () => {
    const { x, y, z } = this.state.position;
    const shapeIndex = Math.round(randomFromRange(0, shapeNames.length - 1)),
      shapePosition = {
        x: randomFromRange(x.min, x.max),
        y: randomFromRange(y.min, y.max),
        z: randomFromRange(z.min, z.max)
      };
    this.editor.addShape(shapeNames[shapeIndex], shapePosition);
  };

  animate = () => {
    this.editor.render();
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
