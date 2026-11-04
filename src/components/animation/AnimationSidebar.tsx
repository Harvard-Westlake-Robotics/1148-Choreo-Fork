import { observer } from "mobx-react";
import { Component } from "react";
import { doc, uiState } from "../../document/DocumentManager";

import styles from "./AnimationSidebar.module.css";
import Timeline from "./Timeline";
import { IconButton } from "@mui/material";
import { FastForward, FastRewind, NavigateNext, Pause, PlayArrow, Stop } from "@mui/icons-material";

import hotkeys from "hotkeys-js";

type Props = {
  running: boolean,
  onStart: () => void,
  onStop: (reset: boolean) => void,
  update: () => void
};

type State = object;

class AnimationSidebar extends Component<Props, State> {

  togglePlayback() {
    if (this.props.running) {
      this.props.onStop(false);
    } else {
      this.props.onStart();
    }
  }

  stopPlayback() {
    uiState.setPathAnimationTimestamp(0);
    this.props.onStop(true);
  }

  nextWaypoint() {
    var wt = doc.pathlist.activePath.waypointTimestamps();

    var t = wt.find((v: number) => (v > uiState.pathAnimationTimestamp)
                          && (Math.abs(v - uiState.pathAnimationTimestamp) > 0.05));
    
    if (t != undefined) uiState.setPathAnimationTimestamp(t);
    else uiState.setPathAnimationTimestamp(wt[0]);

    this.props.update();
  }

  prevWaypoint() {
    var wt = doc.pathlist.activePath.waypointTimestamps();

    var t = wt.findLast((v: number) => (v < uiState.pathAnimationTimestamp)
                              && (Math.abs(v - uiState.pathAnimationTimestamp) > 0.05));

    if (t != undefined) uiState.setPathAnimationTimestamp(t);
    else uiState.setPathAnimationTimestamp(wt[wt.length - 1]);

    this.props.update();
  }

  componentDidMount(): void {
    hotkeys("space", "all", (e) => {
      e.preventDefault();
      if (this.props.running) {
        this.props.onStop(false);
      } else {
        this.props.onStart();
      }
    });

    hotkeys("shift+,", "all", (e) => {
      e.preventDefault();
      this.prevWaypoint()
    });
    hotkeys("shift+.", "all", (e) => {
      e.preventDefault();
      this.nextWaypoint()
    });
  }

  render() {
    return (
      <div className={styles.AnimationSidebar}>
        <span className={styles.PlaybackControls}>
            <IconButton className={styles.PlaybackButton} sx={{
              flexGrow: 1,
              flexShrink: 1,
              width: "100%"
            }} onClick={() => this.prevWaypoint()}><FastRewind></FastRewind></IconButton>
            <IconButton className={styles.PlaybackButton} sx={{
              flexGrow: 1,
              flexShrink: 1,
              width: "100%"
            }} color="default" onClick={() => this.togglePlayback()}>
            {this.props.running ? (
                <Pause></Pause>
            ) : (
                <PlayArrow></PlayArrow>
            )}
            </IconButton>
            <IconButton className={styles.PlaybackButton} sx={{
              flexGrow: 1,
              flexShrink: 1,
              width: "100%"
            }} onClick={() => this.stopPlayback()}><Stop></Stop></IconButton>
            <IconButton className={styles.PlaybackButton} sx={{
              flexGrow: 1,
              flexShrink: 1,
              width: "100%"
            }} onClick={() => this.nextWaypoint()}><FastForward></FastForward></IconButton>
        </span>
      </div>
    );
  }
}
export default observer(AnimationSidebar);
