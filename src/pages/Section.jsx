import {
  useEffect,
  useContext,
  useState,
  useRef,
  createRef,
  useLayoutEffect,
} from "react";
import Carousel1 from "../components/Carousel1";
import Carousel2 from "../components/Carousel2";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { DataContext } from "../context/DataContext";
import useCarousel from "../../hooks/useCarousel";
import Share from "../components/Share";
import { createPortal } from "react-dom";
import Suggest from "../components/Suggest";
import axios from "axios";

export default function Section({
  data,
  setData,
  howToLoadData,
  type,
  setMiniSearchBar,
}) {
  howToLoadData.total = data.length;
  const { handleCarouselSwipe, setTotal } = useCarousel(howToLoadData);
  const {
    scrollPos,
    dispatch,
    carouselsLoaded,
    dispatchLoaded,
    persistantScroll,
    isCarousel2,
    setShowBars,
  } = useContext(DataContext);
  // const [finalData, setFinalData] = useState([]);
  const [share, setShare] = useState(false);
  const [suggestions, setSuggestions] = useState(false);
  const [suggName, setSuggName] = useState("");
  const [id, setId] = useState(-1);
  const shareIdRef = useRef(null);
  const navigate = useNavigate();
  const prevScrollPos = useRef(null);
  const sectionRef = useRef(null);
  const cleanupRef = useRef(null);

  const showShare = (obj) => {
    openOverlay();
    setShare(true);
    shareIdRef.current = obj;
  };
  const openOverlay = () => {
    document.getElementById("overlay").classList.remove("hidden");
  };
  const removeOverlay = (e) => {
    console.log(e);
    if (!document.querySelector(".suggestions").contains(e.target)) {
      setShare(false);
      setSuggestions(false);
      document.getElementById("overlay").classList.add("hidden");
    }
  };
  const foreCloseOverlay = (e) => {
    document.getElementById("overlay").classList.add("hidden");
  };
  const handleScroll = () => {
    const currentScrollPos = sectionRef.current.scrollTop;
    // console.log(currentScrollPos, prevScrollPos.current);
    setShowBars(currentScrollPos < prevScrollPos.current);
    setMiniSearchBar?.(currentScrollPos < prevScrollPos.current);
    prevScrollPos.current = currentScrollPos;
  };

  function showSuggestions({ title, id }) {
    openOverlay();
    setSuggestions(true);
    setSuggName(title);
    setId(id);
  }

  function selectSuggestion(name) {
    setSuggestions(false);
    foreCloseOverlay();
    let index = -1;
    for (let i = 0; i < data.length; i++) {
      if (data[i].id == id) {
        index = i;
        break;
      }
    }
    axios
      .post(`${import.meta.env.VITE_SERVER}/data/update-name`, {
        name,
        id,
      })
      .then((res) => console.log(res));

    data[index].name = name;
    setData([...data]);
  }

  useEffect(() => {
    // howToLoadData.total = data.length;
    setTotal(data.length);
  }, [data]);

  // For Persistant Scroll
  useEffect(() => {
    const sectionCopy = sectionRef.current;
    setShowBars(true);
    setMiniSearchBar?.(true);
    async function wait() {
      // console.log(`scrolled to: ${scrollPos[type]}`);
      if (sectionCopy) {
        await new Promise((res, rej) => {
          // console.log(`scrollled to: ${scrollPos[type]}`);
          setTimeout(() => {
            sectionRef.current.scrollTo({
              top: scrollPos[type],
              behavior: "instant",
            });
            res();
          }, 20);
        });
        setTimeout(() => {
          setShowBars(true);
        }, 20);
      }
    }
    if (persistantScroll) wait();

    sectionCopy.addEventListener("scroll", handleScroll);
    cleanupRef.current = () => {
      sectionCopy.removeEventListener("scroll", handleScroll);
    };
    return () => {
      cleanupRef.current(); // Call the cleanup function
    };
  }, [persistantScroll, scrollPos, type]);
  // useEffect(() => {
  //   async function wait() {
  //     await new Promise((res, rej) => {
  //       console.log(`scrollled to: ${scrollPos[type]}`);
  //       setTimeout(() => {
  //         sectionRef.current.scrollTo({
  //           top: scrollPos[type],
  //           behavior: "instant",
  //         });
  //         res();
  //       }, 30);
  //     });
  //     setTimeout(() => {
  //       setShowBars(true);
  //     }, 25);
  //   }

  //   if (persistantScroll) wait();
  //   const sectionCopy = sectionRef.current;
  //   sectionRef.current.addEventListener("scroll", handleScroll);
  //   return () => {
  //     sectionCopy?.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  // event lis for overlay and window scroll
  useEffect(() => {
    document.getElementById("overlay").addEventListener("click", removeOverlay);
    // document
    //   .querySelector(".section .section-carousels")
    //   .addEventListener("scroll", removeOverlay);
    return () => {
      document
        .getElementById("overlay")
        .removeEventListener("click", removeOverlay);
      document
        .getElementById("overlay")
        .removeEventListener("scroll", removeOverlay);
    };
  }, []);

  return (
    <div className="x section">
      {/* <p>loaded carousels: {carouselsLoaded[type]}</p> */}
      <div className="section-carousels" ref={sectionRef}>
        {data
          .slice(0, carouselsLoaded[type])
          .map((item, index) =>
            isCarousel2 ? (
              <Carousel2
                key={index}
                type={type}
                onShare={showShare}
                showSuggestions={showSuggestions}
                id={item.id}
                images={item?.images}
                title={item?.title}
                name={item?.name}
                onSwipe={() => handleCarouselSwipe(index)}
              />
            ) : (
              <Carousel1
                key={index}
                type={type}
                onShare={showShare}
                id={item.id}
                images={item?.images}
                name={item?.name}
                title={item?.title}
                onSwipe={() => handleCarouselSwipe(index)}
              />
            )
          )}
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
      {suggestions &&
        createPortal(
          <Suggest name={suggName} onSelect={selectSuggestion} />,
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
