import React, { useState } from "react";
import axios from "../utils/AxiosInterceptor";

import LoadingSpinner from "./LoadingSpinner";

function AdminDeleteEventForm({ foundEventUID }) {
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);

  const [eventDeleted, setEventDeleted] = useState(false);

  function handleFormSubmit(e) {
    e.preventDefault();

    setEventDeleted(false);

    setShowLoadingSpinner(true);

    deleteEvent();
  }

  async function deleteEvent() {
    try {
      await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/api/admin/events/${foundEventUID}`
      );
      setEventDeleted(true);
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
            ) : eventDeleted ? (
              <p style={{ color: "red" }}>This event has been deleted</p>
            ) : (
              <button type="submit">Delete This Event</button>
            )}
          </>
        </fieldset>
      </form>
    </>
  );
}

export default AdminDeleteEventForm;
