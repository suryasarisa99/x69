import { useState, useEffect, useRef, useContext } from "react";
import { DataContext } from "../context/DataContext";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { BsShareFill } from "react-icons/bs";
import "./style.scss";
export default function Carousel({
  images: imagesX,
  name,
  onSwipe,
  onShare,
  id,
  type,
  removeCarouselFromSaved,
}) {
  const { slide, lastImg, reverseOrder, saved, setSaved } =
    useContext(DataContext);
  let [isSaved, setIsSaved] = useState(saved.includes(id));
  let limit = 50;

  let [images, setImages] = useState(
    reverseOrder ? [...imagesX].reverse() : imagesX
  );

  let [selected, setSelected] = useState(lastImg ? images.length - 1 : 0);

  if (!images || images.length == 0) return null;

  const onDotClick = (index) => {
    setSelected(index);
  };
  const addBookMark = () => {
    setIsSaved(true);
    setSaved((prv) => [...prv, id]);
  };
  const removeBookMark = () => {
    setIsSaved(false);
    saved.splice(saved.indexOf(id), 1);
    setSaved([...saved]);
    if (type == "saved") removeCarouselFromSaved(id);
  };
  //   let calc = `calc(${pos}px + -${selected}00%)`;

  return (
    <div className="carousel2" onTouchStart={onSwipe}>
      <div className="sep"></div>
      <div className="images-container">
        {images.map((image, index) => {
          return (
            <div key={index + id} className="img-box">
              <img key={index + id} src={image} alt="man" loading="lazy" />
            </div>
          );
        })}
        {/* {images.length > 1 && (
          <div className="dots">
            {images.map((_, index) => {
              return (
                <Dot
                  key={index}
                  selected={selected == index}
                  onClick={onDotClick}
                  index={index}
                />
              );
            })}
          </div>
        )} */}
      </div>
      {/* <div className="top">
        <div className="name">{name}</div>
        <div className="icons">
          <BsShareFill
            className="share-icon"
            onClick={() => onShare({ id, name })}
          />
          {isSaved ? (
            <FaBookmark className="bookmark" onClick={removeBookMark} />
          ) : (
            <FaRegBookmark className="bookmark" onClick={addBookMark} />
          )}
        </div>
      </div> */}
    </div>
  );
}

function Dot({ selected, onClick, index }) {
  return (
    <div
      className={`dot ${selected ? "selected-dot" : ""}`}
      onClick={() => onClick(index)}
    ></div>
  );
}