import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//import axios from "axios";
import axios from "../utils/AxiosInterceptor";

import PageTitle from "./PageTitle";
import NavBar from "./NavBar";
import Footer from "./Footer";
import ItemCard from "./ItemCard";
import ModalConfirm from "./ModalConfirm";
import { Margin } from "./styled/utility/Margin.styled";
import { Container } from "./styled/utility/Container.styled";
import { CardLg } from "./styled/utility/CardLg.styled";
import { Fieldset } from "./styled/utility/Fieldset.styled";
import { Input } from "./styled/elements/Input.styled";
import { Button } from "./styled/elements/Button.styled";
import { FormMessage } from "./styled/elements/FormMessage.styled";
import { Span } from "./styled/utility/Span.styled";
import { Flex } from "./styled/utility/Flex.styled";
import { FlexRow } from "./styled/utility/FlexRow.styled";
import { Grid } from "./styled/utility/Grid.styled";
import { theme } from "./styled/theme/Theme";

import AdminPageUsers from "./AdminPageUsers";
import AdminPageEvents from "./AdminPageEvents";

function AdminPage() {
  const navigate = useNavigate();

  const [showUsersComponents, setShowUsersComponents] = useState(false);
  const [showEventsComponents, setShowEventsComponents] = useState(false);

  useEffect(() => {
    confirmAdminUser();
    // eslint-disable-next-line
  }, []);

  async function confirmAdminUser() {
    try {
      await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/admin`);
    } catch (e) {
      console.log(e);
      navigate("/");
    }
  }

  return (
    <PageTitle title="Admin Dashboard">
      <NavBar />
      <Margin>
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

      {showUsersComponents && <AdminPageUsers />}
      {showEventsComponents && <AdminPageEvents />}
      <Footer />
    </PageTitle>
  );
}

export default AdminPage;
