import React, { useState } from "react";
import axios from "../utils/AxiosInterceptor";

import LoadingSpinner from "./LoadingSpinner";

function AdminDeleteCommentForm({ foundEventUID, eventCommentIndex }) {
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);

  const [commentDeleted, setCommentDeleted] = useState(false);

  function handleFormSubmit(e) {
    e.preventDefault();

    setCommentDeleted(false);

    setShowLoadingSpinner(true);

    deleteComment();
  }

  async function deleteComment() {
    try {
      await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/admin/events/${foundEventUID}`,
        { eventCommentIndex: eventCommentIndex }
      );
      setCommentDeleted(true);
      setShowLoadingSpinner(false);
    } catch (e) {
      console.log(e);
      setShowLoadingSpinner(false);
    }
  }

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <fieldset>
          <>
            {showLoadingSpinner ? (
              <LoadingSpinner />
            ) : commentDeleted ? (
              <p style={{ color: "red" }}>This comment has been deleted</p>
            ) : (
              <button type="submit">Delete This Comment</button>
            )}
          </>
        </fieldset>
      </form>
    </>
  );
}

export default AdminDeleteCommentForm;
