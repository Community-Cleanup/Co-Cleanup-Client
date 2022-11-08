import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
//CSS Stylsheet
import "./EventForm.css";

function EventForm() {
  const navigate = useNavigate();

  const initialEventData = {
    title: "",
    date: Date.now(),
    address: "",
    coordinates: [0, 0],
    description: "",
    user: "testuserId1234",
  };

  const [eventData, setEventData] = useState(initialEventData);
  const { event } = useParams();

  useEffect(() => {
    if (event) {
      getEventDetails();
    }
  }, []);

  async function getEventDetails() {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/events/${event}`
      );
      setEventData(res.data);
    } catch (e) {
      console.log(e);
    }
  }

  function handleChange(event) {
    setEventData((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value,
      };
    });
  }

  async function createEvent(e) {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/events/create-event`,
        {
          title: eventData.title,
          date: eventData.date,
          address: eventData.address,
          desciption: eventData.description,
        }
      );
      console.log("Data Saved", res.status, res.data);
      navigate("/events");
    } catch (e) {
      console.log(e);
    }
  }

  async function updateEvent(e) {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/events/${event}`,
        {
          title: eventData.title,
          date: eventData.date,
          address: eventData.address,
          description: eventData.description,
        }
      );
      console.log("Data Saved", res.status, res.data);
      setEventData(initialEventData);
      navigate(`/${event}`);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="event-form-main">
      <h1>Event Form</h1>
      <form>
        <label>Title</label>
        <input
          type="text"
          placeholder="Event Title"
          name="title"
          value={eventData.title}
          onChange={(event) => handleChange(event)}
        />
        <label>Date</label>
        <input
          type="text"
          //   placeholder="Event Title"
          name="date"
          value={eventData.date}
          onChange={(event) => handleChange(event)}
        />
        <label>Location</label>
        <input
          type="text"
          placeholder="Address"
          name="address"
          value={eventData.address}
          onChange={(event) => handleChange(event)}
        />
        <label>Description</label>
        <textarea
          placeholder="Desciption"
          id="description"
          cols="30"
          rows="10"
          name="description"
          value={eventData.description}
          onChange={(event) => handleChange(event)}
        ></textarea>
        {event ? (
          <button onClick={updateEvent}>Update Event</button>
        ) : (
          <button onClick={createEvent}>Save Event</button>
        )}
      </form>
    </div>
  );
}

export default EventForm;
