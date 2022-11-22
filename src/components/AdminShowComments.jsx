import React, { useState } from "react";

import { CardSm } from "./styled/utility/CardSm.styled";
import { Button } from "./styled/elements/Button.styled";
import { Span } from "./styled/utility/Span.styled";
import { theme } from "./styled/theme/Theme";
import { formatDate } from "../utils/formatDate";
import AdminDeleteCommentForm from "./AdminDeleteCommentForm";

function AdminShowComments({ foundEventUID, foundEventComments }) {
  const [showCommentsButtonClicked, setShowCommentsButtonClicked] =
    useState(false);

  function checkIfNoComments() {
    if (foundEventComments.length === 0) {
      return true;
    }
    return false;
  }

  return (
    <>
      {!showCommentsButtonClicked ? (
        <Button
          onClick={(e) => {
            setShowCommentsButtonClicked(true);
          }}
        >
          Show Comments
        </Button>
      ) : (
        <>
          {checkIfNoComments() ? (
            <Span>No comments on this event</Span>
          ) : (
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
