import { useEffect, useContext, useState, useRef, createRef } from "react";
import Carousel1 from "../components/Carousel1";
import Carousel2 from "../components/Carousel2";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { DataContext } from "../context/DataContext";
import useCarousel from "../../hooks/useCarousel";
import Share from "../components/Share";
import { createPortal } from "react-dom";
export default function Saved({ setShowBars }) {
  const {
    shuffleSaved,
    data,
    saved,
    carouselsLoaded,
    dispatchLoaded,
    scrollPos,
    isCarousel2,
    persistantScroll,
  } = useContext(DataContext);
  const [finalData, setFinalData] = useState([]);
  const [share, setShare] = useState(false);
  const shareIdRef = useRef(null);
  const navigate = useNavigate();
  const { selected } = useParams();
  let savedData = data.filter((d) => saved.includes(d.id));

  const howToLoadData = {
    initial: 5,
    load: 4,
    type: "saved",
    carouselsLoaded,
    dispatchLoaded,
    swipeOnLast: 3,
    total: savedData.length,
  };
  useEffect(() => {
    async function wait(time) {
      setFinalData([]);
      await new Promise((res, rej) => setTimeout(res, time));
      setFinalData(shuffleSaved ? shuffleArray(savedData) : savedData);
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
          scrollTo({ top: scrollPos.saved, behavior: "instant" });
          res();
        }, 35);
      });
      setTimeout(() => {
        setShowBars(true);
      }, 25);
    }
    if (persistantScroll) wait();
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

  const { handleCarouselSwipe } = useCarousel(howToLoadData);

  return (
    <div className="saved section">
      <div className="section-carousels">
        {finalData.slice(0, carouselsLoaded.saved).map((item, index) => (
          <div key={index}>
            {isCarousel2 ? (
              <Carousel2
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
            ) : (
              <Carousel1
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
            )}
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
      {/* <Share /> */}
    </div>
  );
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
