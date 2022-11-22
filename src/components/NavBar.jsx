import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logout } from "../auth/Logout";
// utils functions
import { useGlobalAuthState } from "../utils/AuthContext";
import { useGlobalSearchContext } from "../utils/SearchContext";
import { useViewport } from "../utils/useViewport";
// React JSX Components
import DropDownMenu from "./DropDownMenu";
// styled components saved in the utilities folder apply styling to containers
// styled components saved in the elements folder apply styling to individual elements like buttons etc.
import { StyledNavbar } from "./styled/utility/Navbar.styled";
import { FlexRow } from "./styled/utility/FlexRow.styled";
import { Button } from "./styled/elements/Button.styled";
import { Logo } from "./styled/elements/Logo.styled";
import { theme } from "./styled/theme/Theme";
import { Input } from "./styled/elements/Input.styled";
import { Navigation } from "./styled/elements/Navigation.styled";

// This component is the Navigation Bar displayed at the top of pages
function NavBar() {
  const navigate = useNavigate();
  const { authState } = useGlobalAuthState();
  // useViewPort() is a function that sets the state of width to the viewports width
  const { width } = useViewport();
  // breakpoint is the number of pixels that components will be set to change in relation to the width of the viewport
  const breakPoint = 900;
  // searchBar & set setSearchBar are deconstructed from the Global Search Context used to store the search bar input and provide it to the EventsMap component
  const { searchBar, setSearchBar } = useGlobalSearchContext();
  // showDropDownMenu is used for the drop down hamburger menu in mobile view
  const [showDropDownMenu, setShowDropDownMenu] = useState(false);

  // handleLogout() is called when the user clicks the logout button
  async function handleLogout(e) {
    e.preventDefault();
    console.log("Logout button clicked, logging out");

    Logout();
    navigate("/");
    // Note that on logout, we don't need to set our React global auth state for 'authState.data' to null,
    // as this will be automatically detected and handled by our auth observer in 'utils/AuthObserver.js'
  }

  // when the user clicks within the searchbar, they will be navigated to the Search Events Page
  function handleFocus() {
    navigate("/events");
  }

  // handleCreateLink is called when the user clicks the "Create Event" link
  // the user will be redirected to the sign in page if they are not logged in
  function handleCreateLink() {
    if (authState.data) {
      navigate("/create-event");
    } else {
      navigate("/sign-in");
    }
  }

  // styled components are passed props to help fine tune different css properties
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

      {/* Multiple ternary operators which determine if the hamburger icon is displayed based on viewport width */}
      {/* Also determines which link & buttons are displayed based on if a user is logged in or not */}
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

      {/* Drop down menu component is shown when the hamburger menu is clicked in mobile view */}
      {/* The functions passed are used for onClick() event listeners on buttons in the menu */}
      {/* authState is passed to determine which buttons are displayed based on if a user is logged in or not */}
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
