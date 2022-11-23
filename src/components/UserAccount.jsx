import React, { useState, useEffect } from "react";
import axios from "../utils/AxiosInterceptor";
import { useNavigate } from "react-router-dom";
import { useGlobalAuthState } from "../utils/AuthContext";
// React JSX Components
import PageTitle from "./PageTitle";
import NavBar from "./NavBar";
import Footer from "./Footer";
import ItemCard from "./ItemCard";
import ModalConfirm from "./ModalConfirm";
// styled components saved in the utilities folder apply styling to containers
// styled components saved in the elements folder apply styling to individual elements like buttons etc.
import { theme } from "./styled/theme/Theme";
import { Margin } from "./styled/utility/Margin.styled";
import { CardLg } from "./styled/utility/CardLg.styled";
import { Fieldset } from "./styled/utility/Fieldset.styled";
import { Span } from "./styled/utility/Span.styled";
import { FlexRow } from "./styled/utility/FlexRow.styled";
import { Grid } from "./styled/utility/Grid.styled";
import { Input } from "./styled/elements/Input.styled";
import { Button } from "./styled/elements/Button.styled";
import { FormMessage } from "./styled/elements/FormMessage.styled";

function UserAccount() {
  const navigate = useNavigate();
  // useGlobalAuthState() contains the details of the current logged in user
  const { authState, setAuthState } = useGlobalAuthState();
  // attendingEvents contains an array of events that the current user's id is in the attendee array for that event
  const [attendingEvents, setAttendingEvents] = useState([]);
  // myEvents contains an array of events that the current user is the organiser of
  const [myEvents, setMyEvents] = useState([]);
  // deleteModalIndex is used to show the modal to confirm deleting an event
  // the index of the event is used to display the modal if > -1,  instead of true false
  // it also stores the index of the event that will be deleted in the deleteEvent() function
  const [deleteModalIndex, setDeleteModalIndex] = useState(-1);
  // userNameInputBar is a controlled input used to save the input field value as state
  const [usernameInputBar, setUsernameInputBar] = useState("");
  // usernameUpdateModalOpen is a boolean value used to open and close the username update modal
  const [usernameUpdateModalOpen, setUsernameUpdateModalOpen] = useState(false);
  // usernameUpdateMessage stores the message returned after a successful or unsuccessful update of the username
  const [usernameUpdateMessage, setUsernameUpdateMessage] = useState("");

  // this useEffect calls getEvents() twice, and sets attendingEvents and myEvents
  // attendees and userId are the name of the properties that will be queried for the current users id
  useEffect(() => {
    getEvents("attendees", setAttendingEvents);
    getEvents("userId", setMyEvents);
    // eslint-disable-next-line
  }, []);

  // getEvents takes a key (which is the property key in the event object is being queried)
  // the callback parameter will determine what is done with the response data from the server
  // try/catch is used to catch any errors and log to the console
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

  // filterRemoveEvent() is used to remove an event based on id by filtering an array of events
  function filterRemoveEvent(array, eventId) {
    return array.filter((item) => item._id !== eventId);
  }

  // deleteEvent() will use the eventId as a parameter and call a delete request to the server
  // attendingEvents and myEvents are both filtered to remove the deleted event
  // both these new lists are saved to their respective states
  // try/catch is used to catch any errors and log to the console
  async function deleteEvent(eventId) {
    try {
      // eslint-disable-next-line
      const res = await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/api/events/${eventId}`
      );
      const newAttendingList = filterRemoveEvent(attendingEvents, eventId);
      const newMyList = filterRemoveEvent(myEvents, eventId);
      setAttendingEvents(newAttendingList);
      setMyEvents(newMyList);
      setDeleteModalIndex(-1);
    } catch (e) {
      console.log(e);
    }
  }

  // updateUsername is called when the user clicks the "Update Username" button which is in the update username confirmation modal
  // it sends a put request to the server to update the username supplied as a parameter
  // the confirm modal is also closed if successful or if there is an error
  // then the respective message is updated in state
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

  // styled components are passed props to help fine tune different css properties
  return (
    <PageTitle title="My Account">
      <NavBar />

      {/* User details section */}
      <Margin>
        <CardLg bg={theme.colors.cardOne}>
          <FlexRow align="center" justify="space-between">
            <h2>User Details</h2>
            {authState.data.isAdmin && (
              <>
                <Button
                  bg={theme.colors.buttonThree}
                  onClick={() => navigate("/admin")}
                >
                  View Admin Dashboard
                </Button>
              </>
            )}
          </FlexRow>
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

          {/* Username update input section */}
          {/* When the form is submitted the modal to confirm username change is opened */}
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
                  margin="16px 0 0 0"
                  type="submit"
                  value="Change Username"
                  id="submit"
                >
                  Update Username
                </Button>
                {/* Controlled input field */}
                <Input
                  w="200px"
                  type="text"
                  placeholder="Enter a new username"
                  name="usernameInputBar"
                  value={usernameInputBar}
                  onChange={(e) => setUsernameInputBar(e.target.value)}
                />
                {/* Modal to confirm username change */}
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
            {/* Message displayed after username update is confirmed in the modal */}
            {usernameUpdateMessage && (
              <FormMessage>{usernameUpdateMessage}</FormMessage>
            )}
          </div>
        </CardLg>

        {/* Upcoming events section */}
        <CardLg bg={theme.colors.cardTwo} margin="24px 0 0">
          <h2>Upcoming Events</h2>
          <Grid>
            {/* attending events is mapped over and displayed on cards -> filtered for only events that are in the future */}
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

        {/* Visited events section */}
        <CardLg bg={theme.colors.cardTwo} margin="24px 0 0">
          <h2>Visited Events</h2>
          <Grid>
            {/* attending events is mapped over and displayed on card -> filtered for only events that are in the past */}
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

        {/* My events section */}
        <CardLg bg={theme.colors.cardTwo} margin="24px 0 0">
          <h2>My Events</h2>
          <Grid>
            <>
              {/* My events are mapped over and dispayed on cards */}
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

              {/* Delete event modal */}
              {/* Uses the index saved in state to show the correct modal  */}
              {/* the index is also used to call deleteEvent() for the correct event */}
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
