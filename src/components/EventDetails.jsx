import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useGlobalAuthState } from "../utils/AuthContext";
import "./EventDetails.css";

function EventDetails() {
  const { event } = useParams();
  const { authState } = useGlobalAuthState();
  const [eventDetails, setEventDetails] = useState({});

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    console.log(eventDetails);
  }, [eventDetails]);

  async function getData() {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/events/${event}`
      );
      setEventDetails(res.data);
    } catch (e) {
      console.log(e);
    }
  }

  // updateEvent() function makes a request to the server to update an event in the database
  async function updateEvent(attendees) {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/events/${event}`,
        {
          attendees: attendees,
        }
      );
      console.log("Data Saved", res.status, res.data);
    } catch (e) {
      console.log(e);
    }
  }

  function handleRegistration() {
    const attendees = eventDetails.attendees;
    if (!attendees.includes(authState.data._id)) {
      attendees.push(authState.data._id);
      setEventDetails((prev) => {
        return {
          ...prev,
          attendees: attendees,
        };
      });
      updateEvent(attendees);
    }
  }

  function handleDeregister() {
    const updatedAttendees = eventDetails.attendees.filter((item) => {
      return item !== authState.data._id;
    });
    setEventDetails((prev) => {
      return {
        ...prev,
        attendees: updatedAttendees,
      };
    });
    updateEvent(updatedAttendees);
  }

  return (
    <div className="event-details-main">
      <Link to={`/${event}/update-event`}>Edit Event</Link>
      <div className="event-title-register-div">
        <h2>{eventDetails.title}</h2>
        {eventDetails.attendees &&
          (!eventDetails.attendees.includes(authState.data._id) ? (
            <button onClick={handleRegistration}>Register</button>
          ) : (
            <div>
              You are attending{" "}
              <button onClick={handleDeregister}>Deregister</button>
            </div>
          ))}
      </div>
      <h4>Date</h4>
      <h4>{eventDetails.address}</h4>
      <h4>Event Organiser</h4>
      <p>{eventDetails.username}</p>
      <h4>
        {eventDetails.attendees && eventDetails.attendees.length} Attending
      </h4>
      <h4>Description</h4>
      <p>{eventDetails.description}</p>
    </div>
  );
}

export default EventDetails;
