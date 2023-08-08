import React from "react";
import { useNavigate } from "react-router-dom";
export default function SearchBar({ type }) {
  const navigate = useNavigate();
  if (type == "none") return null;
  return (
    <div>
      <form
        action=""
        className="search-bar"
        onSubmit={(e) => {
          e.preventDefault();
          navigate(`/search/${type}/${e.target.query.value}`);
        }}
      >
        <input
          type="text"
          name="query"
          className="search-bar-input"
          placeholder="Search"
        />
      </form>
    </div>
  );
}
