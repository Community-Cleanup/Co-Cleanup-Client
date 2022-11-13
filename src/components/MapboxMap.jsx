import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import "./MapboxMap.css";
// import markerImage from "../images/marker.png";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;

function MapboxMap({ searchedEvents }) {
  //The mapContainer useRef specifies that App should be drawn to the HTML page in the <div> with the attribute ref={mapContainer}.
  const mapContainer = useRef(null);
  const map = useRef(null);

  // The state stores the longitude, latitude, and zoom for the map. These values will all change as your user interacts with the map.
  const [lng, setLng] = useState(148.055033);
  const [lat, setLat] = useState(-25.978749);
  const [zoom, setZoom] = useState(3);
  const [eventMarkers, setEventMarkers] = useState({});
  // Holds visible airport features for filtering
  const [events, setEvents] = useState([]);

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
    // new mapboxgl.Marker()
    //   .setLngLat([148.055033, -25.978749])
    //   .addTo(map.current);
  });

  // This useEffect resets the values of lng, lat, and zoom when the map is moved by the user.
  // getCenter() is a Mapbox GL JS method, to get the new longitude and latitude of the point at the center of the map.
  // getZoom() is a Mapbox GL JS method, to determine the zoom level that the map is set to.
  // toFixed() is a JS method, to truncate the resulting floating point number to the specified number of digits.
  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
    // const bounds = map.current.getBounds();
    // console.log(bounds);
  });

  // When the geoJSON prop is updated in state
  // It sets this geoJSON data as the state for event markers
  // This code is required due to the time it takes to fetch the event locations, map to geoJSON and update state
  useEffect(() => {
    if (searchedEvents.length > 0) {
      let geoJSON = {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: searchedEvents.map((event) => {
            // console.log(event);
            return {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: event.coordinates,
              },
              properties: {
                title: event.title,
              },
            };
          }),
        },
      };
      //   console.log("goeJson:", geoJSON);
      setEventMarkers(geoJSON);
    }
  }, [searchedEvents]);

  // Create a popup, but don't add it to the map yet.
  // Close button is set to false, as this pop up will only be a hover effect
  const popup = new mapboxgl.Popup({
    closeButton: false,
  });

  const filterEl = document.getElementById("feature-filter");
  const listingEl = document.getElementById("feature-listing");

  function renderListings(features) {
    const empty = document.createElement("p");
    // Clear any existing listings
    listingEl.innerHTML = "";
    if (features.length) {
      for (const feature of features) {
        const itemLink = document.createElement("a");
        const label = `${feature.properties.title}`;
        itemLink.href = feature.properties.title;
        itemLink.target = "_blank";
        itemLink.textContent = label;
        itemLink.addEventListener("mouseover", () => {
          // Highlight corresponding feature on the map
          popup
            .setLngLat(feature.geometry.coordinates)
            .setText(label)
            .addTo(map.current);
        });
        listingEl.appendChild(itemLink);
      }

      // Show the filter input
      filterEl.parentNode.style.display = "block";
    } else if (features.length === 0 && filterEl.value !== "") {
      empty.textContent = "No results found";
      listingEl.appendChild(empty);
    } else {
      empty.textContent = "Drag the map to populate results";
      listingEl.appendChild(empty);

      // Hide the filter input
      filterEl.parentNode.style.display = "none";

      // remove features filter
      map.current.setFilter("points", ["has", "title"]);
    }
  }

  function Notice(props) {
    return <p>{props.message}</p>;
  }

  function Listings(props) {
    const listingLink = useRef(null);

    function handlePopUp(event) {
      listingLink.current.addEventListener("mouseover", () => {
        // Highlight corresponding feature on the map
        popup
          .setLngLat(event.geometry.coordinates)
          .setText(event.properties.title)
          .addTo(map.current);
      });
      return () => {
        listingLink.current.removeEventListener("mouseover", () => {
          // Highlight corresponding feature on the map
          popup
            .setLngLat(event.geometry.coordinates)
            .setText(event.properties.title)
            .addTo(map.current);
        });
      };
    }

    useEffect(() => {
      handlePopUp();
    }, []);

    return (
      <div id="feature-listing" className="listing">
        {props.events.features.map((event) => {
          return (
            <Link
              ref={listingLink}
              className="listing-link"
              onMouseOver={() => handlePopUp(event)}
            >
              {props.title}
            </Link>
          );
        })}
      </div>
    );
  }

  function normalize(string) {
    return string.trim().toLowerCase();
  }

  useEffect(() => {
    console.log("Filtered Events:", events);
  }, [events]);

  //Filtering
  useEffect(() => {
    if (Object.keys(eventMarkers).length > 0) {
      console.log("Event Markers:", eventMarkers);

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

      map.current.on("load", () => {
        map.current.addSource("points", eventMarkers);
        map.current.addLayer({
          id: "points",
          source: "points",
          type: "circle",
          paint: {
            "circle-color": "#4264fb",
            "circle-radius": 4,
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff",
          },
        });

        map.current.on("movestart", () => {
          // reset features filter as the map starts moving
          map.current.setFilter("points", ["has", "title"]);
        });

        map.current.on("moveend", () => {
          const features = map.current.queryRenderedFeatures({
            layers: ["points"],
          });

          if (features) {
            const uniqueFeatures = getUniqueFeatures(features, "title");
            // Populate features for the listing overlay.
            renderListings(uniqueFeatures);

            // Clear the input container
            filterEl.value = "";

            // Store the current features in sn `airports` variable to
            // later use for filtering on `keyup`.
            setEvents(uniqueFeatures);
          }
        });

        map.current.on("mousemove", "points", (e) => {
          // Change the cursor style as a UI indicator.
          map.current.getCanvas().style.cursor = "pointer";

          // Populate the popup and set its coordinates based on the feature.
          const feature = e.features[0];
          popup
            .setLngLat(feature.geometry.coordinates)
            .setText(`${feature.properties.title}`)
            .addTo(map.current);
        });

        map.current.on("mouseleave", "points", () => {
          map.current.getCanvas().style.cursor = "";
          popup.remove();
        });

        filterEl.addEventListener("keyup", (e) => {
          const value = normalize(e.target.value);

          // Filter visible features that match the input value.
          const filtered = [];
          for (const feature of events) {
            const name = normalize(feature.properties.title);
            //   const code = normalize(feature.properties.abbrev);
            //   if (name.includes(value) || code.includes(value)) {
            if (name.includes(value)) {
              filtered.push(feature);
            }
          }

          // Populate the sidebar with filtered results
          renderListings(filtered);

          // Set the filter to populate features into the layer.
          if (filtered.length) {
            map.current.setFilter("points", [
              "match",
              ["get", "title"],
              filtered.map((feature) => {
                return feature.properties.title;
              }),
              true,
              false,
            ]);
          }
        });

        // Call this function on initialization
        // passing an empty array to render an empty state
        renderListings(events);
      });
    }
  });

  return (
    <div className="map-div">
      <div class="map-overlay">
        <fieldset>
          <input
            id="feature-filter"
            type="text"
            placeholder="Filter results by name"
          />
        </fieldset>
        {/* <Listings events={events} /> */}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default MapboxMap;
