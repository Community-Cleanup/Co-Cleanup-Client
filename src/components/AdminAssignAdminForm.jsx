import React, { useState, useEffect } from "react";
import axios from "../utils/AxiosInterceptor";

import { Fieldset } from "./styled/utility/Fieldset.styled";
import { Button } from "./styled/elements/Button.styled";
import { Span } from "./styled/utility/Span.styled";
import { theme } from "./styled/theme/Theme";
import ModalConfirm from "./ModalConfirm";

import { useGlobalAuthState } from "../utils/AuthContext";

function AdminAssignAdminForm({
  foundUserUID,
  foundUserIsAdmin,
  foundUserUsername,
}) {
  const { authState } = useGlobalAuthState();

  const loggedInUserUID = authState.data._id;

  const [userIsAdminState, setUserIsAdminState] = useState(foundUserIsAdmin);
  const [adminAssignModalOpen, setAdminAssignModalOpen] = useState(false);

  useEffect(() => {
    setUserIsAdminState(foundUserIsAdmin);
  }, [foundUserIsAdmin]);

  function preventChange() {
    // We don't want the current signed-in user to be able to change the isAdmin state of their own account,
    // so check the current signed-in user's uid with the user uid in this particular component instance
    return loggedInUserUID === foundUserUID ? true : false;
  }

  function handleConfirmationSubmit(e) {
    e.preventDefault();

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
      setAdminAssignModalOpen(false);
    } catch (e) {
      console.log(e);
      setAdminAssignModalOpen(false);
    }
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setAdminAssignModalOpen(true);
        }}
      >
        <Fieldset>
          {preventChange() ? (
            <Span color={theme.colors.warningText}>
              You can't revoke admin role from your own account!
            </Span>
          ) : (
            <>
              {userIsAdminState ? (
                <>
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
                  <Span color={theme.colors.okText}>
                    This user <br />
                    is currently <br />
                    NOT AN ADMIN
                  </Span>

                  <Button type="submit" bg={theme.colors.buttonTwo}>
                    Give Admin Role
                  </Button>
                  {adminAssignModalOpen && (
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
