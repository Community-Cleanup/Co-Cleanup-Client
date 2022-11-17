import { Logout } from "../firebase/Logout";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useGlobalAuthState } from "../utils/AuthContext";
import { useGlobalSearchContext } from "../utils/SearchContext";
import { useNavigate } from "react-router-dom";
import { StyledNavbar } from "./styled/utility/Navbar.styled";
import { Button } from "./styled/elements/Button.styled";
import { Logo } from "./styled/elements/Logo.styled";
import { theme } from "./styled/theme/Theme";
import { Input } from "./styled/elements/Input.styled";

function NavBar() {
  const navigate = useNavigate();
  const { searchBar, setSearchBar } = useGlobalSearchContext();
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
    navigate("/");
    // Note that on logout, we don't need to set our React global auth state for 'authState.data' to null,
    // as this will be automatically detected and handled by our auth observer in 'utils/AuthObserver.js'
  }

  async function handleFocus() {
    navigate("/events");
  }

  return (
    <StyledNavbar>
      <Logo src="./images/logo/logo-icon.svg" alt="Co Cleanup Logo" />
      <Input
        placeholder="Search Events"
        onFocus={handleFocus}
        name="searchBar"
        value={searchBar}
        onChange={(e) => setSearchBar(e.target.value)}
      />
      {authState.data && <h3> Welcome, {authState.data.username}!</h3>}
      <Link to="/">Home</Link>
      {authState.data && <button onClick={handleLogout}>Logout</button>}
      {authState.data && (
        <Link to={`/account/${authState.data._id}`}>My Account</Link>
      )}
      <Link to="/create-event">Create Event</Link>
      <Link to="/events">View Events</Link>
      {!authState.data && <Link to="/sign-in">Sign In</Link>}
      {!authState.data && (
        <Button bg={theme.colors.buttonTwo}>
          <Link to="/sign-up">Sign Up</Link>
        </Button>
      )}
    </StyledNavbar>
  );
}

export default NavBar;
