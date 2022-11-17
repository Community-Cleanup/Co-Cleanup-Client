import React from "react";
import { Link } from "react-router-dom";
import { Container } from "./styled/utility/Container.styled";
import { Button } from "./styled/elements/Button.styled";
import { Flex } from "./styled/utility/Flex.styled";
import { Image } from "./styled/elements/Image.styled";
import { theme } from "./styled/theme/Theme";
import "./LandingPage.css";

function LandingPage() {
  return (
    <Container bg={theme.colors.container}>
      <Flex>
        <div>
          <h1>Landing Page</h1>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolor
            aliquid quasi, debitis voluptates odio asperiores voluptatem! Est
            praesentium quos, suscipit, impedit cumque, eius tenetur et sequi
            saepe aliquid rerum repellendus.
          </p>
          <Button bg={theme.colors.buttonTwo}>
            <Link to="sign-up">Sign Up</Link>
          </Button>
          <Button>
            <Link to="events">View Events</Link>
          </Button>
        </div>
        <div>
          <Image src="./images/photos/community-group.jpg" />
        </div>
      </Flex>
    </Container>
  );
}

export default LandingPage;
