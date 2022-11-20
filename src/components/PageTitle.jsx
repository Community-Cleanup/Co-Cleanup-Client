import React, { useEffect } from "react";

function PageTitle(props) {
  useEffect(() => {
    document.title = `Co Cleanup | ${props.title}`;
    window.scrollTo(0, 0);
  }, []);

  return <>{props.children}</>;
}

export default PageTitle;
