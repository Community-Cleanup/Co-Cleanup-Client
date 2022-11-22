import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalAuthState } from "../utils/AuthContext";
// React JSX Components
import PageTitle from "./PageTitle";
import NavBar from "./NavBar";
import Footer from "./Footer";
// styled components saved in the utilities folder apply styling to containers
// styled components saved in the elements folder apply styling to individual elements like buttons etc.
import { theme } from "./styled/theme/Theme";
import { Banner } from "./styled/utility/Banner.styled";
import { Container } from "./styled/utility/Container.styled";
import { Width } from "./styled/utility/Width.styled";
import { Flex } from "./styled/utility/Flex.styled";
import { Grid } from "./styled/utility/Grid.styled";
import { Span } from "./styled/utility/Span.styled";
import { Button } from "./styled/elements/Button.styled";
import { Image } from "./styled/elements/Image.styled";
import { ImageBackground } from "./styled/elements/ImageBackground";

// The landing page is displayed on the home route "/"
function LandingPage() {
  const { authState } = useGlobalAuthState();
  const navigate = useNavigate();

  // styled components are passed props to help fine tune different css properties
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

                {/* Ternary operator to only show sign up button if no user is logged in */}
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
            </Width>

            {/* Hero Illustration Section */}
            <Width talign="center">
              <Image
                h="300px"
                br="10px"
                src="./images/photos/beach-illus.jpg"
              />
            </Width>
          </Flex>
        </Banner>

        {/* Images section */}
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
