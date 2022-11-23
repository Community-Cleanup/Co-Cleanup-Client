import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/AxiosInterceptor";

import PageTitle from "./PageTitle";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { Margin } from "./styled/utility/Margin.styled";
import { Container } from "./styled/utility/Container.styled";
import { CardLg } from "./styled/utility/CardLg.styled";
import { Button } from "./styled/elements/Button.styled";
import { Span } from "./styled/utility/Span.styled";
import { FlexRow } from "./styled/utility/FlexRow.styled";
import { theme } from "./styled/theme/Theme";

import AdminPageUsers from "./AdminPageUsers";
import AdminPageEvents from "./AdminPageEvents";

function AdminPage() {
  const navigate = useNavigate();

  // When the user first browses to the Admin Dashboard, they will see two buttons,
  // one to display the first set of components needed to display users, and one to
  // display the first set of components needed to display the events and their comments.
  // These two states hold true or false values to conditionally render either one or the other
  const [showUsersComponents, setShowUsersComponents] = useState(false);
  const [showEventsComponents, setShowEventsComponents] = useState(false);

  // This useEffect calls confirmAdminUser() once on first mount, to validate if the user
  // is indeed an administrator
  useEffect(() => {
    confirmAdminUser();
    // eslint-disable-next-line
  }, []);

  async function confirmAdminUser() {
    // Query the protected route on our server API to confirm if the current user is indeed an administrator
    try {
      await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/admin`);
    } catch (e) {
      // If not force the user back onto the Landing Page with the navigate function
      console.log(e);
      navigate("/");
    }
  }

  return (
    <PageTitle title="Admin Dashboard">
      <NavBar />
      <Margin>
        {/* The red large card display introducing the user to the Admin Dashboard page */}
        <CardLg bg={theme.colors.cardThree}>
          <h1>Admin Dashboard</h1>

          <FlexRow align="center" justify="flex-start">
            <Container w="275px" bg={theme.colors.cardThree}>
              <FlexRow justify="flex-end">
                <Span>
                  <h3>Manage Users:</h3>
                </Span>
              </FlexRow>
            </Container>
            {/* If the user clicks the button to manage users, swap the states to display the right components */}
            {/* as per described in the state comments at the top */}
            <Container w="200px" bg={theme.colors.cardThree}>
              <Button
                bg={theme.colors.buttonOne}
                onClick={(e) => {
                  setShowUsersComponents(true);
                  setShowEventsComponents(false);
                }}
              >
                Users
              </Button>
            </Container>
          </FlexRow>
          <FlexRow align="center" justify="flex-start">
            <Container w="275px" bg={theme.colors.cardThree}>
              <FlexRow justify="flex-end">
                <Span>
                  <h3>Manage Events & Comments:</h3>
                </Span>
              </FlexRow>
            </Container>
            {/* If the user clicks the button to manage events and comments, swap the states to display the right components
             as per described in the state comments at the top */}
            <Container w="200px" bg={theme.colors.cardThree}>
              <Button
                bg={theme.colors.buttonOne}
                onClick={(e) => {
                  setShowUsersComponents(false);
                  setShowEventsComponents(true);
                }}
              >
                Events & Comments
              </Button>
            </Container>
          </FlexRow>
        </CardLg>
      </Margin>

      {/* Show either the components for the user management, or the event and comments management
      depending on the states */}
      {showUsersComponents && <AdminPageUsers />}
      {showEventsComponents && <AdminPageEvents />}
      <Footer />
    </PageTitle>
  );
}

export default AdminPage;
