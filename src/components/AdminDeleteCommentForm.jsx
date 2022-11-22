import React, { useState } from "react";
import axios from "../utils/AxiosInterceptor";

import { Fieldset } from "./styled/utility/Fieldset.styled";
import { Button } from "./styled/elements/Button.styled";
import { Span } from "./styled/utility/Span.styled";
import { theme } from "./styled/theme/Theme";
import ModalConfirm from "./ModalConfirm";

function AdminDeleteCommentForm({
  foundEventUID,
  eventCommentIndex,
  commentUsername,
  commentTime,
}) {
  const [commentDeleted, setCommentDeleted] = useState(false);
  const [deleteCommentModalOpen, setDeleteCommentModalOpen] = useState(false);

  async function handleConfirmationSubmit(e) {
    e.preventDefault();

    await deleteComment();
  }

  async function deleteComment() {
    try {
      await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/admin/events/${foundEventUID}`,
        { eventCommentIndex: eventCommentIndex }
      );
      setCommentDeleted(true);
      setDeleteCommentModalOpen(false);
    } catch (e) {
      console.log(e);
      setDeleteCommentModalOpen(false);
    }
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setDeleteCommentModalOpen(true);
        }}
      >
        <Fieldset>
          <>
            {commentDeleted ? (
              <Span color={theme.colors.warningText}>Comment deleted</Span>
            ) : (
              <>
                <Button type="submit">Delete This Comment</Button>
                {deleteCommentModalOpen && (
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
