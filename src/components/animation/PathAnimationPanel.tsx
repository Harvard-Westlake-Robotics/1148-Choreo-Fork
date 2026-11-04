import { observer } from "mobx-react";
import { Component } from "react";
import { doc, uiState } from "../../document/DocumentManager";
import PathAnimationSlider from "./PathAnimationSlider";
import IconButton from "@mui/material/IconButton";
import PlayIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { autorun } from "mobx";
import { Tooltip } from "@mui/material";
import hotkeys from "hotkeys-js";

import styles from "./PathAnimationPanel.module.css";
import Timeline from "./Timeline";
import AnimationSidebar from "./AnimationSidebar";
import React from "react";

type Props = object;

type State = {
  running: boolean;
  i: number;
};

class PathAnimationPanel extends Component<Props, State> {
  state = {
    running: false,
    i: 0
  };

  timerId = 0;
  totalTime = 20;
  then = Date.now();
  step = (dt: number) => this.incrementTimer(dt);

  onStart() {
    this.then = Date.now();
    this.setState({ running: true });
    if (Math.abs(this.totalTime - uiState.pathAnimationTimestamp) < 0.05) {
      uiState.setPathAnimationTimestamp(0);
    }
    window.cancelAnimationFrame(this.timerId);
    this.timerId = requestAnimationFrame(this.step);
  }

  incrementTimer(_: number) {
    const dt = Date.now() - this.then;
    this.then = Date.now();
    if (this.state.running) {
      const pathAnimationTimestamp = uiState.pathAnimationTimestamp;
      if (pathAnimationTimestamp > this.totalTime) {
        uiState.setPathAnimationTimestamp(0);
      } else {
        uiState.setPathAnimationTimestamp(pathAnimationTimestamp + dt / 1e3);
      }

      this.update();

      this.timerId = requestAnimationFrame(this.step);
    }
  }

  onStop(reset: boolean) {
    this.setState({ running: false });
    if (this.timerId !== 0) {
      window.cancelAnimationFrame(this.timerId);
    }
    if (reset) {
      uiState.setPathAnimationTimestamp(0);
      requestAnimationFrame(() => this.update());
    }
  }

  componentDidMount(): void {
    hotkeys("space", "all", (e) => {
      e.preventDefault();
      if (this.state.running) {
        this.onStop(false);
      } else {
        this.onStart();
      }
    });
    autorun(() => {
      const _ = doc.pathlist.activePathUUID;
      this.onStop(true);
    });
  }

  update() {
    this.setState({...this.state, i: (this.state.i + 1)});
  }

  render() {
    const activePath = doc.pathlist.activePath;
    return (
      <div className={styles.PathAnimationPanel}>
        <AnimationSidebar running={this.state.running} onStart={() => this.onStart()} onStop={(setZero) => this.onStop(setZero)} update={() => this.update()}></AnimationSidebar>
        <Timeline i={this.state.i}></Timeline>
      </div>
    );
  }
}
export default observer(PathAnimationPanel);
