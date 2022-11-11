import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MapboxMap from "./MapboxMap";
import "./Events.css";

function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [searchBar, setSearchBar] = useState("");
  const [searchedEvents, setSearchedEvents] = useState(events);

  useEffect(() => {
    getEvents();
  }, []);

  useEffect(() => {
    console.log("Initial", events);
  }, [events]);

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

  const filterEvents = () => {
    return events.filter((event) => {
      return event.title.toLowerCase().includes(searchBar.toLowerCase());
    });
  };

  useEffect(() => {
    setSearchedEvents(filterEvents());
  }, [events]);

  useEffect(() => {
    setSearchedEvents(filterEvents());
  }, [searchBar]);

  return (
    <div className="events-main">
      <div className="events-items-div">
        <h1>Events</h1>
        <input
          type="text"
          placeholder="Search Events"
          name="searchBar"
          value={searchBar}
          onChange={(e) => setSearchBar(e.target.value)}
        />
        <div>
          {searchedEvents.map((event) => {
            return (
              <div
                className="event-individual"
                onClick={() => navigate(`/${event._id}`)}
                key={event._id}
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
      <MapboxMap searchedEvents={searchedEvents} />
    </div>
  );
}

export default Events;
