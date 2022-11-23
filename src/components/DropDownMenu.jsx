import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
// styled components saved in the utilities folder apply styling to containers
// styled components saved in the elements folder apply styling to individual elements like buttons etc.
import { theme } from "./styled/theme/Theme";
import { Flex } from "./styled/utility/Flex.styled";
import { DropDown } from "./styled/utility/DropDown.styled";
import { Span } from "./styled/utility/Span.styled";
import { DropDownBtn } from "./styled/elements/DropDownBtn.styled";

function DropDownMenu(props) {
  const navigate = useNavigate();

  // useRef is used to reference the links container
  // and also the container which encloses those links
  // these variables will be used in the getBoundingRect function
  const linksContainerRef = useRef(null);
  const linksRef = useRef(null);

  // the dropdown menu works by having the bounding links container height set to "0px" and overflow hidden
  // in the navbar the hamburger icon is set to onClick -> setShowDropDownMenu(true)
  // then when showDropDownMenu state is updated the below useEffect is run which runs getBoundingRect()
  // getBoundingRect function gets the height of the bounding links container using the JS method .getBoundingClientRect()
  // then it changes this height from "0px" to its actual height
  // because the bouding links container now has a specified height,
  // the transition effect will work causing the dropdown menu to slide in and out
  // getBoundingRect() is necessary because for transition property to work of height or width,
  // it needs a specified height or width in px. Changin the height to "auto" or "max-content" will not allow the transition to work.
  function getBoundingRect(innerContainer, outerContainer) {
    const linksHeight = innerContainer.current.getBoundingClientRect().height;
    if (props.showDropDownMenu) {
      outerContainer.current.style.height = `${linksHeight}px`;
    } else {
      outerContainer.current.style.height = "0px";
    }
  }

  // As described above getBoudingRect() is run when the showDropDown state in the Navbar component is updated.
  useEffect(() => {
    getBoundingRect(linksRef, linksContainerRef);
    // eslint-disable-next-line
  }, [props.showDropDownMenu]);

  // ternary operators are used to show either Sign In/Sign Up links or My Account/Sign Out depending on if authState has a current user
  // styled components are passed props to help fine tune different css properties
  return (
    <DropDown ref={linksContainerRef}>
      <Flex direction="column" ref={linksRef}>
        <DropDownBtn onClick={() => navigate("/")}>Home</DropDownBtn>
        <DropDownBtn>About</DropDownBtn>

        <DropDownBtn onClick={props.handleCreateLink}>Create Event</DropDownBtn>

        {!props.authState.data ? (
          <>
            <DropDownBtn onClick={() => navigate("/sign-in")}>
              Sign In
            </DropDownBtn>
            <DropDownBtn onClick={() => navigate("/sign-up")}>
              <Span color={theme.colors.signLink}>Sign Up</Span>
            </DropDownBtn>
          </>
        ) : (
          <>
            <DropDownBtn
              onClick={() => navigate(`/account/${props.authState.data._id}`)}
            >
              My Account
            </DropDownBtn>
            <DropDownBtn onClick={props.handleLogout}>Sign Out</DropDownBtn>
          </>
        )}
      </Flex>
    </DropDown>
  );
}

export default DropDownMenu;
