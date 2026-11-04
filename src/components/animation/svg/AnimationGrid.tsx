import { observer } from "mobx-react";
import { Component } from "react";
import styles from "./AnimationGrid.module.css";

type Props = React.ComponentPropsWithoutRef<'div'>;

type State = object;

class AnimationGrid extends Component<Props, State> {
  render() {
    return (
        <div {...this.props}>
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                    <svg id="ruler" preserveAspectRatio="none" viewBox="0,0,100,100">
                        <line x1={0} x2={0} y1={10} y2={100} stroke="var(--divider-gray)" strokeWidth="2" vector-effect="non-scaling-stroke"></line>
                        <line x1={25} x2={25} y1={12} y2={100} stroke="var(--divider-gray)" strokeWidth="1" vector-effect="non-scaling-stroke"></line>
                        <line x1={50} x2={50} y1={12} y2={100} stroke="var(--divider-gray)" strokeWidth="1" vector-effect="non-scaling-stroke"></line>
                        <line x1={75} x2={75} y1={12} y2={100} stroke="var(--divider-gray)" strokeWidth="1" vector-effect="non-scaling-stroke"></line>
                    </svg>
                </defs>

                <use href="#ruler" x="0" y="0" width="20" height="100"></use>
                <use href="#ruler" x="20" y="0" width="20" height="100"></use>
                <use href="#ruler" x="40" y="0" width="20" height="100"></use>
                <use href="#ruler" x="60" y="0" width="20" height="100"></use>
                <use href="#ruler" x="80" y="0" width="20" height="100"></use>
                <line x1={100} x2={100} y1={10} y2={100} stroke="var(--divider-gray)" strokeWidth="2" vector-effect="non-scaling-stroke"></line>
            </svg>

            <span className={styles.Labels} style={{left: "0%"}}>0</span>
            <span className={styles.Labels} style={{left: "20%"}}>4</span>
            <span className={styles.Labels} style={{left: "40%"}}>8</span>
            <span className={styles.Labels} style={{left: "60%"}}>12</span>
            <span className={styles.Labels} style={{left: "80%"}}>16</span>
            <span className={styles.Labels} style={{left: "100%"}}>20</span>
        </div>
    );
  }
}
export default observer(AnimationGrid);
