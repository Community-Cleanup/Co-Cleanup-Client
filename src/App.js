import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SharedLayout from "./components/SharedLayout";
import LandingPage from "./components/LandingPage";
import SignupPage from "./components/SignupPage";
import SigninPage from "./components/SigninPage";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<SharedLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
        <Route path="sign-up" element={<SignupPage />} />
        <Route path="sign-in" element={<SigninPage />} />
      </Routes>
    </div>
  );
}

export default App;
