import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MapboxMap from "./MapboxMap";
import "./Events.css";

function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [geoJSON, setGeoJSON] = useState({});

  useEffect(() => {
    getEvents();
  }, []);

  useEffect(() => {
    console.log(events);
    let eventsGeoJSON = {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: events.map((item) => {
          return {
            type: "Feature",
            properties: {
              title: item.title,
              description: item.description,
            },
            geometry: {
              type: "Point",
              coordinates: item.coordinates,
            },
          };
        }),
      },
    };
    console.log(eventsGeoJSON);
    setGeoJSON(eventsGeoJSON);
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

  return (
    <div className="events-main">
      <div className="events-items-div">
        <h1>Events</h1>
        <div>
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
      <MapboxMap />
    </div>
  );
}

export default Events;
