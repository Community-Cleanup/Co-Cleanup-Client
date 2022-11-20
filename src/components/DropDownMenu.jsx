import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Flex } from "./styled/utility/Flex.styled";
import { DropDown } from "./styled/utility/DropDown.styled";
import { Navigation } from "./styled/elements/Navigation.styled";
import { DropDownBtn } from "./styled/elements/DropDownBtn.styled";
import { Span } from "./styled/utility/Span.styled";
import { theme } from "./styled/theme/Theme";

function DropDownMenu(props) {
  const navigate = useNavigate();
  const linksContainerRef = useRef(null);
  const linksRef = useRef(null);

  useEffect(() => {
    const linksHeight = linksRef.current.getBoundingClientRect().height;
    if (props.showDropDownMenu) {
      linksContainerRef.current.style.height = `${linksHeight}px`;
      console.log(linksHeight);
    } else {
      linksContainerRef.current.style.height = "0px";
    }
  }, [props.showDropDownMenu]);

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
