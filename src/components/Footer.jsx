import React from "react";
import { Link } from "react-router-dom";
import { StyledNavbar } from "./styled/utility/Navbar.styled";
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
      pad="0 28px"
      color={theme.colors.footerText}
      bg={theme.colors.footer}
    >
      <div>
        {footerLinks.map((link, index) => {
          return (
            <Navigation
              key={index}
              margin="0 8px 0 20px"
              color={theme.colors.footerText}
            >
              <Link to={link.url}>{link.text}</Link>
            </Navigation>
          );
        })}
      </div>
      <p>
        <i className="fa-regular fa-copyright"></i> {year} Co Cleanup
      </p>
    </StyledNavbar>
  );
}

export default Footer;
