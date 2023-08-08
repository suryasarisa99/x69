import { useContext } from "react";
import { DataContext } from "../context/DataContext";
import { useParams } from "react-router-dom";
import Carousel from "../components/Carousel";

export default function Shared() {
  const { data } = useContext(DataContext);
  const { id } = useParams();
  console.log(data.flatMap((d) => d.data));
  let item = data.filter((item) => item.id == id)[0];
  console.log(item);
  return (
    <div>
      <Carousel {...item} />
    </div>
  );
}
