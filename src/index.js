import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // Had to comment out 'StrictMode' whilst working in development environment,
  // as this causes some React components to re-render twice, even when in a useEffect with
  // an empty dependency array.
  // See this user's post: https://github.com/axios/axios/issues/2825#issuecomment-784264784
  // Leaving StrictMode off doesn't seem to negatively impact production, so should be safe to leave disabled for now
  // <React.StrictMode>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  //</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
