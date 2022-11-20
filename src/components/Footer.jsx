import React from "react";
import { Link } from "react-router-dom";
import { StyledNavbar } from "./styled/utility/Navbar.styled";
import { Flex } from "./styled/utility/Flex.styled";
import { Span } from "./styled/utility/Span.styled";
import { theme } from "./styled/theme/Theme";
import { Navigation } from "./styled/elements/Navigation.styled";

function Footer() {
  const year = new Date().getFullYear();

  const footerLinks = [
    { text: "About", url: "/" },
    { text: "Event Guidelines", url: "/" },
    { text: "Terms of Service", url: "/" },
    { text: "Privacy Policy", url: "/" },
  ];

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
        <Span fs="12px" color={theme.colors.footerText}><i className="fa-regular fa-copyright"></i> {year} Co Cleanup</Span>
      </p>
    </StyledNavbar>
  );
}

export default Footer;
