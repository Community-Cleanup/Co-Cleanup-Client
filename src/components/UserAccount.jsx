import React, { useState, useEffect } from "react";
//import axios from "axios";
import axios from "../utils/AxiosInterceptor";
import { useNavigate } from "react-router-dom";
import { useGlobalAuthState } from "../utils/AuthContext";
import PageTitle from "./PageTitle";
import NavBar from "./NavBar";
import Footer from "./Footer";
import ItemCard from "./ItemCard";
import ModalConfirm from "./ModalConfirm";
import { Margin } from "./styled/utility/Margin.styled";
import { CardLg } from "./styled/utility/CardLg.styled";
import { Fieldset } from "./styled/utility/Fieldset.styled";
import { Input } from "./styled/elements/Input.styled";
import { Button } from "./styled/elements/Button.styled";
import { FormMessage } from "./styled/elements/FormMessage.styled";
import { Span } from "./styled/utility/Span.styled";
import { Flex } from "./styled/utility/Flex.styled";
import { Grid } from "./styled/utility/Grid.styled";
import { theme } from "./styled/theme/Theme";

function UserAccount() {
  const navigate = useNavigate();
  const { authState } = useGlobalAuthState();
  const [attendingEvents, setAttendingEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [deleteModalIndex, setDeleteModalIndex] = useState(-1);
  const [usernameInputBar, setUsernameInputBar] = useState("");
  const [usernameUpdateModalOpen, setUsernameUpdateModalOpen] = useState(false);
  const [usernameUpdateMessage, setUsernameUpdateMessage] = useState("");

  useEffect(() => {
    getEvents("attendees", setAttendingEvents);
    getEvents("userId", setMyEvents);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    console.log("my events", myEvents);
  }, [myEvents]);

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
      const newAttendingList = attendingEvents.filter(
        (item) => item._id !== eventId
      );
      const newMyList = myEvents.filter((item) => item._id !== eventId);
      setAttendingEvents(newAttendingList);
      setMyEvents(newMyList);
      console.log(res);
      setDeleteModalIndex(-1);
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
      setUsernameUpdateMessage("Success! Your username has been updated");
    } catch (error) {
      setUsernameUpdateModalOpen(false);
      setUsernameUpdateMessage(error.response.data.errorMessage);
    }
  }

  return (
    <PageTitle title="My Account">
      <NavBar />
      <Margin>
        <CardLg bg={theme.colors.cardOne}>
          <Flex justify="space-between">
            <h2>User Details</h2>
            {authState.data.isAdmin && (
              <Button
                bg={theme.colors.buttonTwo}
                onClick={() => navigate("/admin")}
              >
                Admin Portal
              </Button>
            )}
          </Flex>
          <Flex align="flex-start">
            <div>
              <h4>
                Username:{" "}
                <Span fw="400" margin="0 0 0 1rem">
                  {authState.data.username}
                </Span>
              </h4>
              <h4>
                Email:{" "}
                <Span fw="400" margin="0 0 0 1rem">
                  {authState.data.email}
                </Span>
              </h4>
            </div>
            <div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setUsernameUpdateModalOpen(true);
                }}
              >
                <Fieldset>
                  <Button
                    bg={theme.colors.buttonTwo}
                    margin="0 0 0 36px"
                    type="submit"
                    value="Change Username"
                    id="submit"
                  >
                    Update Username
                  </Button>
                  <Input
                    w="200px"
                    type="text"
                    placeholder="Enter a new username"
                    name="usernameInputBar"
                    value={usernameInputBar}
                    onChange={(e) => setUsernameInputBar(e.target.value)}
                  />
                  {usernameUpdateModalOpen && (
                    <ModalConfirm
                      message={`You are about to update your username to ${usernameInputBar}.`}
                      buttonYesFunction={() => updateUsername(usernameInputBar)}
                      buttonYesText="Yes, update username"
                      buttonNoFunction={() => setUsernameUpdateModalOpen(false)}
                      buttonNoText="No, don't update"
                    />
                  )}
                </Fieldset>
              </form>
              {usernameUpdateMessage && (
                <FormMessage>{usernameUpdateMessage}</FormMessage>
              )}
            </div>
          </Flex>
        </CardLg>
        <CardLg bg={theme.colors.cardTwo} margin="24px 0 0">
          <h2>Upcoming Events</h2>
          <Grid>
            {attendingEvents
              .filter((item) => {
                return new Date(item.date).getTime() > Date.now();
              })
              .map((event) => {
                return (
                  <ItemCard
                    key={event._id}
                    title={event.title}
                    date={event.date}
                    address={event.address}
                    button1Color={theme.colors.buttonGray}
                    button1Function={() => navigate("/" + event._id)}
                    button1Text="View"
                  />
                );
              })}
          </Grid>
        </CardLg>
        <CardLg bg={theme.colors.cardTwo} margin="24px 0 0">
          <h2>Visited Events</h2>
          <Grid>
            {attendingEvents
              .filter((item) => {
                return new Date(item.date).getTime() < Date.now();
              })
              .map((event) => {
                return (
                  <ItemCard
                    key={event._id}
                    title={event.title}
                    date={event.date}
                    address={event.address}
                    button1Color={theme.colors.buttonGray}
                    button1Function={() => navigate("/" + event._id)}
                    button1Text="View"
                  />
                );
              })}
          </Grid>
        </CardLg>
        <CardLg bg={theme.colors.cardTwo} margin="24px 0 0">
          <h2>My Events</h2>
          <Grid>
            <>
              {myEvents.map((event, i) => {
                return (
                  <div key={event._id}>
                    <ItemCard
                      title={event.title}
                      date={event.date}
                      address={event.address}
                      button1Color={theme.colors.buttonGray}
                      button1Function={() => navigate("/" + event._id)}
                      button1Text="View"
                      button2Color={theme.colors.buttonTwo}
                      button2Function={() =>
                        navigate("/" + event._id + "/update-event")
                      }
                      button2Text="Update"
                      button3Color={theme.colors.buttonCancel}
                      button3Function={() => setDeleteModalIndex(i)}
                      button3Text="Delete"
                    />
                  </div>
                );
              })}
              {deleteModalIndex > -1 && (
                <ModalConfirm
                  message={`${myEvents[deleteModalIndex].title} will be deleted..`}
                  buttonYesFunction={() =>
                    deleteEvent(myEvents[deleteModalIndex]._id)
                  }
                  buttonYesText="Yes, delete event"
                  buttonNoFunction={() => setDeleteModalIndex(-1)}
                  buttonNoText="No, don't delete"
                />
              )}
            </>
          </Grid>
        </CardLg>
      </Margin>
      <Footer />
    </PageTitle>
  );
}

export default UserAccount;
