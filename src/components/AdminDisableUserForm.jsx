import React, { useState, useEffect } from "react";
import axios from "../utils/AxiosInterceptor";

import LoadingSpinner from "./LoadingSpinner";

function AdminDisableUserForm({ foundUserUID, foundUserIsDisabled }) {
  // default checked radio button
  const [userIsDisabledState, setUserIsDisabledState] =
    useState(foundUserIsDisabled);

  useEffect(() => {
    setUserIsDisabledState(foundUserIsDisabled);
  }, [foundUserIsDisabled]);

  function handleFormSubmit(e) {
    e.preventDefault();

    updateDisabledStatus();
  }

  async function updateDisabledStatus() {
    try {
      // If the selected user is currently disabled, reverse that on button submit by setting isDisabled to false
      if (userIsDisabledState) {
        await axios.put(
          `${process.env.REACT_APP_SERVER_URL}/api/admin/users/${foundUserUID}`,
          {
            isDisabled: false,
          }
        );
        setUserIsDisabledState(false);
        // Else if the selected user is currently enabled, reverse that on button submit by setting isDisabled to true
      } else if (!userIsDisabledState) {
        await axios.put(
          `${process.env.REACT_APP_SERVER_URL}/api/admin/users/${foundUserUID}`,
          {
            isDisabled: true,
          }
        );
        setUserIsDisabledState(true);
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <fieldset>
          {userIsDisabledState ? (
            <>
              <p style={{ color: "red" }}>This user is currently disabled</p>
              <button type="submit">Enable User</button>
            </>
          ) : (
            <>
              <p style={{ color: "green" }}>This user is currently enabled</p>
              <button type="submit">Disable User</button>
            </>
          )}
        </fieldset>
      </form>
    </>
  );
}

export default AdminDisableUserForm;
