import React, { useState, useEffect } from "react";
import axios from "../utils/AxiosInterceptor";

import { Fieldset } from "./styled/utility/Fieldset.styled";
import { Button } from "./styled/elements/Button.styled";
import { Span } from "./styled/utility/Span.styled";
import { theme } from "./styled/theme/Theme";
import ModalConfirm from "./ModalConfirm";

import { useGlobalAuthState } from "../utils/AuthContext";

// This is the component handler to firstly display a button to enable or disable a user's account.
// On button click, a popup modal is display with to confirm the user's selection, and the change will
// only be made if the user clicks 'yes' otherwise the modal will disappear and no change will be actioned.

// This takes out 3 props:
// - The unique ID of the selected user from global auth state
// - The current isDisabled boolean status of the selected user from global auth state
// - The current username of the selected user from global auth state
function AdminDisableUserForm({
  foundUserUID,
  foundUserIsDisabled,
  foundUserUsername,
}) {
  // useGlobalAuthState() contains the details of the current logged in user
  const { authState } = useGlobalAuthState();

  // We want to capture the unique ID of the current logged in admin user
  const loggedInUserUID = authState.data._id;

  // Holds state of the isDisabled boolean status of the selected user, with the intial state being the current disabled or enabled boolean status of that user
  const [userIsDisabledState, setUserIsDisabledState] =
    useState(foundUserIsDisabled);
  // disableUserModalOpen is a boolean value used to open and close the enable/disable user modal
  const [disableUserModalOpen, setDisableUserModalOpen] = useState(false);

  // This useEffect() will fire whenever foundUserIsDisabled boolean state changes
  useEffect(() => {
    setUserIsDisabledState(foundUserIsDisabled);
  }, [foundUserIsDisabled]);

  function preventChange() {
    // We don't want the current signed-in user to be able to change the isDisabled state of their own account,
    // so check the current signed-in user's unique ID with the unique ID of the selected user on this particular component instance
    return loggedInUserUID === foundUserUID ? true : false;
  }

  async function handleConfirmationSubmit(e) {
    e.preventDefault();

    // Change the user's isDisabled boolean status via our server API
    await updateDisabledStatus();
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
        // Trigger the local isDisabled boolean state accordingly
        setUserIsDisabledState(false);
        // Else if the selected user is currently enabled, reverse that on button submit by setting isDisabled to true
      } else if (!userIsDisabledState) {
        await axios.put(
          `${process.env.REACT_APP_SERVER_URL}/api/admin/users/${foundUserUID}`,
          {
            isDisabled: true,
          }
        );
        // Trigger the local isDisabled boolean state accordingly
        setUserIsDisabledState(true);
      }
      // Hide the popup modal if successful
      setDisableUserModalOpen(false);
    } catch (e) {
      console.log(e);
      // Hide the popup modal if there's an error
      setDisableUserModalOpen(false);
    }
  }

  return (
    <>
      {/* On first button selection, display the modal prompting whether or not to make the change */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setDisableUserModalOpen(true);
        }}
      >
        <Fieldset>
          {preventChange() ? (
            /* Display if the selected user is the same as the admin user viewing this page,
            inform them that they can't modify their own account status */
            <Span color={theme.colors.warningText}>
              You can't disable your own user account!
            </Span>
          ) : (
            <>
              {userIsDisabledState ? (
                <>
                  {/* Before any change is made, if the selected user is currently DISABLED,
                display that the user is currently disabled with the appropriate message and button colour and message,
                and the appropriate text in the modal popup on button click */}
                  <Span color={theme.colors.warningText}>
                    This user's account <br />
                    is currently DISABLED
                  </Span>
                  <Button type="submit" bg={theme.colors.buttonTwo}>
                    Enable User
                  </Button>
                  {disableUserModalOpen && (
                    <ModalConfirm
                      message={`You are about to ENABLE this user's account: "${foundUserUsername}".`}
                      buttonYesFunction={handleConfirmationSubmit}
                      buttonYesText="Yes, enable account"
                      buttonNoFunction={() => setDisableUserModalOpen(false)}
                      buttonNoText="No, don't enable"
                    />
                  )}
                </>
              ) : (
                <>
                  {/* Otherwise, before any change is made, if the selected user is currently ENABLED,
                display that the user is currently enabled with the appropriate message and button colour and message,
                and the appropriate text in the modal popup on button click */}
                  <Span color={theme.colors.okText}>
                    This user's account <br />
                    is currently ENABLED
                  </Span>
                  <Button type="submit" bg={theme.colors.buttonThree}>
                    Disable User
                  </Button>
                  {disableUserModalOpen && (
                    // Prompt the user in the modal whether or not to delete the comment.
                    // If 'yes' is selected, trigger the handleConfirmationSubmit function
                    <ModalConfirm
                      message={`You are about to DISABLE this user's account: "${foundUserUsername}".`}
                      buttonYesFunction={handleConfirmationSubmit}
                      buttonYesText="Yes, disable account"
                      buttonNoFunction={() => setDisableUserModalOpen(false)}
                      buttonNoText="No, don't disable"
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

export default AdminDisableUserForm;
