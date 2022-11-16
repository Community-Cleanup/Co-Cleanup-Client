import React, { useState } from "react";
import axios from "../utils/AxiosInterceptor";

import LoadingSpinner from "./LoadingSpinner";

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
    }
  }

  async function handleEventSearchSubmit(e) {
    e.preventDefault();

    setShowLoadingSpinner(true);

    getEvents((res) => {
      setFoundEvents(res.data);
      setShowFoundEventResults(true);
    });

    setShowLoadingSpinner(false);
  }

  return (
    <>
      <form onSubmit={handleEventSearchSubmit}>
        <h3>Search for events by their title:</h3>
        <h3>(leave blank to see all events)</h3>
        <fieldset>
          <input
            type="text"
            placeholder="Search for users"
            name="userSearchBar"
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

      {showFoundEventResults && (
        <ul>
          {foundEvents.map((foundEvent, index) => {
            return (
              <div key={index}>
                <h3>{foundEvent.title}</h3>
                <h4>Date: </h4>
                <h4>{foundEvent.address}</h4>
                <p>{foundEvent.description}</p>
              </div>
            );
          })}
        </ul>
      )}
    </>
  );
}

export default AdminPageEvents;
