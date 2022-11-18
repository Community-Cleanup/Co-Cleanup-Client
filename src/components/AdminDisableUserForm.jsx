import React, { useState, useEffect } from "react";
import axios from "../utils/AxiosInterceptor";

import LoadingSpinner from "./LoadingSpinner";

import { useGlobalAuthState } from "../utils/AuthContext";

function AdminDisableUserForm({ foundUserUID, foundUserIsDisabled }) {
  const { authState } = useGlobalAuthState();

  const loggedInUserUID = authState.data._id;

  const [userIsDisabledState, setUserIsDisabledState] =
    useState(foundUserIsDisabled);

  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);

  useEffect(() => {
    setUserIsDisabledState(foundUserIsDisabled);
  }, [foundUserIsDisabled]);

  function preventChange() {
    // We don't want the current signed-in user to be able to change the isDisabled state of their own account,
    // so check the current signed-in user's uid with the user uid in this particular component instance
    return loggedInUserUID === foundUserUID ? true : false;
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    setShowLoadingSpinner(true);

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
      setShowLoadingSpinner(false);
    } catch (e) {
      console.log(e);
      setShowLoadingSpinner(false);
    }
  }

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <fieldset>
          {preventChange() ? (
            <h3>You can't disable your own user account!</h3>
          ) : (
            <>
              {userIsDisabledState ? (
                <>
                  <p style={{ color: "red" }}>
                    This user's account is currently DISABLED
                  </p>
                  {showLoadingSpinner ? (
                    <LoadingSpinner />
                  ) : (
                    <button type="submit">Enable User</button>
                  )}
                </>
              ) : (
                <>
                  <p style={{ color: "green" }}>
                    This user's account is currently ENABLED
                  </p>
                  {showLoadingSpinner ? (
                    <LoadingSpinner />
                  ) : (
                    <button type="submit">Disable User</button>
                  )}
                </>
              )}
            </>
          )}
        </fieldset>
      </form>
    </>
  );
}

export default AdminDisableUserForm;
