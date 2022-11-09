import { Link, useNavigate } from "react-router-dom";
import { firebaseAuth } from "../firebase/firebaseApp";
import { useGlobalAuthState } from "../utils/AuthContext";

function NavBar() {
  const navigate = useNavigate();

  const { setAuthState } = useGlobalAuthState();

  async function handleLogout() {
    console.log("Logging out");
    setAuthState((prev) => {
      return {
        ...prev,
        isLoading: true,
      };
    });
    await firebaseAuth.signOut();
    setAuthState((prev) => {
      return {
        ...prev,
        isLoading: false,
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
        <li>
          <Link onClick={handleLogout}>Logout</Link>
        </li>
        <li>
          <Link to="/create-event">Create Event</Link>
        </li>
      </ul>
      <hr />
    </nav>
  );
}

export default NavBar;
