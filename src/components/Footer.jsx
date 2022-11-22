import React from "react";
import { Link } from "react-router-dom";
// styled components saved in the utilities folder apply styling to containers
// styled components saved in the elements folder apply styling to individual elements like buttons etc. 
import { theme } from "./styled/theme/Theme";
import { StyledNavbar } from "./styled/utility/Navbar.styled";
import { Flex } from "./styled/utility/Flex.styled";
import { Span } from "./styled/utility/Span.styled";
import { Navigation } from "./styled/elements/Navigation.styled";
// footerLinks is an object with footer links text and url paths
import { footerLinks } from "../data/footerLinks";

function Footer() {
  // year is used to display the copyright year at the bottom
  const year = new Date().getFullYear();

  // footerLinks is mapped over to display links
  // styled components are passed props to help fine tune different css properties
  return (
    <StyledNavbar
      h="100px"
      pad="28px 12px"
      color={theme.colors.footerText}
      bg={theme.colors.footer}
    >
      <Flex>
        {footerLinks.map((link, index) => {
          return (
            <Navigation
              key={index}
              margin="0 8px 3px 20px"
              color={theme.colors.footerText}
            >
              <Link to={link.url}>{link.text}</Link>
            </Navigation>
          );
        })}
      </Flex>
      <p>
        <Span fs="12px" color={theme.colors.footerText}>
          <i className="fa-regular fa-copyright"></i> {year} Co Cleanup
        </Span>
      </p>
    </StyledNavbar>
  );
}

export default Footer;
