import * as React from "react";
import { SvgIcon as MuiSvgIcon, SvgIconProps, styled } from "@mui/material";
const SvgIcon = styled(MuiSvgIcon, {
  name: "MopeimIcon",
  shouldForwardProp: (prop) => prop !== "fill"
})<SvgIconProps>(() => ({
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: "2.25px"
}));

const AnimationMarker: React.FunctionComponent<SvgIconProps> = (props) => {
  return (
    <SvgIcon
      viewBox="0 0 32 24"
      focusable="false"
      aria-hidden="true"
      {...props}
    >
      <path d="M 24 6 H 8 V 18 L 16 28 L 24 18 Z" fill="currentColor"/>
    </SvgIcon>
  );
};
export default AnimationMarker;
