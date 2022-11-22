import React, { useState } from "react";
import axios from "../utils/AxiosInterceptor";

import PageTitle from "./PageTitle";
import NavBar from "./NavBar";
import Footer from "./Footer";
import ItemCard from "./ItemCard";
import ModalConfirm from "./ModalConfirm";
import { Margin } from "./styled/utility/Margin.styled";
import { Container } from "./styled/utility/Container.styled";
import { CardLg } from "./styled/utility/CardLg.styled";
import { Fieldset } from "./styled/utility/Fieldset.styled";
import { Input } from "./styled/elements/Input.styled";
import { Button } from "./styled/elements/Button.styled";
import { FormMessage } from "./styled/elements/FormMessage.styled";
import { Span } from "./styled/utility/Span.styled";
import { Flex } from "./styled/utility/Flex.styled";
import { FlexRow } from "./styled/utility/FlexRow.styled";
import { Grid } from "./styled/utility/Grid.styled";
import { theme } from "./styled/theme/Theme";
import AdminEventsItemCard from "./AdminEventsItemCard";

import LoadingSpinner from "./LoadingSpinner";
import AdminDeleteEventForm from "./AdminDeleteEventForm";
import AdminPageEventComment from "./AdminPageEventComment";
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
      <Margin>
        <CardLg bg={theme.colors.cardOne}>
          <form onSubmit={handleEventSearchSubmit}>
            <h3>
              Search for any event(s) with their comments by the event title:
            </h3>
            <h3>(Leave blank to see all events & comments)</h3>
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
                <LoadingSpinner />
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
          {showFoundEventResults &&
            (!foundEvents.length ? (
              <p>No results found</p>
            ) : (
              <Flex wrap="wrap">
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
                    />

                    // <>
                    //   <div key={index}>
                    //     <h3>Event:</h3>
                    //     <p>
                    //       Title:{" "}
                    //       <Link to={`/${foundEvent._id}`}>
                    //         {foundEvent.title}
                    //       </Link>
                    //     </p>
                    //     <p>Date of Event: {formatDate(foundEvent.date)}</p>
                    //     <p>Address: {foundEvent.address}</p>
                    //     <AdminDeleteEventForm foundEventUID={foundEvent._id} />
                    //     {foundEvent.comments.map((eventComment, index) => {
                    //       return (
                    //         <>
                    //           <div key={index}>
                    //             <AdminPageEventComment
                    //               foundEventUID={foundEvent._id}
                    //               eventCommentIndex={index}
                    //               eventCommentUsername={eventComment.username}
                    //               eventCommentComment={eventComment.comment}
                    //               eventCommentTime={eventComment.time}
                    //             />
                    //           </div>
                    //         </>
                    //       );
                    //     })}
                    //   </div>
                    //   <br />
                    // </>
                  );
                })}
              </Flex>
            ))}
        </CardLg>
      </Margin>

      {showFoundEventResults &&
        (!foundEvents.length ? (
          <p>No results found</p>
        ) : (
          <>
            {foundEvents.map((foundEvent, index) => {
              return (
                <>
                  <div key={index}>
                    <h3>Event:</h3>
                    <p>
                      Title:{" "}
                      <Link to={`/${foundEvent._id}`}>{foundEvent.title}</Link>
                    </p>
                    <p>Date of Event: {formatDate(foundEvent.date)}</p>
                    <p>Address: {foundEvent.address}</p>
                    <AdminDeleteEventForm foundEventUID={foundEvent._id} />
                    {foundEvent.comments.map((eventComment, index) => {
                      return (
                        <>
                          <div key={index}>
                            <AdminPageEventComment
                              foundEventUID={foundEvent._id}
                              eventCommentIndex={index}
                              eventCommentUsername={eventComment.username}
                              eventCommentComment={eventComment.comment}
                              eventCommentTime={eventComment.time}
                            />
                          </div>
                        </>
                      );
                    })}
                  </div>
                  <br />
                </>
              );
            })}
          </>
        ))}
    </>
  );
}

export default AdminPageEvents;
