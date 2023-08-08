import { useState } from "react";

export default function useCarousel({
  load = 4,
  initial = 4,
  swipeOnLast = 2,
  total: t,
}) {
  const [loadedCarousels, setLoadedCarousels] = useState(initial);
  const [total, setTotal] = useState(t || 0);
  const handleCarouselSwipe = (currentIndex) => {
    if (
      loadedCarousels - 1 - currentIndex < swipeOnLast &&
      loadedCarousels < total
    ) {
      const newLoadedCarousels = Math.min(loadedCarousels + load, total);
      setLoadedCarousels(newLoadedCarousels);
    }
  };

  return { loadedCarousels, setLoadedCarousels, handleCarouselSwipe, setTotal };
}
