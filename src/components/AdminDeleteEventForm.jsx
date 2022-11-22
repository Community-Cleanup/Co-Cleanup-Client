import React, { useState } from "react";
import axios from "../utils/AxiosInterceptor";

import { Fieldset } from "./styled/utility/Fieldset.styled";
import { Button } from "./styled/elements/Button.styled";
import { Span } from "./styled/utility/Span.styled";
import { theme } from "./styled/theme/Theme";
import ModalConfirm from "./ModalConfirm";

function AdminDeleteEventForm({ foundEventUID, foundEventTitle }) {
  const [eventDeleted, setEventDeleted] = useState(false);

  const [deleteEventModalOpen, setDeleteEventModalOpen] = useState(false);

  async function handleConfirmationSubmit(e) {
    e.preventDefault();

    await deleteEvent();
  }

  async function deleteEvent() {
    try {
      await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/api/admin/events/${foundEventUID}`
      );
      setEventDeleted(true);
      setDeleteEventModalOpen(false);
    } catch (e) {
      console.log(e);
      setDeleteEventModalOpen(false);
    }
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setDeleteEventModalOpen(true);
        }}
      >
        <Fieldset>
          <>
            {eventDeleted ? (
              <Span color={theme.colors.warningText}>Event deleted</Span>
            ) : (
              <>
                <Button type="submit" bg={theme.colors.buttonThree}>
                  Delete This Event
                </Button>
                {deleteEventModalOpen && (
                  <ModalConfirm
                    message={`You are about to delete this event: "${foundEventTitle}".`}
                    buttonYesFunction={handleConfirmationSubmit}
                    buttonYesText="Yes, delete event"
                    buttonNoFunction={() => setDeleteEventModalOpen(false)}
                    buttonNoText="No, don't delete"
                  />
                )}
              </>
            )}
          </>
        </Fieldset>
      </form>
    </>
  );
}

export default AdminDeleteEventForm;
