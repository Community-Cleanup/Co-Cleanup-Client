import Logout from "../firebase/Logout";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalAuthState } from "../utils/AuthContext";

function LogoutButton() {
  const navigate = useNavigate();

  const { setAuthState } = useGlobalAuthState();

  useEffect(() => {
    console.log("Logging out");
    setAuthState((prev) => {
      return {
        ...prev,
        isLoading: true,
      };
    });
    Logout();
    setAuthState((prev) => {
      return {
        ...prev,
        isLoading: false,
      };
    });
    navigate("/");
  }, [navigate, setAuthState]);
}

export default LogoutButton;
