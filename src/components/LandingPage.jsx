import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalAuthState } from "../utils/AuthContext";
import PageTitle from "./PageTitle";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { Banner } from "./styled/utility/Banner.styled";
import { Container } from "./styled/utility/Container.styled";
import { Width } from "./styled/utility/Width.styled";
import { Button } from "./styled/elements/Button.styled";
import { Flex } from "./styled/utility/Flex.styled";
import { Grid } from "./styled/utility/Grid.styled";
import { Span } from "./styled/utility/Span.styled";
import { Image } from "./styled/elements/Image.styled";
import { ImageBackground } from "./styled/elements/ImageBackground";
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
          <Flex justify="space-between">
            <Width>
              <h1>
                <Span fs="40px">Co Cleanup</Span>
              </h1>
              <p>
                <Span fs="18px">
                  Aiming to help communities coordinate natural disaster clean
                  up efforts.
                </Span>
              </p>
              <div>
                <Button
                  w="130px"
                  margin="32px 16px 32px 0"
                  onClick={() => navigate("/events")}
                >
                  View Events
                </Button>
                {!authState.data && (
                  <Button
                    onClick={() => navigate("/sign-up")}
                    w="130px"
                    margin="32px 0 0"
                    bg={theme.colors.buttonTwo}
                  >
                    Sign Up
                  </Button>
                )}
              </div>
            </Width>
            <Width>
              <Image
                h="300px"
                br="10px"
                src="./images/photos/beach-illus.jpg"
              />
            </Width>
          </Flex>
        </Banner>
        <Container w="100%" pad="0 2%" margin="0 auto">
          <Grid justifycontent="center">
            <ImageBackground url="./images/photos/rubbish-pickup.jpg" />
            <ImageBackground url="./images/photos/flooding.jpg" />
            <ImageBackground url="./images/photos/community-group.jpg" />
            <ImageBackground url="./images/photos/house.jpg" />
          </Grid>
        </Container>
        <Footer />
      </Flex>
    </PageTitle>
  );
}

export default LandingPage;
