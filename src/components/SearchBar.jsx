import { useEffect, useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DataContext } from "../context/DataContext";
import SearchResults from "./SearchResults";
export default function SearchBar({ type }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showResults, setShowResults] = useState(false);
  const [query, setQuery] = useState("");
  const { scrollPos, dispatch } = useContext(DataContext);
  useEffect(() => {}, [location.pathname]);
  if (type == "none") return null;

  function handleSearch(e) {
    e?.preventDefault();
    const sec = document.querySelector(".section-carousels");
    if (type == "saved") dispatch({ type, payload: sec.scrollTop });
    else if (type == "home") dispatch({ type, payload: sec?.scrollTop });
    navigate(`/search/${type}/${query}`);
  }
  function handleSearch2(result) {
    // e?.preventDefault();
    const sec = document.querySelector(".section-carousels");
    if (type == "saved") dispatch({ type, payload: sec.scrollTop });
    else if (type == "home") dispatch({ type, payload: sec?.scrollTop });
    navigate(`/search/${type}/${result}`);
  }
  return (
    <div>
      <form action="" className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          name="query"
          value={query}
          onChange={(e) => {
            if (!showResults) setShowResults(true);
            setQuery(e.target.value);
          }}
          className="search-bar-input"
          placeholder="Search"
        />
      </form>
      {showResults && <SearchResults name={query} onSelect={handleSearch2} />}
    </div>
  );
}
