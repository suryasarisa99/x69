import { useEffect, useContext, useState } from "react";
import { DataContext } from "../context/DataContext";
import Section from "./Section";
export default function Saved({ setShowBars }) {
  const { shuffleSaved, data, saved, carouselsLoaded, dispatchLoaded } =
    useContext(DataContext);
  const [finalData, setFinalData] = useState([]);
  let savedData = data.filter((d) => saved.includes(d.id));

  const howToLoadData = {
    initial: 5,
    load: 4,
    type: "saved",
    carouselsLoaded,
    dispatchLoaded,
    swipeOnLast: 3,
    total: savedData.length,
  };
  useEffect(() => {
    async function wait(time) {
      setFinalData([]);
      await new Promise((res, rej) => setTimeout(res, time));
      setFinalData(shuffleSaved ? shuffleArray(savedData) : savedData);
    }
    wait(400);
  }, []);

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
