import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SharedLayout from "./components/SharedLayout";
import LandingPage from "./components/LandingPage";
import SignupPage from "./components/SignupPage";
import SigninPage from "./components/SigninPage";
import EventForm from "./components/EventForm";

import { AuthContext } from "./utils/AuthContext";
import AuthObserver from "./utils/AuthObserver";

function App() {
  const [authState, setAuthState] = useState({
    isLoading: false,
  });

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      <AuthObserver>
        <div>
          <Routes>
            <Route path="/" element={<SharedLayout />}>
              <Route index element={<LandingPage />} />
              <Route path="*" element={<Navigate to="/" />} />
              <Route path="create-event" element={<EventForm />} />
              <Route path=":event/update-event" element={<EventForm />} />
            </Route>
            <Route path="sign-up" element={<SignupPage />} />
            <Route path="sign-in" element={<SigninPage />} />
          </Routes>
        </div>
      </AuthObserver>
    </AuthContext.Provider>
  );
}

export default App;
