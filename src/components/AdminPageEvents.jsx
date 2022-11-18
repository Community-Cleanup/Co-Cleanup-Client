import React, { useState } from "react";
import axios from "../utils/AxiosInterceptor";

import LoadingSpinner from "./LoadingSpinner";
import AdminDeleteEventForm from "./AdminDeleteEventForm";
import { formatDate } from "../utils/formatDate";
import { Link } from "react-router-dom";

function AdminPageEvents() {
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);

  const [eventSearchBar, setEventSearchBar] = useState("");
  const [foundEvents, setFoundEvents] = useState([]);
  const [showFoundEventResults, setShowFoundEventResults] = useState(false);

  async function getEvents(callback) {
    try {
      const res = await axios.get(
        `${
          process.env.REACT_APP_SERVER_URL
        }/api/admin/events?filter=${eventSearchBar.trim()}`
      );
      callback(res);
    } catch (e) {
      console.log(e);
      setShowLoadingSpinner(false);
    }
  }

  function handleEventSearchSubmit(e) {
    e.preventDefault();

    setShowLoadingSpinner(true);

    getEvents((res) => {
      setFoundEvents(res.data);
      setShowFoundEventResults(true);
      setShowLoadingSpinner(false);
    });
  }

  return (
    <>
      <form onSubmit={handleEventSearchSubmit}>
        <h3>Search for any event(s) by their title:</h3>
        <h3>(leave blank to see all events)</h3>
        <fieldset>
          <input
            type="text"
            placeholder="Search for events"
            name="eventSearchBar"
            value={eventSearchBar}
            onChange={(e) => setEventSearchBar(e.target.value)}
          />
          {showLoadingSpinner ? (
            <LoadingSpinner />
          ) : (
            <input type="submit" value="Search Events" id="submit" />
          )}
        </fieldset>
      </form>

      {showFoundEventResults &&
        (!foundEvents.length ? (
          <p>No results found</p>
        ) : (
          <ul>
            {foundEvents.map((foundEvent, index) => {
              return (
                <>
                  <div key={index}>
                    <p>
                      Title:{" "}
                      <Link to={`/${foundEvent._id}`}>{foundEvent.title}</Link>
                    </p>
                    <p>Date of Event: {formatDate(foundEvent.date)}</p>
                    <p>Address: {foundEvent.address}</p>
                    <AdminDeleteEventForm foundEventUID={foundEvent._id} />
                  </div>
                  <br />
                </>
              );
            })}
          </ul>
        ))}
    </>
  );
}

export default AdminPageEvents;
