import Admin from "./Admin";
import { Outlet } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useNavigate, Routes, Route, useLocation } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import SearchBar from "../components/SearchBar";
import Videos from "./Videos";
import Saved from "./Saved";
import Settings from "./Settings";
import Home from "./Home";
export default function X() {
  const navigate = useNavigate();
  const [showBars, setShowBars] = useState(true);
  const prevScrollPos = useRef(null);
  const location = useLocation();

  const handleScroll = () => {
    const currentScrollPos = window.scrollY;
    // console.log(`${prevScrollPos.current}  ${currentScrollPos}`);
    // console.log(currentScrollPos < prevScrollPos.current);
    setShowBars(currentScrollPos < prevScrollPos.current);
    prevScrollPos.current = currentScrollPos;
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // document.querySelector(".sample").addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
