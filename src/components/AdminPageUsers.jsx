import React, { useState } from "react";
import axios from "../utils/AxiosInterceptor";

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
      <form onSubmit={handleUserSearchSubmit}>
        <h3>
          Search for any registered user(s) by their username or email address:
        </h3>
        <h3>(leave blank to see all users)</h3>
        <fieldset>
          <input
            type="text"
            placeholder="Search for users"
            name="userSearchBar"
            value={userSearchBar}
            onChange={(e) => setUserSearchBar(e.target.value)}
          />
          {showLoadingSpinner ? (
            <LoadingSpinner />
          ) : (
            <input type="submit" value="Search Users" id="submit" />
          )}
        </fieldset>
      </form>
      {showFoundUserResults &&
        (!foundUsers.length ? (
          <p>No results found</p>
        ) : (
          <ul>
            {foundUsers.map((foundUser, index) => {
              return (
                <div key={index}>
                  <br />
                  <li>
                    Username: {foundUser.username}
                    <br />
                    Email: {foundUser.email}
                    <br />
                    <AdminDisableUserForm
                      foundUserUID={foundUser._id}
                      foundUserIsDisabled={foundUser.isDisabled}
                    />
                    <AdminAssignAdminForm
                      foundUserUID={foundUser._id}
                      foundUserIsAdmin={foundUser.isAdmin}
                    />
                  </li>
                </div>
              );
            })}
          </ul>
        ))}
    </>
  );
}

export default AdminPageUsers;
