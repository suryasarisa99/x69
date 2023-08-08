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
          if (type == "saved") dispatch({ type, payload: scrollY });
          else if (type == "home") dispatch({ type, payload: scrollY });
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
