import React from "react";
import { Link } from "react-router-dom";
import { useGlobalAuthState } from "../utils/AuthContext";
import { Banner } from "./styled/utility/Banner.styled";
import { Button } from "./styled/elements/Button.styled";
import { Flex } from "./styled/utility/Flex.styled";
import { Image } from "./styled/elements/Image.styled";
import { theme } from "./styled/theme/Theme";

function LandingPage() {
  const { authState } = useGlobalAuthState();
  return (
    <Banner bg={theme.colors.bannerOne}>
      <Flex>
        <div>
          <h1>Landing Page</h1>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolor
            aliquid quasi, debitis voluptates odio asperiores voluptatem! Est
            praesentium quos, suscipit, impedit cumque, eius tenetur et sequi
            saepe aliquid rerum repellendus.
          </p>
          {!authState.data && (
            <Button bg={theme.colors.buttonTwo}>
              <Link to="sign-up">Sign Up</Link>
            </Button>
          )}
          <Button>
            <Link to="events">View Events</Link>
          </Button>
        </div>
        <div>
          <Image src="./images/photos/community-group.jpg" />
        </div>
      </Flex>
    </Banner>
  );
}

export default LandingPage;
