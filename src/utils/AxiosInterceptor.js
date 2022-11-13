// Using guide from here: https://dev.to/arianhamdi/react-hooks-in-axios-interceptors-3e1h

import axios from "axios";
import { useEffect } from "react";
import { firebaseAuth } from "../firebase/firebaseApp";

const axiosInstance = axios.create();

const AxiosInterceptor = ({ children }) => {
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
          alert("You must be signed in or authorised to access this content");
        }

        return Promise.reject(error);
      }
    );

    return () => axiosInstance.interceptors.response.eject(interceptor);
  }, []);

  return <>{children}</>;
};

export default axiosInstance;
export { AxiosInterceptor };
