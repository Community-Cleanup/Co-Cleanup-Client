import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Main from "./components/Main";
import NavBar from "./components/NavBar";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import PageNotFound from "./components/PageNotFound";

function App() {
  // State on whether or not to show the Nav Bar components, as the sign-up and sign-in pages do not show a nav bar
  // This probably should be in a global state
  const [showNavBar, setShowNavBar] = useState(true);

  return (
    <div>
      {showNavBar && <NavBar />}
      <Routes>
        <Route path="/" element={<Main />}>
          <Route index element={<LandingPage />} />
          <Route path="sign-up" element={<LoginPage formType="sign-up" />} />
          <Route path="sign-in" element={<LoginPage formType="sign-in" />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
