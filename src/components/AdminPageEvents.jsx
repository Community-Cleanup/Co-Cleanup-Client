import React, { useState } from "react";
import axios from "../utils/AxiosInterceptor";

import { Margin } from "./styled/utility/Margin.styled";
import { CardLg } from "./styled/utility/CardLg.styled";
import { Fieldset } from "./styled/utility/Fieldset.styled";
import { Input } from "./styled/elements/Input.styled";
import { Button } from "./styled/elements/Button.styled";
import { Flex } from "./styled/utility/Flex.styled";
import { Width } from "./styled/utility/Width.styled";
import { theme } from "./styled/theme/Theme";
import AdminEventsItemCard from "./AdminEventsItemCard";
import AdminShowComments from "./AdminShowComments";

import Spinner from "./Spinner";
import AdminDeleteEventForm from "./AdminDeleteEventForm";
import { formatDate } from "../utils/formatDate";
import { Link } from "react-router-dom";

function AdminPageEvents() {
  // When the user clicks the search button, this state will determine whether and when to show the
  // loading spinner icon or the search button
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);

  // For our search bar to be a controlled component, this stores the current input value onChange
  const [eventSearchBar, setEventSearchBar] = useState("");
  // This will hold a copy in state all retrieved events from our server API depending on the search results
  const [foundEvents, setFoundEvents] = useState([]);
  // This will be used in conditional rendering as a boolean to determine when to show the results of the found events
  const [showFoundEventResults, setShowFoundEventResults] = useState(false);

  async function getEvents(callback) {
    // Query the route on our server API to retrieve all the events filtered by the search bar value
    try {
      const res = await axios.get(
        `${
          process.env.REACT_APP_SERVER_URL
        }/api/admin/events?filter=${eventSearchBar.trim()}`
      );
      callback(res);
    } catch (e) {
      console.log(e);
      // If an error occurs, remove the loading spinner icon and display the search button again
      setShowLoadingSpinner(false);
    }
  }

  // Handle on click of the search button
  function handleEventSearchSubmit(e) {
    e.preventDefault();

    // Change the state to replace the search button with the loading spinner icon
    setShowLoadingSpinner(true);

    // If we successfully retrieve the filtered events from the server API...
    getEvents((res) => {
      // Set the found events in state
      setFoundEvents(res.data);
      // Enable the state to conditionally show the results of the events found (if any)
      setShowFoundEventResults(true);
      // Remove the loading spinner icon and display the search button again ready for the next search
      setShowLoadingSpinner(false);
    });
  }

  return (
    <>
      <Margin>
        <CardLg bg={theme.colors.cardOne}>
          <form onSubmit={handleEventSearchSubmit}>
            <h3>
              Search for any event(s) with their comments by the event title:
            </h3>
            <h3>(Leave blank to see all events & comments)</h3>
            {/* Fieldset for the search bar, search button, and the loading spinner (whether or not to display it) */}
            <Fieldset>
              <Input
                w="30%"
                type="text"
                placeholder="Search for events"
                name="eventSearchBar"
                value={eventSearchBar}
                onChange={(e) => setEventSearchBar(e.target.value)}
              />
              {showLoadingSpinner ? (
                <Width>
                  <Spinner />
                </Width>
              ) : (
                <Button
                  bg={theme.colors.buttonOne}
                  margin="0 0 0 1px"
                  type="submit"
                  value="Search Events"
                  id="submit"
                >
                  Search Events
                </Button>
              )}
            </Fieldset>
          </form>
        </CardLg>
        <CardLg bg={theme.colors.cardOne}>
          {/* If we've successfully retrieved events (if any) from the server API... */}
          {showFoundEventResults &&
            /* If no events were found in the search, display this message */
            (!foundEvents.length ? (
              <p>No results found</p>
            ) : (
              /* Otherwise map through every found event object from the foundEvents state,
             and generate "cards" styled components with the contents of each card being the individual event details
             passed into the card as props */
              <Flex wrap="wrap">
                {/* The two key components passed in as props to the AdminEventsItemCard component are the:
                AdminDeleteEventForm component which handles the components to display the button on the card to delete an event, and the
                AdminShowComments component which handles the components to display any comments on that event as smaller styled, nested "cards" */}
                {foundEvents.map((foundEvent, index) => {
                  return (
                    <AdminEventsItemCard
                      key={index}
                      title={
                        <Link to={`/${foundEvent._id}`}>
                          {foundEvent.title}
                        </Link>
                      }
                      date={formatDate(foundEvent.date)}
                      address={foundEvent.address}
                      adminDeleteEventForm={
                        <AdminDeleteEventForm
                          foundEventUID={foundEvent._id}
                          foundEventTitle={foundEvent.title}
                        />
                      }
                      adminShowComments={
                        <AdminShowComments
                          foundEventUID={foundEvent._id}
                          foundEventComments={foundEvent.comments}
                        />
                      }
                    />
                  );
                })}
              </Flex>
            ))}
        </CardLg>
      </Margin>
    </>
  );
}

export default AdminPageEvents;
