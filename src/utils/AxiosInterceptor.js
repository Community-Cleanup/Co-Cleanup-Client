// Using guide from here: https://dev.to/arianhamdi/react-hooks-in-axios-interceptors-3e1h

import axios from "axios";
import { useEffect } from "react";
import { firebaseAuth } from "../auth/firebaseApp";
import { useGlobalAuthState } from "./AuthContext";

const axiosInstance = axios.create();

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
        if (error.response.status === 401) {
          alert(
            "Error: You must be signed in or authorised to access this content"
          );
        }

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

    return () => axiosInstance.interceptors.response.eject(interceptor);
    // eslint-disable-next-line
  }, []);

  return <>{children}</>;
};

export default axiosInstance;
export { AxiosInterceptor };
