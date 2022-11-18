import React, { useState, useContext, useEffect } from "react";

const SearchContext = React.createContext();

const SearchProvider = ({ children }) => {
  const [searchBar, setSearchBar] = useState("");

  useEffect(() => {
    console.log("Searchbar", searchBar);
  }, [searchBar]);

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
