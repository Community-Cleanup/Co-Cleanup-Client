import React, { useState } from "react";
import axios from "../utils/AxiosInterceptor";

import { Fieldset } from "./styled/utility/Fieldset.styled";
import { Button } from "./styled/elements/Button.styled";
import { Span } from "./styled/utility/Span.styled";
import { theme } from "./styled/theme/Theme";
import ModalConfirm from "./ModalConfirm";

// This is the component handler to firstly display a button to delete an individual comment of a particular event.
// On button click, a popup modal is display with to confirm the user's selection, and the change will
// only be made if the user clicks 'yes' otherwise the modal will disappear and no change will be actioned.

// This takes out 3 props:
// - The unique ID of the selected event
// - The index value from the .map from the immediate parent component of this component in oder that
// we know exactly which comment in an array of comments in the particular event to send up to the server API to action the deletion
// - The username of the user that made the comment so we can display their username in the popup modal on comment deletion
function AdminDeleteCommentForm({
  foundEventUID,
  eventCommentIndex,
  commentUsername,
}) {
  // Holds a boolean state of whether or not the specific comment had been deleted
  const [commentDeleted, setCommentDeleted] = useState(false);
  // deleteCommentModalOpen is a boolean value used to open and close the delete comment modal
  const [deleteCommentModalOpen, setDeleteCommentModalOpen] = useState(false);

  // Handle on clicking 'yes' to confirm the change on the popup modal
  async function handleConfirmationSubmit(e) {
    e.preventDefault();

    // Delete the specific comment via our server API based on the current event the comment belongs to, and the index
    // value of the comment in the event's comments array
    await deleteComment();
  }

  async function deleteComment() {
    try {
      // Note that we're passing the index value of the comment in the event's comments array in the request body of the event route
      await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/admin/events/${foundEventUID}`,
        { eventCommentIndex: eventCommentIndex }
      );
      // If comment deletion is successful flag the boolean state to true
      setCommentDeleted(true);
      // Hide the popup modal if successful
      setDeleteCommentModalOpen(false);
    } catch (e) {
      console.log(e);
      // Hide the popup modal if there was an error
      setDeleteCommentModalOpen(false);
    }
  }

  return (
    <>
      {/* On first button selection, display the modal prompting whether or not to make the change */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setDeleteCommentModalOpen(true);
        }}
      >
        <Fieldset>
          <>
            {commentDeleted ? (
              // If the comment was successfully deleted as per the state change, display a message about it
              <Span color={theme.colors.warningText}>Comment deleted</Span>
            ) : (
              <>
                <Button type="submit">Delete This Comment</Button>
                {deleteCommentModalOpen && (
                  // Prompt the user in the modal whether or not to delete the comment.
                  // If 'yes' is selected, trigger the handleConfirmationSubmit function
                  <ModalConfirm
                    message={`You are about to delete this comment by "${commentUsername}".`}
                    buttonYesFunction={handleConfirmationSubmit}
                    buttonYesText="Yes, delete comment"
                    buttonNoFunction={() => setDeleteCommentModalOpen(false)}
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

export default AdminDeleteCommentForm;
