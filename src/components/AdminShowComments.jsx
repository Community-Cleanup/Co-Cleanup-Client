import React, { useState } from "react";

import { CardSm } from "./styled/utility/CardSm.styled";
import { Button } from "./styled/elements/Button.styled";
import { Span } from "./styled/utility/Span.styled";
import { theme } from "./styled/theme/Theme";
import { formatDate } from "../utils/formatDate";
import AdminDeleteCommentForm from "./AdminDeleteCommentForm";

// This is a nested component to display small "cards" as styled components for each individual comment for a specific event.
// These small cards are nested inside the larger "card" styled component from './AdminEventsItemCard.jsx'.
// On button click, a popup modal is display with to confirm the user's selection, and the change will
// only be made if the user clicks 'yes' otherwise the modal will disappear and no change will be actioned.

// This takes out 2 props:
// - The unique ID of the specific event the comments belong to
// - The array of comments from this specific event
function AdminShowComments({ foundEventUID, foundEventComments }) {
  // This state boolean keeps track of whether the button to show the comments is clicked
  // and to display the comments accordingly (if any)
  const [showCommentsButtonClicked, setShowCommentsButtonClicked] =
    useState(false);

  // This function will be called if the specific event has no comments for it,
  // so that an appropriate message can be displayed
  function checkIfNoComments() {
    if (foundEventComments.length === 0) {
      return true;
    }
    return false;
  }

  return (
    <>
      {!showCommentsButtonClicked ? (
        // Show the button to show all comments for the event if the button hasn't yet been clicked
        <Button
          onClick={(e) => {
            setShowCommentsButtonClicked(true);
          }}
        >
          Show Comments
        </Button>
      ) : (
        <>
          {/* Otherwise, show all the comments (if any) as small nested cards */}
          {checkIfNoComments() ? (
            // Display a message if the specific event has no comments at all
            <Span>No comments on this event</Span>
          ) : (
            // Otherwise, map through every comment from the foundEventComments prop,
            // and display a small card for each comment with the comment username, time, and the
            // AdminDeleteCommentForm component that will display the components, including the delete button and the modal,
            // to delete the specific comment
            foundEventComments.map((comment, index) => {
              return (
                <>
                  <CardSm maxw="100%" bord="1px solid black">
                    <Span fs="14px" fw="600">
                      {comment.username}
                    </Span>
                    <Span
                      fs="12px"
                      fw="600"
                      tf="uppercase"
                      color={theme.colors.dateText}
                    >
                      {formatDate(comment.time)}
                    </Span>
                    <Span fs="12px">{comment.comment}</Span>
                    {/* Note that we need to pass in the "index" from this .map callback as a prop below
                    so that this nested component knows which delete button, modal and delete handlers that this
                    comment belongs to */}
                    <AdminDeleteCommentForm
                      foundEventUID={foundEventUID}
                      eventCommentIndex={index}
                      commentUsername={comment.username}
                      commentTime={comment.time}
                    />
                  </CardSm>
                </>
              );
            })
          )}
        </>
      )}
    </>
  );
}

export default AdminShowComments;
