// Axios Interceptor to add the ID token to the 'createEvent' POST request header.
import axios from "../utils/AxiosInterceptor";
import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import { useGlobalAuthState } from "../utils/AuthContext";
// React JSX Components
import PageTitle from "./PageTitle";
import NavBar from "./NavBar";
import Footer from "./Footer";
// styled components saved in the utilities folder apply styling to containers
// styled components saved in the elements folder apply styling to individual elements like buttons etc.
import { theme } from "./styled/theme/Theme";
import { Flex } from "./styled/utility/Flex.styled";
import { CardLg } from "./styled/utility/CardLg.styled";
import { Container } from "./styled/utility/Container.styled";
import { Span } from "./styled/utility/Span.styled";
import { Input } from "./styled/elements/Input.styled";
import { FormMessage } from "./styled/elements/FormMessage.styled";
import { Button } from "./styled/elements/Button.styled";
// utils functions
import { getEventDetails } from "../utils/getEventDetails";
import { formatDate } from "../utils/formatDate";
import { timeAgo } from "../utils/timeAgo";
// mapbox token
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;

function EventDetails() {
  const navigate = useNavigate();
  // useParams() gets the event ID param designated in routes and saves as a variable
  const { event } = useParams();
  // useGlobalAuthState() contains the details of the current logged in user
  const { authState } = useGlobalAuthState();
  // eventDetails is used to store the current state of the event data
  const [eventDetails, setEventDetails] = useState({});
  // commentInput is used to save the input field value as state, and in return is used as the controlled value for the same input field
  const [commentInput, setCommentInput] = useState("");

  // formatDate() takes the event date and returns a formatted date string which is displayed for users to see
  const dateString = formatDate(eventDetails.date);

  //The mapContainer useRef specifies that App should be drawn to the HTML page in the <div> with the attribute ref={mapContainer}.
  const mapContainer = useRef(null);
  const map = useRef(null);

  // The state stores the longitude, latitude, and zoom for the map. These values will all change as your user interacts with the map.
  // eslint-disable-next-line
  const [lng, setLng] = useState(0);
  // eslint-disable-next-line
  const [lat, setLat] = useState(0);
  const [zoom, setZoom] = useState(15);

  // When the page loads getEventDetails() is called
  // getEventDetails() calls the backend server events API
  // the event Id which is saved from params is used to get the data for the individual event
  // the response is set as eventDetails state
  useEffect(() => {
    getEventDetails(event, setEventDetails);
    // eslint-disable-next-line
  }, []);

  // The map is initialised within useEffect
  // The properties container, style, center & zoom are all settings that the Mapbox GL JS library uses when the map initialy loads.
  // style is the style of the map, center is the coordinates of the middle of the map, zoom is how zoomed in or out the map is
  useEffect(() => {
    if (map.current) return; // initialize map only once
    if (eventDetails.coordinates) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v10",
        center: [eventDetails.coordinates[0], eventDetails.coordinates[1]],
        zoom: zoom,
      });
      // map.current.addControl(new mapboxgl.FullscreenControl());
      map.current.addControl(new mapboxgl.NavigationControl());

      // eslint-disable-next-line
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

  // updateEvent() function makes a request to the server to update an event in the database
  // the axios put request takes in detailsObject as a parameter. detailsObject will determine which object property will be updated and the data
  // this function is used to update users registering for the event and any comments made to the event
  // try/catch is used to catch any errors and log to the console
  async function updateEvent(detailsObject) {
    try {
      // eslint-disable-next-line
      const res = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/events/${event}`,
        detailsObject
      );
      console.log("Data Saved");
    } catch (e) {
      console.log(e);
    }
  }

  // handleSetEventDetails() is used to handle setting the eventDetails state
  // it is set up to be able to take in any value the same name as an eventDetails property
  // for this component it is used to update attendees and comments
  function handleSetEventDetails(propertyName) {
    setEventDetails((prev) => {
      return {
        ...prev,
        [propertyName]: propertyName,
      };
    });
  }

  // handleRegistration() is called when the register button is clicked by a user
  // if the currentUser is not listed in the attendees array, then
  // the user is added to the attendees array in both the server database and eventDetails state
  function handleRegistration() {
    const attendees = eventDetails.attendees;
    if (!attendees.includes(authState.data._id)) {
      attendees.push(authState.data._id);
      handleSetEventDetails(attendees);
      updateEvent({ attendees: attendees });
    }
  }

  // handleDeRegistrater() is called when the de-register button is clicked by a user
  // It is similar to handleRegistration() however, it
  // filters out the currentUser from the attendees array this is done
  // both on the server database and in the eventDetails state
  function handleDeregister() {
    const attendees = eventDetails.attendees.filter((item) => {
      return item !== authState.data._id;
    });
    handleSetEventDetails(attendees);
    updateEvent({ attendees: attendees });
  }

  // handleCommentSubmit() is called when a user submits a comment
  // it adds the commentInput along with other details including username, user id, and JS date/time
  // this newly created object is pushed to the comments array
  // this is done in both the server database and in the eventDetails state
  // finally the commentInput state is set to "", which clears the input field
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

  // handleCommentDelete() is called when the delete comment button is clicked by the user
  // it takes the index of the comment and removes it from the comments array using .splice()
  // then the comments array is updated in both the server database and in the eventDetails state
  function handleCommentDelete(index) {
    const comments = eventDetails.comments;
    comments.splice(index, 1);
    handleSetEventDetails(comments);
    updateEvent({ comments: comments });
  }

  // styled components are passed props to help fine tune different css properties
  return (
    <PageTitle title="Event Details">
      <NavBar />
      <Container w="80%" margin="80px 10%">
        <Flex justify="space-between" align="center">
          {/* Event Title section */}
          <h1>
            <Span fs="44px" margin="0 0 ">
              {eventDetails.title}
            </Span>
          </h1>
          <div>
            {/* // authState.data is first checked then ternary operators are used to show the correct buttons for sign in / register / de-register */}
            {!authState.data ? (
              <div>
                <Link to={`/sign-in`}>
                  <Span fw="600" color={theme.colors.signLink}>
                    Sign in
                  </Span>
                </Link>{" "}
                to register
              </div>
            ) : eventDetails.attendees &&
              !eventDetails.attendees.includes(authState.data._id) ? (
              <Button margin="0" onClick={handleRegistration}>
                Register
              </Button>
            ) : (
              <div>
                <Button
                  margin="0"
                  bg={theme.colors.buttonGray}
                  onClick={handleDeregister}
                >
                  Deregister
                </Button>
                <FormMessage color={theme.colors.signLink}>
                  You are attending
                </FormMessage>
              </div>
            )}

            {/* The edit event button is shown if the current user is also the organiser of the event */}
            {authState.data && eventDetails.userId === authState.data._id && (
              <div>
                <Button
                  margin="16px 0 0"
                  bg={theme.colors.buttonTwo}
                  onClick={() => navigate(`/${event}/update-event`)}
                >
                  Edit Event
                </Button>
              </div>
            )}
          </div>
        </Flex>

        {/* Organiser and Attendees section */}
        <Flex w="350px" justify="space-between">
          <h4>
            <Span fw="400">Organised by</Span>{" "}
            <Span fw="600" color={theme.colors.signLink}>
              {eventDetails.username}
            </Span>
          </h4>
          <h4>
            <Span fw="500" margin="0 0 24px">
              {eventDetails.attendees && eventDetails.attendees.length}{" "}
              Attending
            </Span>
          </h4>
        </Flex>

        {/* Date & Time section */}
        <h3>Date & Time</h3>
        <h4>
          <Span margin="0 0 24px" color={theme.colors.dateText}>
            {dateString}
          </Span>
        </h4>

        {/* Location details */}
        <h3>Location</h3>
        <h4>
          <Span fw="400">{eventDetails.address}</Span>
        </h4>

        {/* Mapbox containers for map */}
        <Container h="400px" w="75%" br="12px" margin="36px 0">
          <Container h="100%" w="100%" position="absolute" ref={mapContainer} />
        </Container>

        {/* About section */}
        <h2>About this event</h2>
        <p>{eventDetails.description}</p>
        <h2>
          <Span margin="50px 0 0">Guidelines</Span>
        </h2>
        <p>
          Please read Co Cleanup's guidelines on safely cleaning up after a
          natural disaster before attending this event.
        </p>
        <h4>
          <Span fw="500" margin="6px 0 0" color={theme.colors.signLink}>
            <Link to="/guidelines">Guidelines</Link>
          </Span>
        </h4>

        {/* Comments section and input field */}
        <h4>
          <Span fw="500" margin="50px 0 10px">
            {eventDetails.comments && eventDetails.comments.length} Comments
          </Span>
        </h4>
        <Input
          w="200px"
          type="text"
          placeholder="Add comment"
          value={commentInput}
          name="commentInput"
          onChange={(e) => setCommentInput(e.target.value)}
        />

        {/* Comments */}
        <Button onClick={handleCommentSubmit}>Submit</Button>
        {eventDetails.comments &&
          eventDetails.comments.map((item, index) => {
            return (
              <CardLg key={item._id}>
                <Flex w="max-content" align="center">
                  <h4>
                    <Span fs="14px">{item.username}</Span>
                  </h4>
                  <Span fs="12px" margin="4px 0 4px 24px">
                    {item.time && timeAgo(item.time)}
                  </Span>
                </Flex>
                <p>
                  <Span margin="6px 0 0">{item.comment}</Span>
                </p>

                {/* Delete button is shown if current user also composed the comment*/}
                {authState.data && item.userId === authState.data._id && (
                  <Button
                    fs="10px"
                    pad="6px 10px"
                    margin="12px 0 0"
                    bg={theme.colors.buttonGray}
                    onClick={() => handleCommentDelete(index)}
                  >
                    Delete
                  </Button>
                )}
              </CardLg>
            );
          })}
      </Container>
      <Footer />
    </PageTitle>
  );
}

export default EventDetails;
