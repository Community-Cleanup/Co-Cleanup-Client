import React, { useState, useEffect } from "react";
import axios from "../utils/AxiosInterceptor";

import { Margin } from "./styled/utility/Margin.styled";
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
import ModalConfirm from "./ModalConfirm";

import { useGlobalAuthState } from "../utils/AuthContext";

function AdminDisableUserForm({
  foundUserUID,
  foundUserIsDisabled,
  foundUserUsername,
}) {
  const { authState } = useGlobalAuthState();

  const loggedInUserUID = authState.data._id;

  const [userIsDisabledState, setUserIsDisabledState] =
    useState(foundUserIsDisabled);
  const [disableUserModalOpen, setDisableUserModalOpen] = useState(false);

  useEffect(() => {
    setUserIsDisabledState(foundUserIsDisabled);
  }, [foundUserIsDisabled]);

  function preventChange() {
    // We don't want the current signed-in user to be able to change the isDisabled state of their own account,
    // so check the current signed-in user's uid with the user uid in this particular component instance
    return loggedInUserUID === foundUserUID ? true : false;
  }

  async function handleConfirmationSubmit(e) {
    e.preventDefault();

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
      setDisableUserModalOpen(false);
    } catch (e) {
      console.log(e);
      setDisableUserModalOpen(false);
    }
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setDisableUserModalOpen(true);
        }}
      >
        <Fieldset>
          {preventChange() ? (
            <Span color={theme.colors.warningText}>
              You can't disable your own user account!
            </Span>
          ) : (
            <>
              {userIsDisabledState ? (
                <>
                  <Span color={theme.colors.warningText}>
                    This user's account <br />
                    is currently DISABLED
                  </Span>
                  <Button type="submit" bg={theme.colors.buttonTwo}>
                    Enable User
                  </Button>
                  {disableUserModalOpen && (
                    <ModalConfirm
                      message={`You are about to ENABLE this user's account: ${foundUserUsername}.`}
                      buttonYesFunction={handleConfirmationSubmit}
                      buttonYesText="Yes, enable account"
                      buttonNoFunction={() => setDisableUserModalOpen(false)}
                      buttonNoText="No, don't enable"
                    />
                  )}
                </>
              ) : (
                <>
                  <Span color={theme.colors.okText}>
                    This user's account <br />
                    is currently ENABLED
                  </Span>
                  <Button type="submit" bg={theme.colors.buttonThree}>
                    Disable User
                  </Button>
                  {disableUserModalOpen && (
                    <ModalConfirm
                      message={`You are about to DISABLE this user's account: ${foundUserUsername}.`}
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
