import { useContext } from "react";
import { DataContext } from "../context/DataContext";
import { useParams } from "react-router-dom";
import Carousel1 from "../components/Carousel1";
import Carousel2 from "../components/Carousel2";

export default function Shared() {
  const { data, isCarousel2 } = useContext(DataContext);
  const { id } = useParams();
  console.log(data.flatMap((d) => d.data));
  let item = data.filter((item) => item.id == id)[0];
  console.log(item);
  return (
    <div>{isCarousel2 ? <Carousel2 {...item} /> : <Carousel1 {...item} />}</div>
  );
}
