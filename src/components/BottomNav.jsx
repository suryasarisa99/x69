import { useState, useEffect, useContext } from "react";
import { DataContext } from "../context/DataContext";
import { useLocation, useNavigate } from "react-router-dom";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { BsGear, BsGearFill, BsPlayBtn, BsPlayBtnFill } from "react-icons/bs";
import { AiFillHome, AiOutlineHome } from "react-icons/ai";

export default function BottomNav() {
  const { scrollPos, dispatch } = useContext(DataContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [previousPathname, setPreviousPathname] = useState("");

  useEffect(() => {
    setPreviousPathname(location.pathname);
  }, [location.pathname]);

  function saveScrollPos() {
    switch (location.pathname) {
      case "/":
        dispatch({ type: "home", payload: scrollY });
        console.log("savded scroll pos of home");
        break;
      case "/x/home":
        dispatch({ type: "home", payload: scrollY });
        console.log("savded scroll pos of home");
        console.log(scrollPos["home"]);
        break;
      case "/x/saved":
        dispatch({ type: "saved", payload: scrollY });
        console.log("savded scroll pos of Saved");
        break;
    }
  }
  function goHome() {
    saveScrollPos();
    navigate("/x/home");
  }
  function goSaved() {
    saveScrollPos();
    navigate("/x/saved");
  }
  function goVideos() {
    saveScrollPos();
    navigate("/x/videos");
  }
  function goSettings() {
    saveScrollPos();
    navigate("/x/settings");
  }
  useEffect(() => {
    console.log(location.pathname);
  }, [location.pathname]);
  const Home =
    location.pathname == "/" || location.pathname == "/x/home"
      ? AiFillHome
      : AiOutlineHome;
  const Videos = location.pathname == "/x/videos" ? BsPlayBtnFill : BsPlayBtn;
  const Saved = location.pathname == "/x/saved" ? FaBookmark : FaRegBookmark;
  const Settings = location.pathname == "/x/settings" ? BsGearFill : BsGear;

  return (
    <div className="bottom-nav">
      {/* <p>{location.pathname}</p> */}
      <div className="icons">
        <Home className="icon" onClick={goHome} />
        <Videos className="icon" onClick={goVideos} />
        <Saved className="icon" onClick={goSaved} />
        <Settings className="icon" onClick={goSettings} />
      </div>
    </div>
  );
}
