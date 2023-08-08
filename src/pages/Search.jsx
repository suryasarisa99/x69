import { useEffect, useState, useContext, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { DataContext } from "../context/DataContext";
import { FaChevronLeft } from "react-icons/fa";
import Carousel from "../components/Carousel";
import Share from "../components/Share";
import { createPortal } from "react-dom";
import useCarousel from "../../hooks/useCarousel";
export default function Search() {
  const navigate = useNavigate();
  const { query: q, selected } = useParams();
  const [query, setQuery] = useState(q);
  const [finalQuery, setFinalQuery] = useState(q);
  const [showBars, setShowBars] = useState(true);
  const [share, setShare] = useState(false);
  const shareIdRef = useRef(null);
  const prevScrollPos = useRef(null);
  const { shuffleSearchResults, data, saved } = useContext(DataContext);

  let [filteredData, setFilterData] = useState([]);
  // shuffleSearchResults ? data[selected].data : data[selected].data;
  // shuffleSearchResults ? shuffleArray(data) : data
  const { loadedCarousels, setLoadedCarousels, handleCarouselSwipe, setTotal } =
    useCarousel({ total: filteredData.length });

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

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    document.getElementById("overlay").addEventListener("click", removeOverlay);
    window.addEventListener("scroll", removeOverlay);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document
        .getElementById("overlay")
        .removeEventListener("click", removeOverlay);
      document
        .getElementById("overlay")
        .removeEventListener("scroll", removeOverlay);
    };
    // document.querySelector(".sample").addEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function wait(time) {
      setFilterData([]);
      await new Promise((resolve, reject) => {
        setTimeout(resolve, time);
      });

      let fdata = searchData.filter((item) =>
        item?.title
          ?.replace("-", " ")
          ?.replace("?", "")
          ?.toLowerCase()
          ?.includes(query.toLowerCase())
      );
      setFilterData(shuffleSearchResults ? shuffleArray(fdata) : fdata);
      setTotal(fdata.length);
    }
    if (query != "") wait(0.1);
  }, [finalQuery]);

  const handleScroll = () => {
    const currentScrollPos = window.scrollY;
    console.log(`${prevScrollPos.current}  ${currentScrollPos}`);
    console.log(currentScrollPos < prevScrollPos.current);
    setShowBars(currentScrollPos < prevScrollPos.current);
    prevScrollPos.current = currentScrollPos;
  };
  const openOverlay = () => {
    document.getElementById("overlay").classList.remove("hidden");
  };
  const removeOverlay = () => {
    document.getElementById("overlay").classList.add("hidden");
  };
  const showShare = (obj) => {
    openOverlay();
    setShare(true);
    shareIdRef.current = obj;
  };

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    setLoadedCarousels(4);
    return array;
  }

  return (
    <div className="search">
      {showBars && (
        <form
          action=""
          className={"search-bar mini-search-bar "}
          onSubmit={(e) => {
            e.preventDefault();
            setFinalQuery(query);
            // navigate(`/search/${selected}/${query}`);
            // if (query != e.target.query.value) setQuery(e.target.query.value);
            setLoadedCarousels(4);
          }}
        >
          {
            <button
              className="back-btn"
              type="button"
              onClick={() => navigate(-1)}
            >
              <FaChevronLeft class="btn" />
            </button>
          }
          <input
            type="text"
            name="query"
            className="search-bar-input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />
        </form>
      )}
      <div className="section-carousels section">
        {filteredData.slice(0, loadedCarousels).map((item, index) => {
          return (
            <Carousel
              key={index}
              images={item?.images}
              name={item?.title}
              onShare={showShare}
              id={item.id}
              onSwipe={() => handleCarouselSwipe(index)}
            />
          );
        })}
      </div>

      {share &&
        createPortal(
          <Share
            onClose={removeOverlay}
            id={shareIdRef.current.id}
            title={shareIdRef.current.name}
          />,
          document.getElementById("overlay")
        )}
    </div>
  );
}
