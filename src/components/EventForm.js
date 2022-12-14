// As function 'createEvent' calls a protected API route, we need to use
// Axios Interceptor to add the ID token to the 'createEvent' POST request header.
import axios from "../utils/AxiosInterceptor";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobalAuthState } from "../utils/AuthContext";
// React JSX Components
import PageTitle from "./PageTitle";
import NavBar from "./NavBar";
import Footer from "./Footer";
import Geocoder from "./Geocoder";
// styled components saved in the utilities folder apply styling to containers
// styled components saved in the elements folder apply styling to individual elements like buttons etc.
import { theme } from "./styled/theme/Theme";
import { Flex } from "./styled/utility/Flex.styled";
import { CardLg } from "./styled/utility/CardLg.styled";
import { Container } from "./styled/utility/Container.styled";
import { Span } from "./styled/utility/Span.styled";
import { FormLabel } from "./styled/elements/FormLabel.styled";
import { Input } from "./styled/elements/Input.styled";
import { Textarea } from "./styled/elements/Textarea.sytled";
import { Button } from "./styled/elements/Button.styled";

import { getEventDetails } from "../utils/getEventDetails";

// Form component used to create and edit an event
function EventForm() {
  const navigate = useNavigate();
  const { authState } = useGlobalAuthState();

  //Initial properties used to set state for the form
  const initialEventData = {
    title: "",
    date: "",
    address: "",
    coordinates: [0, 0],
    description: "",
    username: authState.data.username,
    userId: authState.data._id,
    attendees: [authState.data._id],
    comments: [],
  };

  // State for data entered into form fields
  const [eventData, setEventData] = useState(initialEventData);

  // event variable is saved if a params exists
  // this event variable will be saved only when updating an event, not when creating an event
  const { event } = useParams();

  // When the form is used to update an event the 'event' variable will not be undefined
  // when the 'event' variable is not undefined it will run the getEventDetails() function when the page loads
  // This function makes a request to the server to retrieve the event data
  // This event data is then used to update the state using setEventData
  useEffect(() => {
    if (event) {
      getEventDetails(event, setEventData);
    }
    // eslint-disable-next-line
  }, []);

  // This function sets state for the controlled form components
  // Any changes to the input fields will update eventData state
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
  // try/catch is used to catch any errors and log to the console
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
          description: eventData.description,
          username: eventData.username,
          userId: eventData.userId,
          attendees: eventData.attendees,
          comments: eventData.comments,
        }
      );
      console.log("Data Saved");
      navigate("/" + res.data._id);
    } catch (e) {
      console.log(e);
    }
  }

  // updateEvent() function makes a request to the server to update an event in the database
  // After the event is created, the user is navigated to the home page
  async function updateEvent(e) {
    e.preventDefault();
    try {
      // eslint-disable-next-line
      const res = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/events/${event}`,
        {
          title: eventData.title,
          date: eventData.date,
          address: eventData.address,
          description: eventData.description,
        }
      );
      console.log("Data Saved");
      setEventData(initialEventData);
      navigate(`/${event}`);
    } catch (e) {
      console.log(e);
    }
  }

  // Create/Update event form jsx
  // Controlled components with onChange setting state
  // styled components are passed props to help fine tune different css properties
  return (
    <PageTitle title="Create Event">
      <NavBar />
      <Flex
        direction="column"
        align="none"
        justify="space-between"
        minh="100vh"
      >
        <CardLg margin="3%" bg={theme.colors.cardTwo}>
          <Container w="500px" margin="0 auto" bg="transparent">
            {event ? <h1>Update Event</h1> : <h1>Create Event</h1>}
            <form>
              <FormLabel>Title</FormLabel>
              <Input
                type="text"
                placeholder="Event Title"
                name="title"
                value={eventData.title}
                onChange={(event) => handleChange(event)}
              />
              <FormLabel>Date</FormLabel>
              <Input
                type="datetime-local"
                name="date"
                value={eventData.date}
                onChange={(event) => handleChange(event)}
              />
              <FormLabel>Address Search</FormLabel>

              {/* Geocoder component  */}
              <Geocoder setEventData={setEventData} />

              <FormLabel>Address</FormLabel>
              <CardLg pad="16px 20px">
                <Span fs="12px" fw="500" color={theme.colors.navigationLink}>
                  {eventData.address
                    ? eventData.address
                    : "Please search for an address"}
                </Span>
              </CardLg>
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="Desciption"
                id="description"
                name="description"
                pad="10px 20px"
                h="150px"
                value={eventData.description}
                onChange={(event) => handleChange(event)}
              ></Textarea>

              {/* Ternary based on if an event is defined. This form is used to both update and save an event*/}
              {event ? (
                <Button onClick={updateEvent}>Update Event</Button>
              ) : (
                <Button onClick={createEvent}>Save Event</Button>
              )}
            </form>
          </Container>
        </CardLg>
        <Footer />
      </Flex>
    </PageTitle>
  );
}

export default EventForm;
