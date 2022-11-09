import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import './EventDetails.css'

function EventDetails() {
  const { event } = useParams();
  const [eventDetails, setEventDetails] = useState({});

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    console.log(eventDetails);
  }, [eventDetails])

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

  return(
    <div className="event-details-main">
        <Link to={`/${event}/update-event`}>Edit Event</Link>
        <div className="event-title-register-div">
            <h2>{eventDetails.title}</h2>
            <button>Register</button>
        </div>
        <h4>Date</h4>
        <h4>{eventDetails.address}</h4>
        <h4>Description</h4>
        <p>{eventDetails.desciption}</p>
    </div>
  );
}

export default EventDetails;
