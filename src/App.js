import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SharedLayout from "./components/SharedLayout";
import LandingPage from "./components/LandingPage";
import SignupPage from "./components/SignupPage";
import SigninPage from "./components/SigninPage";
import Events from "./components/Events";
import EventDetails from "./components/EventDetails";
import EventForm from "./components/EventForm";
import LoadingSpinner from "./components/LoadingSpinner";

import { AuthContext } from "./utils/AuthContext";
import AuthObserver from "./utils/AuthObserver";
import { AxiosInterceptor } from "./utils/AxiosInterceptor";

function App() {
  const [authState, setAuthState] = useState({
    authObserverRegistered: false,
    data: null,
  });

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      <AuthObserver>
        {authState.authObserverRegistered ? (
          <AxiosInterceptor>
            <div>
              <Routes>
                <Route path="/" element={<SharedLayout />}>
                  <Route index element={<LandingPage />} />
                  <Route path="*" element={<Navigate to="/" />} />
                  <Route path="events" element={<Events />} />
                  <Route path="create-event" element={<EventForm />} />
                  <Route path=":event" element={<EventDetails />} />
                  <Route path=":event/update-event" element={<EventForm />} />
                </Route>
                <Route path="sign-up" element={<SignupPage />} />
                <Route path="sign-in" element={<SigninPage />} />
              </Routes>
            </div>
          </AxiosInterceptor>
        ) : (
          <div>
            <h1>Please wait</h1>
            <LoadingSpinner />
          </div>
        )}
      </AuthObserver>
    </AuthContext.Provider>
  );
}

export default App;
