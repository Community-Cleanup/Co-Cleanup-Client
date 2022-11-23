import React, { useEffect } from "react";

// PageTitle component is used to add a page title to the browser tab for each page
// The PageTitle is imported and wrapped around the component which needs a page title
// the page title is passed in props
function PageTitle(props) {
  useEffect(() => {
    document.title = `Co Cleanup | ${props.title}`;
    window.scrollTo(0, 0);
    // eslint-disable-next-line
  }, []);

  return <>{props.children}</>;
}

export default PageTitle;
