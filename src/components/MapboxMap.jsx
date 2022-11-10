import React, { useState, useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "./MapboxMap.css";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;

function MapboxMap() {
  //The mapContainer useRef specifies that App should be drawn to the HTML page in the <div> with the attribute ref={mapContainer}.
  const mapContainer = useRef(null);
  const map = useRef(null);

  // The state stores the longitude, latitude, and zoom for the map. These values will all change as your user interacts with the map.
  const [lng, setLng] = useState(134.055033);
  const [lat, setLat] = useState(-25.978749);
  const [zoom, setZoom] = useState(3);

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
    const marker1 = new mapboxgl.Marker()
      .setLngLat([134.055033, -25.978749])
      .addTo(map.current);

    console.log("Initialise map 1");
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
    const bounds = map.current.getBounds();
    console.log(bounds);
    console.log("Initialise map 2");
  });

  return (
    <div className="map-div">
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default MapboxMap;
