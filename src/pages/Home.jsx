import {
  useEffect,
  useContext,
  useState,
  useRef,
  createRef,
  useLayoutEffect,
} from "react";
import Carousel from "../components/Carousel";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { DataContext } from "../context/DataContext";
import useCarousel from "../../hooks/useCarousel";
import Share from "../components/Share";
import { createPortal } from "react-dom";

export default function Home({ setShowBars }) {
  const {
    shuffleSection,
    data,
    saved,
    scrollPos,
    dispatch,
    carouselsLoaded,
    dispatchLoaded,
    persistantScroll,
  } = useContext(DataContext);
  const [finalData, setFinalData] = useState([]);
  const [share, setShare] = useState(false);
  const shareIdRef = useRef(null);
  const navigate = useNavigate();
  const { selected } = useParams();
  let savedData = data;
  const isMounted = useRef(null);

  const howToLoadData = {
    initial: carouselsLoaded.home || 5,
    load: 4,
    carouselsLoaded,
    dispatchLoaded,
    swipeOnLast: 3,
    type: "home",
    total: savedData.length,
  };

  const { handleCarouselSwipe } = useCarousel(howToLoadData);
  useEffect(() => {
    // dispatch(s)
    async function wait(time) {
      setFinalData([]);
      await new Promise((res, rej) => setTimeout(res, time));
      setFinalData(data);
      // setFinalData(shuffleSection ? shuffleArray([...savedData]) : savedData);
    }

    wait(0.1);

    document.getElementById("overlay").addEventListener("click", removeOverlay);
    window.addEventListener("scroll", removeOverlay);
    return () => {
      document
        .getElementById("overlay")
        .removeEventListener("click", removeOverlay);
      document
        .getElementById("overlay")
        .removeEventListener("scroll", removeOverlay);
    };
  }, []);

  useEffect(() => {
    async function wait() {
      await new Promise((res, rej) => {
        setTimeout(() => {
          scrollTo({ top: scrollPos.home, behavior: "instant" });
          res();
        }, 35);
      });
      setTimeout(() => {
        setShowBars(true);
      }, 25);
    }

    if (persistantScroll) wait();
  }, []);

  // useLayoutEffect(() => {
  //   async function scrollAndWait() {
  //     const waitAndScroll = () => {
  //       setTimeout(() => {
  //         window.scrollTo({ top: scrollPos.home, behavior: "instant" });
  //       }, 5); // Using a minimal delay of 0ms to ensure it runs after layout updates
  //     };

  //     waitAndScroll();
  //   }
  // }, []);
  const documentLoaded = useRef(null);
  useLayoutEffect(() => {
    function waitAndScroll() {
      if (documentLoaded.current) {
        window.scrollTo({ top: scrollPos.home, behavior: "instant" });

        // Now you can perform other actions after scrolling
        // For example, setShowBars(true);
      } else {
        document.addEventListener("DOMContentLoaded", () => {
          documentLoaded.current = true;
        });
      }
    }

    waitAndScroll();
  }, []);

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

  return (
    <div className="x section">
      {/* <p>loaded carousels: {loadedCarousels}</p> */}
      <div className="section-carousels">
        {finalData.slice(0, carouselsLoaded.home).map((item, index) => (
          <div key={index}>
            <Carousel
              key={index}
              type={selected}
              removeCarouselFromSaved={(id) => {
                finalData.splice(id, 1);
                setFinalData([...finalData]);
              }}
              onShare={showShare}
              id={item.id}
              images={item?.images}
              name={item?.title?.replace("-", " ").replace("?", "")}
              onSwipe={() => handleCarouselSwipe(index)}
            />
          </div>
        ))}
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

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  // setLoadedCarousels(4);
  return array;
}
