import { useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DataContext } from "../context/DataContext";
export default function SearchBar({ type }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { scrollPos, dispatch } = useContext(DataContext);
  useEffect(() => {}, [location.pathname]);
  if (type == "none") return null;
  return (
    <div>
      <form
        action=""
        className="search-bar"
        onSubmit={(e) => {
          e.preventDefault();
          const sec = document.querySelector(".section-carousels");
          if (type == "saved") dispatch({ type, payload: sec.scrollTop });
          else if (type == "home") dispatch({ type, payload: sec?.scrollTop });
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
