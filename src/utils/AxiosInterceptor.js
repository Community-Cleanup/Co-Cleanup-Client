// Using guide from here: https://dev.to/arianhamdi/react-hooks-in-axios-interceptors-3e1h

import axios from "axios";
import { useEffect } from "react";
import { firebaseAuth } from "../auth/firebaseApp";
import { useGlobalAuthState } from "./AuthContext";

const axiosInstance = axios.create();

// This interceptor componenent will wrap the app child page components on '../App.js'.
//
// This 'interceptor' feature provided by Axios, as the name suggests, intercepts in our case,
// ALL selected Axios requests (POST, PUT, etc.) that get sent up to our Server API app from any
// other app component or function to also attached the user's ID token (if exists), as a Bearer header,
// onto the requests.
// This is needed so that if this app is calling any 'protected' routes on our Server API (that is, routes that
// require the user to be authenticated and authorised), the Server API needs to have a copy of this ID token.
//
// To use this interceptor on components, instead of importing the default Axios instance with: 'import axios from "axios";'
// instead, import this with: 'import axios from "../utils/AxiosInterceptor";'

const AxiosInterceptor = ({ children }) => {
  const { setAuthState } = useGlobalAuthState();

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.request.use(
      async (config) => {
        let user = firebaseAuth.currentUser;
        let token = "";
        if (user) {
          token = `Bearer ${await user.getIdToken()}`;
        }
        config.headers.authorization = token;

        return config;
      },
      (error) => {
        console.log(error);

        return Promise.reject(error);
      }
    );
    setAuthState((prev) => {
      return {
        ...prev,
        axiosInterceptorRegistered: true,
      };
    });

    console.log("Axios interceptor component mounted");

    // Cleanup needed to remove the interceptor after each Axios request
    return () => axiosInstance.interceptors.response.eject(interceptor);
    // eslint-disable-next-line
  }, []);

  return <>{children}</>;
};

export default axiosInstance;
export { AxiosInterceptor };
