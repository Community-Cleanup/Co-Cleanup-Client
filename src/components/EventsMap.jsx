import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import mapboxgl from "mapbox-gl";
// React JSX Components
import PageTitle from "./PageTitle";
import NavBar from "./NavBar";
import Footer from "./Footer";
// styled components saved in the utilities folder apply styling to containers
// styled components saved in the elements folder apply styling to individual elements like buttons etc.
import { theme } from "./styled/theme/Theme";
import { Container } from "./styled/utility/Container.styled";
import { Flex } from "./styled/utility/Flex.styled";
import { FlexRow } from "./styled/utility/FlexRow.styled";
import { Grid } from "./styled/utility/Grid.styled";
import { Span } from "./styled/utility/Span.styled";
import { CardSm } from "./styled/utility/CardSm.styled";
// utils functions
import { useGlobalSearchContext } from "../utils/SearchContext";
import { formatDate } from "../utils/formatDate";
// mapbox token
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;

function EventsMap() {
  const navigate = useNavigate();
  const { searchBar, setSearchBar } = useGlobalSearchContext();
  //The mapContainer useRef specifies that App should be drawn to the HTML page in the <div> with the attribute ref={mapContainer}.
  const mapContainer = useRef(null);
  const map = useRef(null);
  const sourceLayerAdded = useRef(false);

  // The state stores the longitude, latitude, and zoom for the map. These values will all change as your user interacts with the map.
  const [lng, setLng] = useState(148.055033);
  const [lat, setLat] = useState(-25.978749);
  const [zoom, setZoom] = useState(3);
  // eventsAPIData saves all of the events in state
  const [eventsAPIData, setEventsAPIData] = useState([]);
  // eventsGeoJSON is all of the events in geoJSON format saved to state
  const [eventsGeoJSON, setEventsGeoJSON] = useState([]);
  // mapFilteredEvents are the events which the Mapbox map renders when the user navigates around the map
  // this is used to only display listing in the sidebar that are displayed on the map
  const [mapFilteredEvents, setMapFilteredEvents] = useState([]);
  // sideBarListings is used to show events in the side bar and on the map
  const [sidebarListings, setSidebarListings] = useState([]);

  // popup is a mapbox method that creates a popup on the map
  const popup = new mapboxgl.Popup({
    closeButton: false,
  });

  // API call to fetch all events from the backend
  async function getEvents() {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/events`
      );
      setEventsAPIData(res.data);
    } catch (e) {
      console.log(e);
    }
  }

  // normalize is used to convert the event titles and search bar inputs
  // so that the equality operator can be used to compare strings
  function normalize(string) {
    return string.trim().toLowerCase();
  }

  // Because features come from tiled vector data,
  // feature geometries may be split
  // or duplicated across tile boundaries.
  // As a result, features may appear
  // multiple times in query results.
  function getUniqueFeatures(features, comparatorProperty) {
    const uniqueIds = new Set();
    const uniqueFeatures = [];
    for (const feature of features) {
      const id = feature.properties[comparatorProperty];
      if (!uniqueIds.has(id)) {
        uniqueIds.add(id);
        uniqueFeatures.push(feature);
      }
    }
    return uniqueFeatures;
  }

  // This useEffect is used on the initial launch
  // calls getEvents() which requests all the events from the backend
  // These events are then saved in state as eventsAPIData
  useEffect(() => {
    getEvents();
  }, []);

  // The map is initialised within useEffect
  // The properties container, style, center & zoom are all settings that the Mapbox GL JS library uses when the map initialy loads.
  // style is the style of the map, center is the coordinates of the middle of the map, zoom is how zoomed in or out the map is
  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v10",
      center: [lng, lat],
      zoom: zoom,
    });
    map.current.addControl(new mapboxgl.FullscreenControl());
    map.current.addControl(new mapboxgl.NavigationControl());
    // Below resets the values of lng, lat, and zoom when the map is moved by the user.
    // getCenter() is a Mapbox GL JS method, to get the new longitude and latitude of the point at the center of the map.
    // getZoom() is a Mapbox GL JS method, to determine the zoom level that the map is set to.
    // toFixed() is a JS method, to truncate the resulting floating point number to the specified number of digits.
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  // After eventsAPIData state is updated this useEffect is run
  // it converts events data into geoJSON format, which is used
  // by Mapbox GL JS to plot points on the map
  // This data is then saved in state as eventsGeoJSON
  useEffect(() => {
    console.log("events api:", eventsAPIData);
    if (eventsAPIData.length > 0) {
      let geoJSON = {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: eventsAPIData.map((event) => {
            // console.log(event);
            return {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: event.coordinates,
              },
              properties: {
                title: event.title,
                date: event.date,
                address: event.address,
                attendees: event.attendees,
                id: event._id,
              },
            };
          }),
        },
      };
      setEventsGeoJSON(geoJSON);
    }
  }, [eventsAPIData]);

  // Once eventGeoJSON state is udpated the geoJSON data is added to the map
  useEffect(() => {
    console.log("eventsGeoJSON:", eventsGeoJSON);

    function addSourceLayer() {
      // The eventsGeoJSON is added a source and given the name "points"
      try {
        map.current.addSource("points", eventsGeoJSON);
      } catch (error) {
        console.log("Source of ID 'points' already added");
        return;
      }

      // This "points" data is then added to the map as a layer
      // The paint properties are used to style the location icon displayed on the map
      map.current.addLayer({
        id: "points",
        type: "circle",
        source: "points",
        paint: {
          "circle-radius": 4,
          "circle-stroke-width": 2,
          "circle-color": "blue",
          "circle-stroke-color": "white",
        },
      });
    }

    // The initial if statement is used to only add the data to the map once
    // Mapbox geoJSON data can only be added to the map once, then Mapbox methods need to used filter the location data
    if (Object.keys(eventsGeoJSON).length > 0) {
      // There is a discovered issue where sometimes the on "load" event listener isn't firing for an unknown reason,
      // so if this were to occur and the 'addSourceLayer' function to add the "points" layer doesn't get called,
      // we'll then call it on the below "idle" event listener, as "idle" is guaranteed to fire
      // Refer to the list of lifecycle events in the docs: https://docs.mapbox.com/mapbox-gl-js/api/map/#events-lifecycle
      map.current.on("load", () => {
        sourceLayerAdded.current = true;
        addSourceLayer();
      });
      map.current.on("idle", () => {
        if (sourceLayerAdded.current === false) {
          addSourceLayer();
        }
      });
      map.current.on("movestart", () => {
        // setFilter must be used to filter points on the map
        // reset features filter as the map starts moving
        map.current.setFilter("points", ["has", "title"]);
      });
      map.current.on("moveend", () => {
        // queryRenderedFeatures is used to collect all the location data currently displayed on the map after panning and zooming
        const features = map.current.queryRenderedFeatures({
          layers: ["points"],
        });

        // if queryRenderedFeatures returns location data
        // then this data is checked by getUniqueFeatures
        if (features) {
          const uniqueFeatures = getUniqueFeatures(features, "title");

          // Then these unique features are saved to mapFilteredEvents
          // mapFilteredEvents is used to updated the sidebarListings state
          setMapFilteredEvents(uniqueFeatures);
        }
      });

      map.current.on("mousemove", "points", (e) => {
        // Change the cursor style as a UI indicator.
        map.current.getCanvas().style.cursor = "pointer";

        // When mouse enters a event feature marker -> populate the popup and set its coordinates based on the feature.
        const feature = e.features[0];
        popup
          .setLngLat(feature.geometry.coordinates)
          .setText(`${feature.properties.title}`)
          .addTo(map.current);
      });

      // removes popup when mouse leaves the event feature marker
      map.current.on("mouseleave", "points", () => {
        map.current.getCanvas().style.cursor = "";
        popup.remove();
      });

      // when the event feature marker is clicked the user is navigated to the event details page
      map.current.on("click", "points", (e) => {
        console.log(e.features[0].properties.title);
        navigate("/" + e.features[0].properties.id);
      });
    }
  }, [eventsGeoJSON]);

  // mapFilteredEvents is used to updated the sidebarListings state
  useEffect(() => {
    setSidebarListings(mapFilteredEvents);
  }, [mapFilteredEvents]);

  // when the controlled input component "searchBar" is updated
  // the below useEffect is run
  useEffect(() => {
    // the searchBar value is normalized which converts it to
    // lowercase() and trims any whitespace from the ends
    const value = normalize(searchBar);

    // The below for loop filters visible features that match the input value.
    // searchFiltered is used to keep track of features which match the searchBar input
    const searchFiltered = [];
    for (const feature of mapFilteredEvents) {
      const name = normalize(feature.properties.title);
      if (name.includes(value)) {
        searchFiltered.push(feature);
      }
    }

    // This array is then used to update the sidebarListings state
    // sidebarListings is later mapped over to display all listings filtered by the searchBar
    setSidebarListings(searchFiltered);

    // The below if statement is used to update the map with the features filtered by the searchBar
    if (searchFiltered.length) {
      map.current.setFilter("points", [
        "match",
        ["get", "title"],
        searchFiltered.map((feature) => {
          return feature.properties.title;
        }),
        true,
        false,
      ]);
    }
  }, [mapFilteredEvents, searchBar]);

  // function to show the popup
  // this function is used with onMouseOver for the side bar event card
  function showPopup(event) {
    popup
      .setLngLat(event.geometry.coordinates)
      .setText(event.properties.title)
      .addTo(map.current);
  }

  // function to remove the popup
  // this function is used with onMouseOut for the side bar event card
  function removePopup() {
    popup.remove();
  }

  // styled components are passed props to help fine tune different css properties
  return (
    <PageTitle title="Find Events">
      <NavBar />
      <Container h="90vh" w="100%" bg={theme.colors.navbar}>
        <FlexRow>
          <Container h="90vh" w="50%" pad="16px" bg={theme.colors.navbar}>
            <Grid>
              {/* sidbarListings is mapped over to display all of the filtered listings in the side bar */}
              {sidebarListings.length ? (
                sidebarListings.map((event) => {
                  return (
                    <CardSm
                      cursor="pointer"
                      pad="16px 24px 24px"
                      w="100%"
                      bs="true"
                    >
                      {/* event listeners are used to display popups on the map */}
                      <div
                        onMouseOver={() => showPopup(event)}
                        onMouseOut={removePopup}
                        onClick={() => navigate(`/${event.properties.id}`)}
                      >
                        <Flex direction="column" align="flex-start">
                          <h3>
                            <Span>{event.properties.title}</Span>
                          </h3>
                          <Span
                            fs="12px"
                            fw="600"
                            tf="uppercase"
                            color={theme.colors.dateText}
                          >
                            {formatDate(event.properties.date)}
                          </Span>
                          <Span fs="12px" margin="6px 0 0">
                            {event.properties.address}
                          </Span>
                          <Span fs="12px" margin="6px 0 0">
                            {event.properties.attendees.length} attending
                          </Span>
                        </Flex>
                      </div>
                    </CardSm>
                  );
                })
              ) : (
                <div></div>
              )}
            </Grid>

            {/* This message is displayed when the map first loads */}
            {/* This mapbox methods require the map to be panned so data on the map can be queried */}
            {!sidebarListings.length && (
              <Container
                margin="100px 0 0"
                w="100%"
                talign="center"
                bg={theme.colors.navbar}
              >
                <Span color={theme.colors.buttonOne} fs="22px" fw="600">
                  Pan map to search for events
                </Span>
              </Container>
            )}
          </Container>

          {/* Mapbox containers for map */}
          <Container h="90vh" w="50%">
            <Container
              h="100%"
              w="100%"
              position="absolute"
              ref={mapContainer}
            />
          </Container>
        </FlexRow>
      </Container>
      <Footer />
    </PageTitle>
  );
}

export default EventsMap;
