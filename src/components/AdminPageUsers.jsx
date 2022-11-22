import React, { useState } from "react";
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
import AdminUsersItemCard from "./AdminUsersItemCard";

import LoadingSpinner from "./LoadingSpinner";
import AdminDisableUserForm from "./AdminDisableUserForm";
import AdminAssignAdminForm from "./AdminAssignAdminForm";

function AdminPageUsers() {
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);

  const [userSearchBar, setUserSearchBar] = useState("");
  const [foundUsers, setFoundUsers] = useState([]);
  const [showFoundUserResults, setShowFoundUserResults] = useState(false);

  async function getUsers(callback) {
    try {
      const res = await axios.get(
        `${
          process.env.REACT_APP_SERVER_URL
        }/api/admin/users?filter=${userSearchBar.trim()}`
      );
      callback(res);
    } catch (e) {
      console.log(e);
      setShowLoadingSpinner(false);
    }
  }

  function handleUserSearchSubmit(e) {
    e.preventDefault();

    setShowLoadingSpinner(true);

    getUsers((res) => {
      setFoundUsers(res.data);
      setShowFoundUserResults(true);
      setShowLoadingSpinner(false);
    });

    //setShowLoadingSpinner(false);
    console.log(foundUsers);
  }

  return (
    <>
      <Margin>
        <CardLg bg={theme.colors.cardOne}>
          <form onSubmit={handleUserSearchSubmit}>
            <h3>
              Search for any registered user(s) by their username or email
              address:
            </h3>
            <h3>(Leave blank to see all users)</h3>
            <Fieldset>
              <Input
                w="30%"
                type="text"
                placeholder="Search for users"
                name="userSearchBar"
                value={userSearchBar}
                onChange={(e) => setUserSearchBar(e.target.value)}
              />
              {showLoadingSpinner ? (
                <LoadingSpinner />
              ) : (
                <Button
                  bg={theme.colors.buttonOne}
                  margin="0 0 0 1px"
                  type="submit"
                  value="Search Users"
                  id="submit"
                >
                  Search Users
                </Button>
              )}
            </Fieldset>
          </form>
        </CardLg>
        <CardLg bg={theme.colors.cardOne}>
          {showFoundUserResults &&
            (!foundUsers.length ? (
              <p>No results found</p>
            ) : (
              <Flex wrap="wrap">
                {foundUsers.map((foundUser, index) => {
                  return (
                    <AdminUsersItemCard
                      key={index}
                      title={foundUser.username}
                      email={foundUser.email}
                      adminDisableUserForm={
                        <AdminDisableUserForm
                          foundUserUID={foundUser._id}
                          foundUserIsDisabled={foundUser.isDisabled}
                          foundUserUsername={foundUser.username}
                        />
                      }
                      adminAssignAdminForm={
                        <AdminAssignAdminForm
                          foundUserUID={foundUser._id}
                          foundUserIsAdmin={foundUser.isAdmin}
                          foundUserUsername={foundUser.username}
                        />
                      }
                    />
                  );
                })}
              </Flex>
            ))}
        </CardLg>
      </Margin>
    </>
  );
}

export default AdminPageUsers;
