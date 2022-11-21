import { Logout } from "../auth/Logout";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGlobalAuthState } from "../utils/AuthContext";
import { useGlobalSearchContext } from "../utils/SearchContext";
import { useNavigate } from "react-router-dom";
import { useViewport } from "../utils/useViewport";
import DropDownMenu from "./DropDownMenu";
import { StyledNavbar } from "./styled/utility/Navbar.styled";
import { Flex } from "./styled/utility/Flex.styled";
import { FlexRow } from "./styled/utility/FlexRow.styled";
import { Button } from "./styled/elements/Button.styled";
import { Logo } from "./styled/elements/Logo.styled";
import { theme } from "./styled/theme/Theme";
import { Input } from "./styled/elements/Input.styled";
import { Navigation } from "./styled/elements/Navigation.styled";

function NavBar() {
  const navigate = useNavigate();
  const { searchBar, setSearchBar } = useGlobalSearchContext();
  const { authState } = useGlobalAuthState();
  const { width } = useViewport();
  const breakPoint = 900;
  const [showDropDownMenu, setShowDropDownMenu] = useState(false);

  async function handleLogout(e) {
    e.preventDefault();
    console.log("Logout button clicked, logging out");

    Logout();
    navigate("/");
    // Note that on logout, we don't need to set our React global auth state for 'authState.data' to null,
    // as this will be automatically detected and handled by our auth observer in 'utils/AuthObserver.js'
  }

  function handleFocus() {
    navigate("/events");
  }

  function handleCreateLink() {
    if (authState.data) {
      navigate("/create-event");
    } else {
      navigate("/sign-in");
    }
  }

  return (
    <StyledNavbar>
      <FlexRow align="center">
        <FlexRow align="center">
          {width < 550 ? (
            <Logo
              src="./images/logo/icon.svg"
              alt="Co Cleanup Logo"
              onClick={() => navigate("/")}
            />
          ) : (
            <Logo
              src="./images/logo/logo-icon.svg"
              alt="Co Cleanup Logo"
              onClick={() => navigate("/")}
            />
          )}
          <Input
            w="350px"
            wmobile="180px"
            placeholder="Search Events"
            onFocus={handleFocus}
            name="searchBar"
            value={searchBar}
            onChange={(e) => setSearchBar(e.target.value)}
          />
        </FlexRow>
        {width > breakPoint && (
          <div>
            <Navigation margin="0 8px 0 20px">
              <Link>About</Link>
            </Navigation>
            <Navigation margin="0 8px 0" onClick={handleCreateLink}>
              Create Event
            </Navigation>
          </div>
        )}
      </FlexRow>

      {width < breakPoint ? (
        showDropDownMenu ? (
          <i
            onClick={() => setShowDropDownMenu(false)}
            class="fa-solid fa-xl fa-xmark"
          ></i>
        ) : (
          <i
            onClick={() => setShowDropDownMenu(true)}
            className="fa-solid fa-xl fa-bars"
          ></i>
        )
      ) : !authState.data ? (
        <div>
          <Navigation margin="0 8px 0">
            <Link to="/sign-in">Sign In</Link>
          </Navigation>
          <Button bg={theme.colors.buttonTwo}>
            <Link to="/sign-up">Sign Up</Link>
          </Button>
        </div>
      ) : (
        <div>
          <Navigation margin="0 8px 0" onClick={handleLogout}>
            Sign Out
          </Navigation>
          <Button>
            <Link to={`/account/${authState.data._id}`}>My Account</Link>
          </Button>
        </div>
      )}

      <DropDownMenu
        showDropDownMenu={showDropDownMenu}
        handleCreateLink={handleCreateLink}
        authState={authState}
        handleLogout={handleLogout}
      />
    </StyledNavbar>
  );
}

export default NavBar;
