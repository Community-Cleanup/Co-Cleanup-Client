import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import { useGlobalAuthState } from "../utils/AuthContext";
import { formatDate } from "../utils/formatDate";
import { timeAgo } from "../utils/timeAgo";
import NavBar from "./NavBar";
import "./EventDetails.css";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;

function EventDetails() {
  const { event } = useParams();
  const { authState } = useGlobalAuthState();
  const [eventDetails, setEventDetails] = useState({});
  const [commentInput, setCommentInput] = useState("");

  const dateString = formatDate(eventDetails.date);

  //The mapContainer useRef specifies that App should be drawn to the HTML page in the <div> with the attribute ref={mapContainer}.
  const mapContainer = useRef(null);
  const map = useRef(null);

  // The state stores the longitude, latitude, and zoom for the map. These values will all change as your user interacts with the map.
  const [lng, setLng] = useState(0);
  const [lat, setLat] = useState(0);
  const [zoom, setZoom] = useState(15);

  useEffect(() => {
    getData();
  }, []);

  // The map is initialised within useEffect
  // The properties container, style, center & zoom are all settings that the Mapbox GL JS library uses when the map initialy loads.
  // style is the style of the map, center is the coordinates of the middle of the map, zoom is how zoomed in or out the map is
  useEffect(() => {
    if (map.current) return; // initialize map only once
    if (eventDetails.coordinates) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v10",
        center: [eventDetails.coordinates[0], eventDetails.coordinates[1]],
        zoom: zoom,
      });
      // map.current.addControl(new mapboxgl.FullscreenControl());
      map.current.addControl(new mapboxgl.NavigationControl());

      const marker1 = new mapboxgl.Marker()
        .setLngLat([eventDetails.coordinates[0], eventDetails.coordinates[1]])
        .addTo(map.current);
      // Below resets the values of lng, lat, and zoom when the map is moved by the user.
      // getCenter() is a Mapbox GL JS method, to get the new longitude and latitude of the point at the center of the map.
      // getZoom() is a Mapbox GL JS method, to determine the zoom level that the map is set to.
      // toFixed() is a JS method, to truncate the resulting floating point number to the specified number of digits.
      map.current.on("move", () => {
        setLng(map.current.getCenter().lng.toFixed(4));
        setLat(map.current.getCenter().lat.toFixed(4));
        setZoom(map.current.getZoom().toFixed(2));
      });
    }
  });

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
  async function updateEvent(detailsObject) {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/events/${event}`,
        detailsObject
      );
      console.log("Data Saved", res.status, res.data);
    } catch (e) {
      console.log(e);
    }
  }

  function handleSetEventDetails(propertyName) {
    setEventDetails((prev) => {
      return {
        ...prev,
        [propertyName]: propertyName,
      };
    });
  }

  function handleRegistration() {
    const attendees = eventDetails.attendees;
    if (!attendees.includes(authState.data._id)) {
      attendees.push(authState.data._id);
      handleSetEventDetails(attendees);
      updateEvent({ attendees: attendees });
    }
  }

  function handleDeregister() {
    const attendees = eventDetails.attendees.filter((item) => {
      return item !== authState.data._id;
    });
    handleSetEventDetails(attendees);
    updateEvent({ attendees: attendees });
  }

  function handleCommentSubmit() {
    const comments = eventDetails.comments;
    comments.push({
      username: authState.data.username,
      userId: authState.data._id,
      comment: commentInput,
      time: Date.now(),
    });
    handleSetEventDetails(comments);
    updateEvent({ comments: comments });
    setCommentInput("");
  }

  function handleCommentDelete(index) {
    const comments = eventDetails.comments;
    comments.splice(index, 1);
    handleSetEventDetails(comments);
    updateEvent({ comments: comments });
  }

  return (
    <>
      <NavBar />
      <div className="event-details-main">
        <div className="event-title-register-div">
          <h2>{eventDetails.title}</h2>
          {!authState.data === null ? (
            eventDetails.attendees &&
            (!eventDetails.attendees.includes(authState.data._id) ? (
              <button onClick={handleRegistration}>Register</button>
            ) : eventDetails.userId === authState.data._id ? (
              <div>
                You are the organiser{" "}
                <Link to={`/${event}/update-event`}>Edit Event</Link>
              </div>
            ) : (
              <div>
                You are attending{" "}
                <button onClick={handleDeregister}>Deregister</button>
              </div>
            ))
          ) : (
            <div>
              <Link to={`/sign-in`}>Sign in</Link> to register
            </div>
          )}
        </div>
        <h4>{dateString}</h4>
        <h4>{eventDetails.address}</h4>
        <h4>Event Organiser</h4>
        <p>{eventDetails.username}</p>
        <h4>
          {eventDetails.attendees && eventDetails.attendees.length} Attending
        </h4>
        <h4>Description</h4>
        <p>{eventDetails.description}</p>
        <div className="map-detailed-div">
          <div ref={mapContainer} className="map-detailed-container" />
        </div>
        <h4>
          {eventDetails.comments && eventDetails.comments.length} Comments
        </h4>
        <input
          type="text"
          value={commentInput}
          name="commentInput"
          onChange={(e) => setCommentInput(e.target.value)}
        />
        <button onClick={handleCommentSubmit}>Submit</button>
        {eventDetails.comments &&
          eventDetails.comments.map((item, index) => {
            return (
              <div>
                <h4>{item.username}</h4>
                <span>{item.time && timeAgo(item.time)}</span>
                <p>{item.comment}</p>
                {!authState.data === null &&
                  item.userId === authState.data._id && (
                    <button onClick={() => handleCommentDelete(index)}>
                      Delete
                    </button>
                  )}
              </div>
            );
          })}
      </div>
    </>
  );
}

export default EventDetails;
