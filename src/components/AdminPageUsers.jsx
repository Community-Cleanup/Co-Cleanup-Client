import React, { useState } from "react";
import axios from "../utils/AxiosInterceptor";

import { Margin } from "./styled/utility/Margin.styled";
import { CardLg } from "./styled/utility/CardLg.styled";
import { Fieldset } from "./styled/utility/Fieldset.styled";
import { Input } from "./styled/elements/Input.styled";
import { Button } from "./styled/elements/Button.styled";
import { Flex } from "./styled/utility/Flex.styled";
import { Width } from "./styled/utility/Width.styled";
import { theme } from "./styled/theme/Theme";
import AdminUsersItemCard from "./AdminUsersItemCard";

import Spinner from "./Spinner";
import AdminDisableUserForm from "./AdminDisableUserForm";
import AdminAssignAdminForm from "./AdminAssignAdminForm";

function AdminPageUsers() {
  // When the user clicks the search button, this state will determine whether and when to show the
  // loading spinner icon or the search button
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);

  // For our search bar to be a controlled component, this stores the current input value onChange
  const [userSearchBar, setUserSearchBar] = useState("");
  // This will hold a copy in state all retrieved users from our server API depending on the search results
  const [foundUsers, setFoundUsers] = useState([]);
  // This will be used in conditional rendering as a boolean to determine when to show the results of the found users
  const [showFoundUserResults, setShowFoundUserResults] = useState(false);

  async function getUsers(callback) {
    // Query the route on our server API to retrieve all the users filtered by the search bar value
    try {
      const res = await axios.get(
        `${
          process.env.REACT_APP_SERVER_URL
        }/api/admin/users?filter=${userSearchBar.trim()}`
      );
      callback(res);
    } catch (e) {
      console.log(e);
      // If an error occurs, remove the loading spinner icon and display the search button again
      setShowLoadingSpinner(false);
    }
  }

  // Handle on click of the search button
  function handleUserSearchSubmit(e) {
    e.preventDefault();

    // Change the state to replace the search button with the loading spinner icon
    setShowLoadingSpinner(true);

    // If we successfully retrieve the filtered users from the server API...
    getUsers((res) => {
      // Set the found users in state
      setFoundUsers(res.data);
      // Enable the state to conditionally show the results of the users found (if any)
      setShowFoundUserResults(true);
      // Remove the loading spinner icon and display the search button again ready for the next search
      setShowLoadingSpinner(false);
    });
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
            {/* Fieldset for the search bar, search button, and the loading spinner (whether or not to display it) */}
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
                <Width>
                  <Spinner />
                </Width>
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
          {/* If we've successfully retrieved users (if any) from the server API... */}
          {showFoundUserResults &&
            /* If no users were found in the search, display this message */
            (!foundUsers.length ? (
              <p>No results found</p>
            ) : (
              /* Otherwise map through every found user object from the foundUser state,
             and generate "cards" styled components with the contents of each card being the individual user details
             passed into the card as props */
              <Flex wrap="wrap">
                {/* The two key components passed in as props to the AdminUsersItemCard component are the:
                AdminDisableUserForm component which handles the components to display the button on the card to enable/disable a user, and the
                AdminAssignAdminForm component which handles the components to display the button on the card to assign/revoke admin role from a user */}
                {foundUsers.map((foundUser, index) => {
                  return (
                    <AdminUsersItemCard
                      key={index}
                      username={foundUser.username}
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
