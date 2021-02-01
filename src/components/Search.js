import React, { useState, Fragment } from "react";
import SearchResults from "./SearchResults";
import "../assets/stylesheets/Search.css";
import { IonButton } from "@ionic/react";
const Search = () => {
  const [query, setQuery] = useState("");

  const onChange = (e) => {
    setQuery(e.currentTarget.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Fragment>
      <form onSubmit={onSubmit} className="search-form">
        <input
          type="text"
          value={query}
          onChange={onChange}
          className="search-bar"
        />
        {/* <IonButton>Search</IonButton> */}
      </form>
      <SearchResults query={query} />
    </Fragment>
  );
};
export default Search;
