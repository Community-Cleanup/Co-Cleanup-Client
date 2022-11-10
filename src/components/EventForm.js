// Libraries
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
//CSS Stylsheet
import "./EventForm.css";

// Form component used to create and edit an event
function EventForm() {
  const navigate = useNavigate();

  //Initial properties used to set state for the form
  const initialEventData = {
    title: "",
    date: Date.now(),
    address: "",
    coordinates: [-27.517786, 152.98536],
    description: "",
    user: "testuserId1234",
  };

  // State for data entered into form fields
  const [eventData, setEventData] = useState(initialEventData);
  // event variable is saved if a params exists
  // this event variable will be saved only when updating an event, not when creating an event
  const { event } = useParams();

  // When the form is used to update an event the 'event' variable will not be undefined
  // when the 'event' variable is not undefined it will run the getEventDetails() function when the page loads
  useEffect(() => {
    if (event) {
      getEventDetails();
    }
  }, []);

  // This function makes a request to the server to retrieve the event data
  // This event data is then used to update the state using setEventData
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

  // This function sets state for the controlled form components
  function handleChange(event) {
    setEventData((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value,
      };
    });
  }

  // createEvent() function makes a request to the server to create a new event in the database
  // After the event is created, the user is navigated to the home page
  async function createEvent(e) {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/events/create-event`,
        {
          title: eventData.title,
          date: eventData.date,
          address: eventData.address,
          coordinates: eventData.coordinates,
          desciption: eventData.description,
        }
      );
      console.log("Data Saved", res.status, res.data);
      navigate("/events");
    } catch (e) {
      console.log(e);
    }
  }

  // updateEvent() function makes a request to the server to update an event in the database
  // After the event is created, the user is navigated to the home page
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

  // Create/Update event form jsx
  // Controlled components with onChange setting state
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
        <label>Address</label>
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
        {/* Ternary based on if an event is defined. This form is used to both update and save an event*/}
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
