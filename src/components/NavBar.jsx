import Logout from "../firebase/Logout";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useGlobalAuthState } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();
  const { authState } = useGlobalAuthState();

  useEffect(() => {
    if (!authState.data) {
      navigate("/");
    }
    // eslint-disable-next-line
  }, [authState.data]);

  async function handleLogout(e) {
    e.preventDefault();
    console.log("Logout button clicked, logging out");

    Logout();
    // Note that on logout, we don't need to set our React global auth state for 'authState.data' to null,
    // as this will be automatically detected and handled by our auth observer in 'utils/AuthObserver.js'
  }

  return (
    <nav>
      {authState.data && <h3> Welcome, {authState.data.username}!</h3>}
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {!authState.data && (
          <li>
            <Link to="/sign-up">Sign Up</Link>
          </li>
        )}
        {!authState.data && (
          <li>
            <Link to="/sign-in">Sign In</Link>
          </li>
        )}
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
