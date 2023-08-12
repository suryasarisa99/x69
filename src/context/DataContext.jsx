import { createContext, useState, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
let DataContext = createContext();

import datax from "../../dataWithIds.json";
// import datax from "../../repeatedItems.json";
import gifs from "../../data/data25.json";

export default function DataProvider({ children }) {
  const [login, setLogin] = useState(true);
  const [timeOut, setTimeOut] = useState(false);
  const [tempLogin, setTempLogin] = useState(false);
  const [wrongPass, setWrongPass] = useState(false);
  const [saved, setSaved] = useState(
    JSON.parse(localStorage.getItem("saved")) || []
  );
  // let [selectedData, setSelectedData] = useState()
  // localStorage.clear();
  // Toggle States
  let toggles = JSON.parse(localStorage.getItem("toggles")) || {};

  const [lastImg, setLastImg] = useState(
    toggles?.lastImg !== undefined ? toggles.lastImg : false
  );
  let [slide, setSlide] = useState(
    toggles?.slide !== undefined ? toggles.slide : false
  );
  let [reverseOrder, setReverseOrder] = useState(
    toggles?.reverse !== undefined ? toggles.reverse : false
  );
  let [shuffleSection, setShuffleSection] = useState(
    toggles?.shuffleSection !== undefined ? toggles.shuffleSection : false
  );
  let [shuffleSaved, setShuffleSaved] = useState(
    toggles?.shuffleSaved !== undefined ? toggles.shuffleSaved : false
  );
  let [shuffleSearchResults, setShuffleSearchResults] = useState(
    toggles?.shuffleResults !== undefined ? toggles.shuffleResults : false
  );
  let [persistantScroll, setPersistantScroll] = useState(
    toggles?.persistantScroll !== undefined ? toggles.persistantScroll : false
  );
  let [isCarousel2, setIsCarousel2] = useState(
    toggles?.carousel2 !== undefined ? toggles.carousel2 : false
  );
  const [data, setData] = useState(datax);
  // let [finalData, setFinalData] = useState(
  //   shuffleSection ? shuffleArray(data) : data
  // );
  const reducer = (state, action) => {
    return { ...state, [action.type]: action.payload };
  };
  const [scrollPos, dispatch] = useReducer(reducer, {
    home: 0,
    saved: 0,
    search: 0,
  });
  const [carouselsLoaded, dispatchLoaded] = useReducer(reducer, {
    home: 4,
    saved: 4,
    search: 4,
  });

  useEffect(() => {
    localStorage.setItem("saved", JSON.stringify(saved));
  }, [saved]);
  useEffect(() => {
    setData((data) => (shuffleSection ? shuffleArray(data) : data));
  }, []);

  const navigate = useNavigate();
  // useEffect(() => {
  //   let slideToggle = JSON.parse(localStorage.getItem("slide"));
  //   let reverseToggle = JSON.parse(localStorage.getItem("reverse"));
  //   let lastImgToggle = JSON.parse(localStorage.getItem("last-img"));
  //   let shuffleSectionsToggle = JSON.parse(
  //     localStorage.getItem("shuffle-section")
  //   );
  //   let shuffleResultsToggle = JSON.parse(
  //     localStorage.getItem("shuffle-results")
  //   );
  //   if (slideToggle) setSlide(slideToggle);
  //   if (reverseToggle) setReverseOrder(reverseToggle);
  //   if (lastImgToggle) setLastImg(lastImgToggle);
  //   if (shuffleResultsToggle) setShuffleSearchResults(shuffleResultsToggle);
  //   if (shuffleSectionsToggle) setShuffleSection(shuffleSectionsToggle);
  // }, []);
  // async function wait(time) {
  // await new Promise((resolve, reject) => {
  // setTimeout(resolve, time);
  // });

  // console.log(`slide: ${slideToggle} ${slide}`);
  // }
  // wait(1);
  // console.log(" toggles loaded");
  // let toggles = JSON.parse(localStorage.getItem("toggles"));
  // if (toggles?.slide) setSlide(toggles.slide);
  // if (toggles?.reverse) setReverseOrder(toggles.reverse);
  // if (toggles?.lastImg) setReverseOrder(toggles.lastImg);

  // axios
  //   .get(`${import.meta.env.VITE_SERVER}/status`, { withCredentials: true })
  //   .then((res) => {
  //     console.log(res.data);
  //     if (res.data.status) {
  //       setLogin(true);
  //       setTimeOut(res.data.timeOut);
  //     }
  //   });

  const handlePass = (e) => {
    e.preventDefault();
    axios
      .post(
        `${import.meta.env.VITE_SERVER}/login`,
        {
          pass: e.target.pass.value,
        },
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res.data);
        if (res.data.status) {
          setLogin(true);
          setTimeOut(res.data.timeOut);

          navigate("/home");
        }
      });
  };
  const handleTempPass = (e) => {
    e.preventDefault();
    axios
      .post(
        `${import.meta.env.VITE_SERVER}/temp-login`,
        {
          pass: e.target.pass.value,
        },
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res.data);
        if (res.data.status) {
          if (wrongPass) setWrongPass(false);
          console.log();
          setTempLogin(true);
          setTimeOut(res.data.timeOut);
          navigate("/");
        } else setWrongPass(true);
      });
  };

  return (
    <DataContext.Provider
      value={{
        login,
        tempLogin,
        timeOut,
        wrongPass,
        setWrongPass,
        setTimeOut,
        setLogin,
        setTempLogin,
        handlePass,
        handleTempPass,
        slide,
        lastImg,
        setLastImg,
        setSlide,
        reverseOrder,
        setReverseOrder,
        shuffleSearchResults,
        shuffleSection,
        setShuffleSearchResults,
        setShuffleSection,
        data,
        setData,
        saved,
        setSaved,
        toggles,
        shuffleSaved,
        setShuffleSaved,
        dispatch,
        scrollPos,
        carouselsLoaded,
        dispatchLoaded,
        persistantScroll,
        setPersistantScroll,
        isCarousel2,
        setIsCarousel2,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export { DataContext };
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  // setLoadedCarousels(4);
  return array;
}
