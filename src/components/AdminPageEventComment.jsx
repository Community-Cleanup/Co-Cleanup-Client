import React, { useState } from "react";
import axios from "../utils/AxiosInterceptor";

import LoadingSpinner from "./LoadingSpinner";
import AdminDeleteEventForm from "./AdminDeleteEventForm";
import { formatDate } from "../utils/formatDate";
import { Link } from "react-router-dom";
import AdminDeleteCommentForm from "./AdminDeleteCommentForm";

function AdminPageEventComment(props) {
  const {
    foundEventUID,
    eventCommentIndex,
    eventCommentUsername,
    eventCommentComment,
    eventCommentTime,
  } = props;
  return (
    <>
      <h4>Comment #{eventCommentIndex + 1}</h4>
      <p>{eventCommentUsername}</p>
      <p>{eventCommentComment}</p>
      <p>{formatDate(eventCommentTime)}</p>
      <AdminDeleteCommentForm
        foundEventUID={foundEventUID}
        eventCommentIndex={eventCommentIndex}
      />
    </>
  );
}

export default AdminPageEventComment;
