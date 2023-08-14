import { useEffect, useState, useContext, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { DataContext } from "../context/DataContext";
import { FaChevronLeft } from "react-icons/fa";
import Carousel1 from "../components/Carousel1";
import Carousel2 from "../components/Carousel2";
import Share from "../components/Share";
import { createPortal } from "react-dom";
import useCarousel from "../../hooks/useCarousel";
import Section from "./Section";
import SearchResults from "../components/SearchResults";
import Fuse from "fuse.js";

export default function Search() {
  const navigate = useNavigate();
  const { query: q, selected } = useParams();
  const [query, setQuery] = useState(q);
  const [finalQuery, setFinalQuery] = useState(q);
  const [showBars, setShowBars] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const prevScrollPos = useRef(null);
  const { shuffleSearchResults, data, saved, carouselsLoaded, dispatchLoaded } =
    useContext(DataContext);

  let [filteredData, setFilterData] = useState([]);
  // shuffleSearchResults ? data[selected].data : data[selected].data;
  // shuffleSearchResults ? shuffleArray(data) : data
  // const { handleCarouselSwipe, setTotal } = useCarousel();
  const howToLoadData = {
    total: filteredData.length,
    type: "search",
    dispatchLoaded,
    carouselsLoaded,
  };

  let searchData = [];
  // selected == -1 ? data.flatMap((d) => d.data) : data[selected].data;
  switch (selected) {
    case "gifs": {
      searchData = data[data.length - 1].data;
      break;
    }
    case "saved": {
      searchData = data.filter((d) => saved.includes(d.id));
      break;
    }
    default:
      searchData = data;
  }

  function selectResult(item) {
    setFinalQuery(item);
    setQuery(item);
    setShowResults(false);
  }
  let fuse = useRef(null);
  useEffect(() => {
    fuse.current = new Fuse(data, {
      keys: ["name", "title"],
      includeScore: true,
      threshold: 0.2,
    });
  }, [data]);

  useEffect(() => {
    dispatchLoaded({ type: "search", payload: 4 });

    async function wait(time) {
      setFilterData([]);
      await new Promise((resolve, reject) => {
        setTimeout(resolve, time);
      });

      // let fdata = searchData.filter((item) =>
      //   item?.title?.toLowerCase()?.includes(query.toLowerCase())
      // );

      let fdata = fuse.current.search(query).map((item) => item.item);
      setFilterData(shuffleSearchResults ? shuffleArray(fdata) : fdata);
      // setTotal(fdata.length);
      console.log(fdata);
    }
    if (query != "") wait(0.1);
  }, [finalQuery]);

  const handleScroll = () => {
    const currentScrollPos = window.scrollY;
    console.log(`${prevScrollPos.current}  ${currentScrollPos}`);
    setShowBars(currentScrollPos < prevScrollPos.current);
    prevScrollPos.current = currentScrollPos;
  };

  return (
    <div className="search">
      {showBars && (
        <form
          action=""
          className={"search-bar mini-search-bar "}
          onSubmit={(e) => {
            e.preventDefault();
            setFinalQuery(query);
            setShowResults(false);
            // navigate(`/search/${selected}/${query}`);
            // if (query != e.target.query.value) setQuery(e.target.query.value);
            dispatchLoaded({ type: "saved", payload: 4 });
          }}
        >
          <button
            className="back-btn"
            type="button"
            onClick={() => navigate(-1)}
          >
            <FaChevronLeft class="btn" />
          </button>
          <input
            type="text"
            name="query"
            className="search-bar-input"
            value={query}
            onChange={(e) => {
              setShowResults(true);
              setQuery(e.target.value);
            }}
          />
        </form>
      )}
      {showResults && <SearchResults name={query} onSelect={selectResult} />}

      <Section
        data={filteredData}
        howToLoadData={howToLoadData}
        type="search"
        setMiniSearchBar={setShowBars}
      />
    </div>
  );
}

function shuffleArray() {}
