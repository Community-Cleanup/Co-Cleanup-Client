import React, { useState, useEffect } from "react";
import axios from "../utils/AxiosInterceptor";

import { Fieldset } from "./styled/utility/Fieldset.styled";
import { Button } from "./styled/elements/Button.styled";
import { Span } from "./styled/utility/Span.styled";
import { theme } from "./styled/theme/Theme";
import ModalConfirm from "./ModalConfirm";

import { useGlobalAuthState } from "../utils/AuthContext";

// This is the component handler to firstly display a button to assign or revoke the admin role from a user.
// On button click, a popup modal is display with to confirm the user's selection, and the change will
// only be made if the user clicks 'yes' otherwise the modal will disappear and no change will be actioned.

// This takes out 3 props:
// - The unique ID of the selected user from global auth state
// - The current admin boolean status of the selected user from global auth state
// - The current username of the selected user from global auth state
function AdminAssignAdminForm({
  foundUserUID,
  foundUserIsAdmin,
  foundUserUsername,
}) {
  // useGlobalAuthState() contains the details of the current logged in user
  const { authState } = useGlobalAuthState();

  // We want to capture the unique ID of the current logged in admin user
  const loggedInUserUID = authState.data._id;

  // Holds state of the admin boolean status of the selected user, with the intial state being the current admin boolean status of that user
  const [userIsAdminState, setUserIsAdminState] = useState(foundUserIsAdmin);
  // adminAssignModalOpen is a boolean value used to open and close the assign/revoke admin modal
  const [adminAssignModalOpen, setAdminAssignModalOpen] = useState(false);

  // This useEffect() will fire whenever userIsAdminState boolean state changes
  useEffect(() => {
    setUserIsAdminState(foundUserIsAdmin);
  }, [foundUserIsAdmin]);

  function preventChange() {
    // We don't want the current signed-in user to be able to change the isAdmin state of their own account,
    // so check the current signed-in user's unique ID with the unique ID of the selected user on this particular component instance
    return loggedInUserUID === foundUserUID ? true : false;
  }

  // Handle on clicking 'yes' to confirm the change on the popup modal
  async function handleConfirmationSubmit(e) {
    e.preventDefault();

    // Change the user's admin boolean status via our server API
    await updateAdminStatus();
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
        // Trigger the local admin boolean state accordingly
        setUserIsAdminState(false);
        // Else if the selected user is currently enabled, revert that on button submit by setting isAdmin to true
      } else if (!userIsAdminState) {
        await axios.put(
          `${process.env.REACT_APP_SERVER_URL}/api/admin/users/${foundUserUID}`,
          {
            isAdmin: true,
          }
        );
        // Trigger the local admin boolean state accordingly
        setUserIsAdminState(true);
      }
      // Hide the popup modal if successful
      setAdminAssignModalOpen(false);
    } catch (e) {
      console.log(e);
      // Hide the popup modal if there's an error
      setAdminAssignModalOpen(false);
    }
  }

  return (
    <>
      {/* On first button selection, display the modal prompting whether or not to make the change */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setAdminAssignModalOpen(true);
        }}
      >
        <Fieldset>
          {preventChange() ? (
            /* Display if the selected user is the same as the admin user viewing this page,
            inform them that they can't modify their own account status */
            <Span color={theme.colors.warningText}>
              You can't revoke admin role from your own account!
            </Span>
          ) : (
            <>
              {userIsAdminState ? (
                <>
                  {/* Before any change is made, if the selected user is currently an admin,
                display that the user is currently an admin with the appropriate message and button colour and message,
                and the appropriate text in the modal popup on button click */}
                  <Span color={theme.colors.warningText}>
                    This user <br />
                    is currently <br />
                    AN ADMIN
                  </Span>

                  <Button type="submit" bg={theme.colors.buttonThree}>
                    Revoke Admin Role
                  </Button>
                  {adminAssignModalOpen && (
                    <ModalConfirm
                      message={`You are about to REVOKE ADMIN role from this user's account: "${foundUserUsername}".`}
                      buttonYesFunction={handleConfirmationSubmit}
                      buttonYesText="Yes, revoke admin role"
                      buttonNoFunction={() => setAdminAssignModalOpen(false)}
                      buttonNoText="No, don't revoke"
                    />
                  )}
                </>
              ) : (
                <>
                  {/* Otherwise, before any change is made, if the selected user is currently NOT an admin,
                display that the user is currently not an admin with the appropriate message and button colour and message,
                and the appropriate text in the modal popup on button click */}
                  <Span color={theme.colors.okText}>
                    This user <br />
                    is currently <br />
                    NOT AN ADMIN
                  </Span>

                  <Button type="submit" bg={theme.colors.buttonTwo}>
                    Give Admin Role
                  </Button>
                  {adminAssignModalOpen && (
                    // Prompt the user in the modal whether or not to delete the comment.
                    // If 'yes' is selected, trigger the handleConfirmationSubmit function
                    <ModalConfirm
                      message={`You are about to GIVE ADMIN role to this user's account: "${foundUserUsername}".`}
                      buttonYesFunction={handleConfirmationSubmit}
                      buttonYesText="Yes, give admin role"
                      buttonNoFunction={() => setAdminAssignModalOpen(false)}
                      buttonNoText="No, don't give"
                    />
                  )}
                </>
              )}
            </>
          )}
        </Fieldset>
      </form>
    </>
  );
}

export default AdminAssignAdminForm;
