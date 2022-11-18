import React, { useState, useEffect } from "react";
//import axios from "axios";
import axios from "../utils/AxiosInterceptor";
import { useNavigate } from "react-router-dom";
import { useGlobalAuthState } from "../utils/AuthContext";
import { formatDate } from "../utils/formatDate";
import NavBar from "./NavBar";
import "./UserAccount.css";

function UserAccount() {
  const navigate = useNavigate();
  const { authState, setAuthState } = useGlobalAuthState();
  const [attendingEvents, setAttendingEvents] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [usernameInputBar, setUsernameInputBar] = useState("");
  const [usernameUpdateModalOpen, setUsernameUpdateModalOpen] = useState(false);
  const [usernameUpdateMessage, setUsernameUpdateMessage] = useState("");

  useEffect(() => {
    getEvents("attendees", setAttendingEvents);
    // eslint-disable-next-line
  }, []);

  async function getEvents(key, callback) {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/events?${key}=${authState.data._id}`
      );
      callback(res.data);
    } catch (e) {
      console.log(e);
    }
  }

  async function deleteEvent(eventId) {
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/api/events/${eventId}`
      );
      const newEventList = attendingEvents.filter(
        (item) => item._id !== eventId
      );
      setAttendingEvents(newEventList);
      console.log(res);
      setDeleteModalOpen(false);
    } catch (e) {
      console.log(e);
    }
  }

  async function updateUsername(usernameInput) {
    try {
      await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/users/update-username`,
        {
          username: usernameInput,
        }
      );
      setUsernameUpdateModalOpen(false);
      setAuthState((prev) => {
        return {
          ...prev,
          data: { ...authState.data, username: usernameInput },
        };
      });
      setUsernameUpdateMessage("Success! Your username has been updated");
    } catch (error) {
      setUsernameUpdateModalOpen(false);
      setUsernameUpdateMessage(error.response.data.errorMessage);
    }
  }

  return (
    <>
      <NavBar />
      <div className="account-main-div">
        <div className="account-user-details">
          <h2>User Details</h2>
          <h4>Username: {authState.data.username}</h4>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setUsernameUpdateModalOpen(true);
            }}
          >
            <fieldset>
              <input
                type="text"
                placeholder="Enter a new username"
                name="usernameInputBar"
                value={usernameInputBar}
                onChange={(e) => setUsernameInputBar(e.target.value)}
              />
              <input type="submit" value="Change Username" id="submit" />
              {usernameUpdateModalOpen && (
                <div className="account-update-modal">
                  <div className="modal-div">
                    <h3>
                      You are about to change your username to{" "}
                      {usernameInputBar}. Are you sure?
                    </h3>
                    <button onClick={() => setUsernameUpdateModalOpen(false)}>
                      No, don't update
                    </button>
                    <button onClick={() => updateUsername(usernameInputBar)}>
                      Yes, update username
                    </button>
                  </div>
                </div>
              )}
            </fieldset>
          </form>
          {usernameUpdateMessage && <p>{usernameUpdateMessage}</p>}
          <h4>Email: {authState.data.email}</h4>
        </div>
        <div className="account-events-div">
          <h2>Upcoming Events</h2>
          {attendingEvents
            .filter((item) => {
              return new Date(item.date).getTime() > Date.now();
            })
            .map((event) => {
              return (
                <div className="account-event">
                  <h4>{event.title}</h4>
                  <p>{formatDate(event.date)}</p>
                  <p>{event.address}</p>
                  <button onClick={() => navigate("/" + event._id)}>
                    View Event
                  </button>
                </div>
              );
            })}
        </div>
        <div className="account-events-div">
          <h2>Visited Events</h2>
          {attendingEvents
            .filter((item) => {
              return new Date(item.date).getTime() < Date.now();
            })
            .map((event) => {
              return (
                <div className="account-event">
                  <h4>{event.title}</h4>
                  <p>{formatDate(event.date)}</p>
                  <p>{event.address}</p>
                  <button onClick={() => navigate("/" + event._id)}>
                    View Event
                  </button>
                </div>
              );
            })}
        </div>
        <div className="account-events-div">
          <h2>My Events</h2>
          {attendingEvents
            .filter((item) => {
              return item.userId === authState.data._id;
            })
            .map((event) => {
              return (
                <div className="account-event">
                  <h4>{event.title}</h4>
                  <p>{formatDate(event.date)}</p>
                  <p>{event.address}</p>
                  <button onClick={() => navigate("/" + event._id)}>
                    View Event
                  </button>
                  <button
                    onClick={() => navigate("/" + event._id + "/update-event")}
                  >
                    Update
                  </button>

                  <button onClick={() => setDeleteModalOpen(true)}>
                    Delete
                  </button>
                  {deleteModalOpen && (
                    <div className="account-update-modal">
                      <div className="modal-div">
                        <h3>This event will be deleted. Are you sure?</h3>
                        <button onClick={() => setDeleteModalOpen(false)}>
                          No, don't delete
                        </button>
                        <button onClick={() => deleteEvent(event._id)}>
                          Yes, delete event
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}

export default UserAccount;
