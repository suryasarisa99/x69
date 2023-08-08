import { useEffect, useContext, useState, useRef, createRef } from "react";
import Carousel from "../components/Carousel";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { DataContext } from "../context/DataContext";
import useCarousel from "../../hooks/useCarousel";
import Share from "../components/Share";
import { createPortal } from "react-dom";

export default function AiRemover() {
  const { shuffleSection, data, saved } = useContext(DataContext);
  const [finalData, setFinalData] = useState([]);
  const [share, setShare] = useState(false);
  const shareIdRef = useRef(null);
  const navigate = useNavigate();
  const { selected } = useParams();
  let savedData = data;

  const howToLoadData = {
    initial: 5,
    load: 4,
    swipeOnLast: 3,
    total: savedData.length,
  };
  useEffect(() => {
    async function wait(time) {
      setFinalData([]);
      await new Promise((res, rej) => setTimeout(res, time));
      setFinalData(shuffleSection ? shuffleArray(savedData) : savedData);
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

  const { loadedCarousels, setLoadedCarousels, handleCarouselSwipe } =
    useCarousel(howToLoadData);

  return (
    <div className="x section">
      <div className="section-carousels">
        {finalData.slice(0, loadedCarousels).map((item, index) => (
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
