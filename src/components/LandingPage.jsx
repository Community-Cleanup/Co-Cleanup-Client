import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalAuthState } from "../utils/AuthContext";
import PageTitle from "./PageTitle";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { Banner } from "./styled/utility/Banner.styled";
import { Container } from "./styled/utility/Container.styled";
import { Button } from "./styled/elements/Button.styled";
import { Flex } from "./styled/utility/Flex.styled";
import { Span } from "./styled/utility/Span.styled";
import { Image } from "./styled/elements/Image.styled";
import { theme } from "./styled/theme/Theme";

function LandingPage() {
  const { authState } = useGlobalAuthState();
  const navigate = useNavigate();
  return (
    <PageTitle title="Home">
      <NavBar />
      <Flex
        direction="column"
        align="none"
        justify="space-between"
        minh="100vh"
      >
        <Banner bg={theme.colors.bannerOne}>
          <Flex>
            <div>
              <h1>
                <Span fs="40px">Co Cleanup</Span>
              </h1>
              <p>
                <Span fs="18px">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Dolor aliquid quasi, debitis voluptates odio asperiores
                  voluptatem! Est praesentium quos, suscipit, impedit cumque,
                  eius tenetur et sequi saepe aliquid rerum repellendus.
                </Span>
              </p>
              <div>
                <Button
                  w="130px"
                  margin="32px 16px 0 0"
                  onClick={() => navigate("/events")}
                >
                  View Events
                </Button>
                {!authState.data && (
                  <Button
                    w="130px"
                    margin="32px 0 0"
                    bg={theme.colors.buttonTwo}
                  >
                    <Link to="sign-up">Sign Up</Link>
                  </Button>
                )}
              </div>
            </div>
            <div>
              <Image
                margin="0 0 0 64px"
                src="./images/photos/community-group.jpg"
              />
            </div>
          </Flex>
        </Banner>
        <Container h="200px"></Container>
        <Footer />
      </Flex>
    </PageTitle>
  );
}

export default LandingPage;
