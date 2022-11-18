import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SharedLayout from "./components/SharedLayout";
import LandingPage from "./components/LandingPage";
import SignupPage from "./components/SignupPage";
import SigninPage from "./components/SigninPage";
import EventsMap from "./components/EventsMap";
import EventDetails from "./components/EventDetails";
import EventForm from "./components/EventForm";
import LoadingSpinner from "./components/LoadingSpinner";
import UserAccount from "./components/UserAccount";

import { AuthContext } from "./utils/AuthContext";
import AuthObserver from "./utils/AuthObserver";
import { AxiosInterceptor } from "./utils/AxiosInterceptor";
import { SearchProvider } from "./utils/SearchContext";

import { ThemeProvider } from "styled-components";
import GlobalStyles from "./components/styled/theme/Global";
import { theme } from "./components/styled/theme/Theme";

function App() {
  const [authState, setAuthState] = useState({
    authObserverRegistered: false,
    authObserverError: null,
    data: null,
  });

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      <AuthObserver>
        <ThemeProvider theme={theme}>
          <SearchProvider>
            <GlobalStyles />
            {authState.authObserverRegistered ? (
              <AxiosInterceptor>
                <div>
                  <Routes>
                    <Route index element={<LandingPage />} />
                    <Route path="*" element={<Navigate to="/" />} />
                    <Route path="events" element={<EventsMap />} />
                    <Route path="create-event" element={<EventForm />} />
                    <Route path=":event" element={<EventDetails />} />
                    <Route path=":event/update-event" element={<EventForm />} />
                    <Route path="account/:user" element={<UserAccount />} />
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
          </SearchProvider>
        </ThemeProvider>
      </AuthObserver>
    </AuthContext.Provider>
  );
}

export default App;
