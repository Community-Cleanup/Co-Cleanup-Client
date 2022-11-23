import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import SignupPage from "./components/SignupPage";
import SigninPage from "./components/SigninPage";
import EventsMap from "./components/EventsMap";
import EventDetails from "./components/EventDetails";
import EventForm from "./components/EventForm";
import LoadingSpinner from "./components/LoadingSpinner";
import UserAccount from "./components/UserAccount";
import AdminPage from "./components/AdminPage";
import AboutPolicy from "./components/AboutPolicy";
import Guidelines from "./components/Guidelines";

import { AuthContext } from "./utils/AuthContext";
import AuthObserver from "./auth/AuthObserver";
import { AxiosInterceptor } from "./utils/AxiosInterceptor";
import { SearchProvider } from "./utils/SearchContext";

import { ThemeProvider } from "styled-components";
import GlobalStyles from "./components/styled/theme/Global";
import { theme } from "./components/styled/theme/Theme";

import { aboutPolicies } from "./data/aboutPolicies";

function App() {
  // This global state is used by the authentication ('auth') system,
  // held in React Context in './utils/AuthContext.js' for easy access.
  const [authState, setAuthState] = useState({
    authObserverRegistered: false, // Raises to true when our auth observer/listener component is registered
    authObserverError: null,
    axiosInterceptorRegistered: false, // Raises to true when Axios has been established
    data: null, // Very important. This 'data' property in the state will hold the exact response object of
    // a signed in user's MongoDB document (if any) primarily used for conditional rendering on React.
  });

  // It is necessary for the auth global state, the Axios interceptor,
  // and the auth observer/listener component, to all be registered before the render of any webpage,
  // As such, conditional rendering below will load a loading page until such an occurance
  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      <AuthObserver>
        <ThemeProvider theme={theme}>
          <SearchProvider>
            <GlobalStyles />
            {authState.authObserverRegistered ? (
              <AxiosInterceptor>
                {authState.axiosInterceptorRegistered && (
                  <div>
                    <Routes>
                      <Route path="/" element={<LandingPage />} />
                      <Route path="events" element={<EventsMap />} />
                      <Route path="create-event" element={<EventForm />} />
                      <Route path=":event" element={<EventDetails />} />
                      <Route
                        path=":event/update-event"
                        element={<EventForm />}
                      />
                      <Route path="admin" element={<AdminPage />} />
                      <Route path="account/:user" element={<UserAccount />} />
                      <Route path="sign-up" element={<SignupPage />} />
                      <Route path="sign-in" element={<SigninPage />} />
                      {/* the following routes all use the same AboutPolicy component */}
                      {/* props passes the data which is imported from aboutPolicies.js */}
                      <Route
                        path="about"
                        element={
                          <AboutPolicy
                            heading={aboutPolicies.about.heading}
                            text={aboutPolicies.about.text}
                          />
                        }
                      />
                      <Route path="guidelines" element={<Guidelines />} />
                      <Route
                        path="privacy"
                        element={
                          <AboutPolicy
                            heading={aboutPolicies.privacy.heading}
                            text={aboutPolicies.privacy.text}
                          />
                        }
                      />
                      {/* Rather than a 404 page not found, redirect unhandled paths back to the landing page */}
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                  </div>
                )}
              </AxiosInterceptor>
            ) : (
              <LoadingSpinner />
            )}
          </SearchProvider>
        </ThemeProvider>
      </AuthObserver>
    </AuthContext.Provider>
  );
}

export default App;
