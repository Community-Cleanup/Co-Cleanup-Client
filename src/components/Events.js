import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Events.css";

function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getEvents();
  }, []);

  async function getEvents() {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/events`
      );
      setEvents(res.data);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="events-main">
      <h1>Events</h1>
      <div className="event-items">
        {events.map((event) => {
          return (
            <div
              className="event-individual"
              onClick={() => navigate(`/${event._id}`)}
            >
              <h3>{event.title}</h3>
              <h4>Date: </h4>
              <h4>{event.address}</h4>
              <p>{event.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Events;
