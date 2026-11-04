import { observer } from "mobx-react";
import { Component, useEffect } from "react";
import { doc, uiState } from "../../document/DocumentManager";
import styles from "./Timeline.module.css"
import React from "react";
import AnimationMarker from "../../assets/AnimationMarker";
import * as d3 from "d3";
import AnimationGrid from "./svg/AnimationGrid";

type Props = {
    i: number
};

type State = {
    time: number
};

class Timeline extends Component<Props, State> {

    rootRef = React.createRef<HTMLDivElement>()
    navbarRef = React.createRef<HTMLSpanElement>();
    markerRef = React.createRef<SVGSVGElement>();
    scrubBarRef = React.createRef<HTMLDivElement>();

    navbarXPositionToTimePercentage(xPos: number) : number {
        if (this.rootRef.current && this.navbarRef.current) {
            var dragPercent = 
                (xPos  - parseFloat(window.getComputedStyle(this.rootRef.current).paddingLeft))
                / this.navbarRef.current.clientWidth;
            var clampedPercent = Math.min(Math.max(dragPercent, 0), 1);
            return clampedPercent;
        }
        return 0;
    }

    setAnimationMarkerFromPercentage(percent: number) {
        if (this.markerRef.current && this.scrubBarRef.current) {
            uiState.setPathAnimationTimestamp(percent * 20);
            this.markerRef.current.style.left = (percent * 100) + "%";
            this.scrubBarRef.current.style.left = (percent * 100) + "%";
        }
    }

    moveAnimationMarker(event: any) {
        if (this.navbarRef.current) {
            var percent = this.navbarXPositionToTimePercentage(event.x);
            var snap = percent % 0.05;
            if (snap < 0.005 || snap > 0.0495) percent = Math.round(percent * 20) / 20;
            this.setAnimationMarkerFromPercentage(percent);
        }
    }

    componentDidUpdate(prevProps: object, prevState: Readonly<State>, snapshot?: any): void {
        this.setAnimationMarkerFromPercentage(uiState.pathAnimationTimestamp / 20);
    }

    componentDidMount(): void {
        if (this.rootRef.current && this.markerRef.current) {
            const markerDrag = d3
                .drag<SVGSVGElement, undefined>()
                .on("drag", (evt) => this.moveAnimationMarker(evt))
                .on("start", (evt) => this.moveAnimationMarker(evt))
                .container(this.rootRef.current);
            d3.select<SVGSVGElement, undefined>("#animationNavbar").call(markerDrag);
        }
    }

    render() {
        const activePath = doc.pathlist.activePath;
        return (
            <div ref={this.rootRef} className={styles.Timeline}>
                <AnimationGrid style={{
                    left: "20px",
                    right: "20px",
                    height: "100%",
                    position: "absolute"
                }}></AnimationGrid>
                <span ref={this.navbarRef} id="animationNavbar" className={styles.TimelineNavbar}>
                    <AnimationMarker ref={this.markerRef} className={styles.AnimationMarker}></AnimationMarker>
                </span>
                <div className={styles.PathsContainer}>
                    <div ref={this.scrubBarRef} className={styles.AnimationScrubBar}></div>
                </div>
            </div>
        );
    }
}

export default observer(Timeline);
