import Admin from "./Admin";
import { Outlet } from "react-router-dom";
import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, Routes, Route, useLocation } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import SearchBar from "../components/SearchBar";
import Videos from "./Videos";
import Saved from "./Saved";
import Settings from "./Settings";
import { DataContext } from "../context/DataContext";
import Home from "./Home";
export default function X() {
  const navigate = useNavigate();
  const { showBars, setShowBars } = useContext(DataContext);
  const location = useLocation();

  useEffect(() => {
    setShowBars(true);
  }, [location.pathname]);

  let searchType = "";
  switch (location.pathname) {
    case "/x/saved":
      searchType = "saved";
      break;
    case "/x/settings":
      searchType = "none";
      break;
    case "/":
    case "/x/home":
      searchType = "home";
  }

  return (
    <div className="x">
      {showBars && <SearchBar type={searchType} />}
      <Routes>
        <Route path="*" element={<Home setShowBars={setShowBars} />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/saved" element={<Saved setShowBars={setShowBars} />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      {showBars && <BottomNav />}
    </div>
  );
}
