import axios from "axios";
import React from "react";
import { useState } from "react";

//CSS Stylsheet
import "./EventForm.css";

function EventForm() {
  const initialEventData = {
    title: "",
    date: Date.now(),
    address: "",
    coordinates: [0, 0],
    description: "",
    user: "testuserId1234",
  };

  const [eventData, setEventData] = useState(initialEventData);

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
        `http://localhost:55000/api/events/create-event`,
        {
          title: eventData.title,
          date: eventData.date,
          address: eventData.address,
          desciption: eventData.description,
        }
      );
      console.log("Data Saved", res.status, res.data);
      //   navigate("/recipes");
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
        <button onClick={createEvent}>Save Event</button>
        {/* <button onClick={updateEvent}>Update Event</button> */}
      </form>
    </div>
  );
}

export default EventForm;
