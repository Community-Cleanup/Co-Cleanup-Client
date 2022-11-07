import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Main from "./components/Main";
import NavBar from "./components/NavBar";
import LandingPage from "./components/LandingPage";
import SignupPage from "./components/SignupPage";
import SigninPage from "./components/SigninPage";
import PageNotFound from "./components/PageNotFound";

function App() {
  // 'State' for whether or not to show the Nav Bar components, as the sign-up and sign-in pages will not show a nav bar
  // This probably needs to be in a global state so that the sign-up and sign-in routes can set this state to false
  const [showNavBar, setShowNavBar] = useState(true);

  return (
    <div>
      {showNavBar && <NavBar />}
      <Routes>
        <Route path="/" element={<Main />}>
          <Route index element={<LandingPage />} />
          <Route path="sign-up" element={<SignupPage />} />
          <Route path="sign-in" element={<SigninPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
