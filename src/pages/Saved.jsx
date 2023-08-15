import { useEffect, useContext, useState } from "react";
import { DataContext } from "../context/DataContext";
import Section from "./Section";
export default function Saved({ setShowBars }) {
  const { shuffleSaved, data, saved, carouselsLoaded, dispatchLoaded } =
    useContext(DataContext);
  const [finalData, setFinalData] = useState([]);

  const howToLoadData = {
    initial: 5,
    load: 4,
    type: "saved",
    carouselsLoaded,
    dispatchLoaded,
    swipeOnLast: 3,
  };
  useEffect(() => {
    async function wait(time) {
      setFinalData([]);
      await new Promise((res, rej) => setTimeout(res, time));
      let savedData = data.filter((d) => saved.includes(d.id));
      setFinalData(shuffleSaved ? shuffleArray(savedData) : savedData);
    }
    wait(400);
  }, [data, saved, shuffleSaved]);

  return (
    <div>
      <Section
        setShowBars={setShowBars}
        data={finalData}
        howToLoadData={howToLoadData}
        type="saved"
      />
    </div>
  );
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
