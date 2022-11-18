import React, { useState, useEffect } from "react";
import axios from "../utils/AxiosInterceptor";

import LoadingSpinner from "./LoadingSpinner";

import { useGlobalAuthState } from "../utils/AuthContext";

function AdminAssignAdminForm({ foundUserUID, foundUserIsAdmin }) {
  const { authState } = useGlobalAuthState();

  const loggedInUserUID = authState.data._id;

  const [userIsAdminState, setUserIsAdminState] = useState(foundUserIsAdmin);

  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);

  useEffect(() => {
    setUserIsAdminState(foundUserIsAdmin);
  }, [foundUserIsAdmin]);

  function preventChange() {
    // We don't want the current signed-in user to be able to change the isAdmin state of their own account,
    // so check the current signed-in user's uid with the user uid in this particular component instance
    return loggedInUserUID === foundUserUID ? true : false;
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    setShowLoadingSpinner(true);

    updateAdminStatus();
  }

  async function updateAdminStatus() {
    try {
      // If the selected user is currently an admin, revert that on button submit by setting isAdmin to false
      if (userIsAdminState) {
        await axios.put(
          `${process.env.REACT_APP_SERVER_URL}/api/admin/users/${foundUserUID}`,
          {
            isAdmin: false,
          }
        );
        setUserIsAdminState(false);
        // Else if the selected user is currently enabled, revert that on button submit by setting isAdmin to true
      } else if (!userIsAdminState) {
        await axios.put(
          `${process.env.REACT_APP_SERVER_URL}/api/admin/users/${foundUserUID}`,
          {
            isAdmin: true,
          }
        );
        setUserIsAdminState(true);
      }
      setShowLoadingSpinner(false);
    } catch (e) {
      console.log(e);
      setShowLoadingSpinner(false);
    }
  }

  return (
    <>
      {/* <p>loggedInUserUID is {loggedInUserUID}</p>
      <p>foundUserUID is {foundUserUID}</p> */}
      <form onSubmit={handleFormSubmit}>
        <fieldset>
          {preventChange() ? (
            <h3>You can't revoke admin role from your own account!</h3>
          ) : (
            <>
              {userIsAdminState ? (
                <>
                  <p style={{ color: "green" }}>
                    This user is currently AN ADMIN
                  </p>
                  {showLoadingSpinner ? (
                    <LoadingSpinner />
                  ) : (
                    <button type="submit">Revoke Admin Role</button>
                  )}
                </>
              ) : (
                <>
                  <p style={{ color: "blue" }}>
                    This user is currently NOT AN ADMIN
                  </p>
                  {showLoadingSpinner ? (
                    <LoadingSpinner />
                  ) : (
                    <button type="submit">Give Admin Role</button>
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

export default AdminAssignAdminForm;
