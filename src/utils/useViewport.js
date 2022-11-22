import { useState, useEffect } from "react";

// useViewPort function is used to provide the width of the viewport 
// for components that conditionally render components based on the view port width
// this is used for displaying the NavBar hamburger icon
export const useViewport = () => {
  // the windows.innerWidth is saved in state
  const [width, setWidth] = useState(window.innerWidth);

  // event listeners are added that set width state each time the window is resized
  useEffect(() => {
    const handleWindowResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  return { width };
};
