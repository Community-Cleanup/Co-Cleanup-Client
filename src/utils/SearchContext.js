//Search Context creates a global state for the search bar input field
// This is so that the search bar state can be passed to the EventsMap component and used for filtering events
// SearchProvider wraps all routes in App.js to provide {searchBar, setSearchBar} to the application

import React, { useState, useContext } from "react";

const SearchContext = React.createContext();

const SearchProvider = ({ children }) => {
  const [searchBar, setSearchBar] = useState("");

  return (
    <SearchContext.Provider value={{ searchBar, setSearchBar }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useGlobalSearchContext = () => {
  return useContext(SearchContext);
};

export { SearchContext, SearchProvider };
