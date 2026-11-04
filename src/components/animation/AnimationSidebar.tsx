import { observer } from "mobx-react";
import { Component } from "react";
import { doc, uiState } from "../../document/DocumentManager";

import styles from "./AnimationSidebar.module.css";
import Timeline from "./Timeline";
import { IconButton } from "@mui/material";
import { FastForward, FastRewind, NavigateNext, Pause, PlayArrow, Stop } from "@mui/icons-material";

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

  jumpWaypoint(forward: boolean) {
    var wt = doc.pathlist.activePath.waypointTimestamps();

    var t;
    if (forward) t = wt.find((v: number) => (v > uiState.pathAnimationTimestamp)
                              && (Math.abs(v - uiState.pathAnimationTimestamp) > 0.05));
    else t = wt.find((v: number, i: number) => (v < uiState.pathAnimationTimestamp)
                              && (wt[i + 1] > (uiState.pathAnimationTimestamp - 0.03)));

    if (t) uiState.setPathAnimationTimestamp(t);
    else uiState.setPathAnimationTimestamp(wt[wt.length - 1]);

    console.log("next waypoint");

    this.props.update();
  }

  render() {
    return (
      <div className={styles.AnimationSidebar}>
        <span className={styles.PlaybackControls}>
            <IconButton className={styles.PlaybackButton} sx={{
              flexGrow: 1,
              flexShrink: 1,
              width: "100%"
            }} onClick={() => this.jumpWaypoint(false)}><FastRewind></FastRewind></IconButton>
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
            }} onClick={() => this.jumpWaypoint(true)}><FastForward></FastForward></IconButton>
        </span>
      </div>
    );
  }
}
export default observer(AnimationSidebar);
