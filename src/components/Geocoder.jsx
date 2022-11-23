import React, { useEffect, useState, useRef } from "react";
// CSS style sheets
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

function Geocoder({ setEventData }) {
  // useRef is used to set styles on clearButton
  const clearButton = useRef(null);
  // saved state for the address input field
  const [input, setInput] = useState("");
  // saved state for the suggestions recieved from the mapbox geocoding api call
  const [suggestions, setSuggestions] = useState([]);
  // saved state for the selected address
  const [savedAddress, setSavedAddress] = useState("");
  // mapbox API token
  const token = process.env.REACT_APP_MAPBOX_API_KEY;

  // each time a keystroke is entered into the input field
  // the mapbox geocoding API is called and
  // then the response is saved as suggestions
  const handleChange = async (event) => {
    setInput(event.target.value);
    try {
      const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${event.target.value}.json?access_token=${token}&autocomplete=true`;
      const response = await fetch(endpoint);
      const results = await response.json();
      setSuggestions(results?.features);
    } catch (e) {
      console.log("Error fetching data, ", e);
    }
  };

  // When a suggestion is clicked, the address is saved in state as savedAddress
  // The place_name and coordinates are then used to update the state of the eventForm (parent component)
  // setEventData is passed down in props
  useEffect(() => {
    console.log(savedAddress);
    if (savedAddress) {
      setEventData((prev) => {
        return {
          ...prev,
          address: savedAddress.place_name,
          coordinates: savedAddress.geometry.coordinates,
        };
      });
    }
    // eslint-disable-next-line
  }, [savedAddress]);

  // The clearButton style is set to block once the input field has been inputted
  useEffect(() => {
    if (input !== "") {
      clearButton.current.style.display = "block";
    }
  }, [input]);

  // Classnames are taken directly from the mapbox geocoder css stylesheet "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css"
  // It was simpler to use pre-existing mapbox css styling then to re-write the css styling
  return (
    <div id="geocoder">
      <div className="mapboxgl-ctrl-geocoder mapboxgl-ctrl">
        <svg
          className="mapboxgl-ctrl-geocoder--icon mapboxgl-ctrl-geocoder--icon-search"
          viewBox="0 0 18 18"
          width="18"
          height="18"
        >
          <path d="M7.4 2.5c-2.7 0-4.9 2.2-4.9 4.9s2.2 4.9 4.9 4.9c1 0 1.8-.2 2.5-.8l3.7 3.7c.2.2.4.3.8.3.7 0 1.1-.4 1.1-1.1 0-.3-.1-.5-.3-.8L11.4 10c.4-.8.8-1.6.8-2.5.1-2.8-2.1-5-4.8-5zm0 1.6c1.8 0 3.2 1.4 3.2 3.2s-1.4 3.2-3.2 3.2-3.3-1.3-3.3-3.1 1.4-3.3 3.3-3.3z"></path>
        </svg>
        <input
          type="text"
          className="mapboxgl-ctrl-geocoder--input"
          placeholder="Search"
          aria-label="Search"
          value={input}
          onChange={handleChange}
        />

        {/* the suggested address strings needed to be split into two lines */}
        {/* for example... the suggestions string is like this "10 Queen Street, Brisbane City Queensland 4000, Australia" */}
        {/* however it needs to be split so as to display the first part of the address in bold text on the first line of the suggestion which is displayed to the user */}
        {/* the address was split on [,] and made into an array */}
        {/* the first item is removed and the remainder is saved as cityCountry and displayed on the second line */}
        {suggestions?.length > 0 && (
          <div className="suggestions-wrapper">
            <ul className="suggestions">
              {suggestions.map((suggestion, index) => {
                const arr = suggestion.place_name.split(/[,]+/);
                // eslint-disable-next-line
                const street = arr.shift();
                const cityCountry = arr.join();
                return (
                  <li
                    key={index}
                    onClick={() => {
                      setInput(suggestion.place_name);
                      setSuggestions([]);
                      setSavedAddress(suggestion);
                    }}
                  >
                    {/* eslint-disable-next-line */}
                    <a>
                      <div className="mapboxgl-ctrl-geocoder--suggestion">
                        <div className="mapboxgl-ctrl-geocoder--suggestion-title">
                          {suggestion.place_name.split(/[,]+/)[0]}
                        </div>
                        <div class="mapboxgl-ctrl-geocoder--suggestion-address">
                          {cityCountry}
                        </div>
                      </div>
                    </a>
                  </li>
                );
              })}
              <div className="mapboxgl-ctrl-geocoder--powered-by">
                {/* eslint-disable-next-line */}
                <a>Powered by Mapbox</a>
              </div>
            </ul>
          </div>
        )}
        <div className="mapboxgl-ctrl-geocoder--pin-right">
          <button
            aria-label="Clear"
            className="mapboxgl-ctrl-geocoder--button"
            ref={clearButton}
            onClick={() => {
              setInput("");
              setSuggestions([]);
            }}
          >
            <svg
              className="mapboxgl-ctrl-geocoder--icon mapboxgl-ctrl-geocoder--icon-close"
              viewBox="0 0 18 18"
              width="18"
              height="18"
            >
              <path d="M3.8 2.5c-.6 0-1.3.7-1.3 1.3 0 .3.2.7.5.8L7.2 9 3 13.2c-.3.3-.5.7-.5 1 0 .6.7 1.3 1.3 1.3.3 0 .7-.2 1-.5L9 10.8l4.2 4.2c.2.3.7.3 1 .3.6 0 1.3-.7 1.3-1.3 0-.3-.2-.7-.3-1l-4.4-4L15 4.6c.3-.2.5-.5.5-.8 0-.7-.7-1.3-1.3-1.3-.3 0-.7.2-1 .3L9 7.1 4.8 2.8c-.3-.1-.7-.3-1-.3z"></path>
            </svg>
          </button>
          <svg
            className="mapboxgl-ctrl-geocoder--icon mapboxgl-ctrl-geocoder--icon-loading"
            viewBox="0 0 18 18"
            width="18"
            height="18"
          >
            <path
              fill="#333"
              d="M4.4 4.4l.8.8c2.1-2.1 5.5-2.1 7.6 0l.8-.8c-2.5-2.5-6.7-2.5-9.2 0z"
            ></path>
            <path
              opacity=".1"
              d="M12.8 12.9c-2.1 2.1-5.5 2.1-7.6 0-2.1-2.1-2.1-5.5 0-7.7l-.8-.8c-2.5 2.5-2.5 6.7 0 9.2s6.6 2.5 9.2 0 2.5-6.6 0-9.2l-.8.8c2.2 2.1 2.2 5.6 0 7.7z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default Geocoder;
