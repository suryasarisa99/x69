import { useState, useEffect, useContext } from "react";
import { DataContext } from "../context/DataContext";
import { useLocation, useNavigate } from "react-router-dom";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { BsGear, BsGearFill, BsPlayBtn, BsPlayBtnFill } from "react-icons/bs";
import { AiFillHome, AiOutlineHome } from "react-icons/ai";

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  function goHome() {
    navigate("/x/home");
  }
  function goSaved() {
    navigate("/x/saved");
  }
  function goVideos() {
    navigate("/x/videos");
  }
  function goSettings() {
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
