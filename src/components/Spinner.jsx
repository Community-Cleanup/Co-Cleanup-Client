// A component to show an animated loading spinner graphic
// From npm package `react-loader-spinner`
// Source: https://mhnpd.github.io/react-loader-spinner/

import React from "react";
import { ColorRing } from "react-loader-spinner";
import { theme } from "./styled/theme/Theme";
//import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

function Spinner() {
  return (
    <ColorRing
      visible={true}
      height="60"
      width="60"
      ariaLabel="blocks-loading"
      wrapperStyle={{}}
      wrapperClass="blocks-wrapper"
      colors={[
        theme.colors.signLink,
        theme.colors.signLink,
        theme.colors.signLink,
      ]}
    />
  );
}

export default Spinner;
