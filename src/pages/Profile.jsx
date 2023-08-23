import { useState, useContext, useRef, useEffect } from "react";
import { DataContext } from "../context/DataContext";
import { useNavigate, useParams } from "react-router-dom";

import Section from "./Section";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
export default function Profile() {
  const { name } = useParams();
  const { data, carouselsLoaded, dispatchLoaded } = useContext(DataContext);
  const navigate = useNavigate();
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profileData, setProfileData] = useState([]);

  useEffect(() => {
    const fData = data.filter((item) => item?.name == name);
    const pic = fData?.[Math.floor(Math.random() * fData.length)]?.images[0];
    setProfilePhoto(pic);
    setProfileData(fData);
    dispatchLoaded({ type: "profile", payload: 2 });
  }, [name, data]);

  const howToLoadData = {
    initial: carouselsLoaded.profile || 3,
    load: 3,
    carouselsLoaded,
    dispatchLoaded,
    swipeOnLast: 3,
    _: "profile",
    total: profileData.length,
  };

  function getProfilePhoto() {}
  return (
    <div className="profile">
      <div className="head-bar">
        <div className="back-btn-outer" onClick={() => navigate(-1)}>
          <MdOutlineKeyboardBackspace className="back-btn-x" />
        </div>
        Profile
      </div>
      <div className="main">
        {/* <div className="pic"></div> */}
        <div className="image-container">
          <img src={profilePhoto} alt="" className="img" />
        </div>
        <div className="about">
          <div className="name">{name}</div>
          <p className="count">posts: {profileData.length}</p>
          <button
            className="google-search"
            onClick={() => open("https://www.google.com/search?q=" + name)}
          >
            Search In Google
          </button>
        </div>
      </div>

      <Section
        data={profileData}
        howToLoadData={howToLoadData}
        type_="profile"
      />
    </div>
  );
}
