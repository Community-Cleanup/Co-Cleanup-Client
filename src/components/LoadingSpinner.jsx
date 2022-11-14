// A component to show an animated loading spinner graphic
// From npm package `react-loader-spinner`
// Source: https://mhnpd.github.io/react-loader-spinner/

import React from "react";
import { Circles } from "react-loader-spinner";
//import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

function LoadingSpinner() {
  return (
    <Circles
      height="80"
      width="80"
      color="var(--tw-sky-3)"
      ariaLabel="circles-loading"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
    />
  );
}

export default LoadingSpinner;
