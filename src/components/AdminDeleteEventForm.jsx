import React, { useState } from "react";
import axios from "../utils/AxiosInterceptor";

import { Fieldset } from "./styled/utility/Fieldset.styled";
import { Button } from "./styled/elements/Button.styled";
import { Span } from "./styled/utility/Span.styled";
import { theme } from "./styled/theme/Theme";
import ModalConfirm from "./ModalConfirm";

// This is the component handler to firstly display a button to delete particular event, including all of its comments (if any).
// On button click, a popup modal is display with to confirm the user's selection, and the change will
// only be made if the user clicks 'yes' otherwise the modal will disappear and no change will be actioned.

// This takes out 2 props:
// - The unique ID of the selected event
// - The title string of the selected event the title in the popup modal on event deletion
function AdminDeleteEventForm({ foundEventUID, foundEventTitle }) {
  // Holds a boolean state of whether or not the specific event had been deleted
  const [eventDeleted, setEventDeleted] = useState(false);
  // deleteEventModalOpen is a boolean value used to open and close the delete event modal
  const [deleteEventModalOpen, setDeleteEventModalOpen] = useState(false);

  // Handle on clicking 'yes' to confirm the change on the popup modal
  async function handleConfirmationSubmit(e) {
    e.preventDefault();

    // Delete the specific event via our server API based on the selected event unique ID
    await deleteEvent();
  }

  async function deleteEvent() {
    try {
      await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/api/admin/events/${foundEventUID}`
      );
      // If event deletion is successful flag the boolean state to true
      setEventDeleted(true);
      // Hide the popup modal if successful
      setDeleteEventModalOpen(false);
    } catch (e) {
      console.log(e);
      // Hide the popup modal if there was an error
      setDeleteEventModalOpen(false);
    }
  }

  return (
    <>
      {/* On first button selection, display the modal prompting whether or not to make the change */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setDeleteEventModalOpen(true);
        }}
      >
        <Fieldset>
          <>
            {eventDeleted ? (
              // If the event was successfully deleted as per the state change, display a message about it
              <Span color={theme.colors.warningText}>Event deleted</Span>
            ) : (
              <>
                <Button type="submit" bg={theme.colors.buttonThree}>
                  Delete This Event
                </Button>
                {deleteEventModalOpen && (
                  // Prompt the user in the modal whether or not to delete the event.
                  // If 'yes' is selected, trigger the handleConfirmationSubmit function
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
