import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
    <div>
        <h1>Event Details</h1>
        <h2>{eventDetails.title}</h2>
    </div>
  );
}

export default EventDetails;
