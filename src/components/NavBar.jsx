import { useEffect } from "react";
import Logout from "../firebase/Logout";
import { Link } from "react-router-dom";
import { useGlobalAuthState } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();
  const { authState, setAuthState } = useGlobalAuthState();

  useEffect(() => {}, [authState.data]);

  function handleLogout(e) {
    console.log("Logging out");
    setAuthState((prev) => {
      return {
        ...prev,
        isLoading: true,
      };
    });
    Logout();
    // Note that on logout, we don't need to set the below state for 'token' to null,
    // as this will be handled by the 'utils/AuthObserver.js'
    setAuthState((prev) => {
      return {
        ...prev,
        isLoading: false,
        data: null,
      };
    });
    navigate("/");
  }

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/sign-up">Sign Up</Link>
        </li>
        <li>
          <Link to="/sign-in">Sign In</Link>
        </li>
        {authState.data && (
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        )}
        <li>
          <Link to="/create-event">Create Event</Link>
        </li>
        <li>
          <Link to="/events">View Events</Link>
        </li>
      </ul>
      <hr />
    </nav>
  );
}

export default NavBar;
