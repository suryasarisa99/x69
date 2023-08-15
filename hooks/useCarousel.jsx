import { useState, useContext } from "react";
import { DataContext } from "../src/context/DataContext";

export default function useCarousel({
  load = 4,
  initial = 2,
  swipeOnLast = 2,
  carouselsLoaded,
  dispatchLoaded,
  type,
  total: t,
}) {
  // const [carouselsLoaded, dispatchLoaded] = useContext(DataContext);
  // const [loadedCarousels, setLoadedCarousels] = useState(initial);
  const [total, setTotal] = useState(t || 0);
  const handleCarouselSwipe = (currentIndex) => {
    if (
      carouselsLoaded[type] - 1 - currentIndex < swipeOnLast &&
      carouselsLoaded[type] < total
    ) {
      const newLoadedCarousels = Math.min(carouselsLoaded[type] + load, total);
      // setLoadedCarousels(newLoadedCarousels);
      dispatchLoaded({ type, payload: newLoadedCarousels });
    }
  };

  return { handleCarouselSwipe, setTotal };
}
// {
//   // const [carouselsLoaded, dispatchLoaded] = useContext(DataContext);
//   // const [loadedCarousels, setLoadedCarousels] = useState(initial);
//   const [total, setTotal] = useState(t || 0);
//   const handleCarouselSwipe = (currentIndex) => {
//     if (
//       loadedCarousels - 1 - currentIndex < swipeOnLast &&
//       loadedCarousels < total
//     ) {
//       const newLoadedCarousels = Math.min(loadedCarousels + load, total);
//       setLoadedCarousels(newLoadedCarousels);
//     }
//   };

//   return { loadedCarousels, setLoadedCarousels, handleCarouselSwipe, setTotal };
// }
