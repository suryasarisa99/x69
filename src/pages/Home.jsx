import { useEffect, useContext, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { DataContext } from "../context/DataContext";
import Section from "./Section";
import Suggest from "../components/Suggest";

export default function Home({ setShowBars }) {
  const { data, carouselsLoaded, dispatchLoaded } = useContext(DataContext);
  const [finalData, setFinalData] = useState([]);
  const navigate = useNavigate();
  let savedData = data;

  const howToLoadData = {
    initial: carouselsLoaded.home || 5,
    load: 4,
    carouselsLoaded,
    dispatchLoaded,
    swipeOnLast: 3,
    type: "home",
    total: savedData.length,
  };

  useEffect(() => {
    async function wait(time) {
      setFinalData([]);
      await new Promise((res, rej) => setTimeout(res, time));
      setFinalData(data);
      // setFinalData(shuffleSection ? shuffleArray([...savedData]) : savedData);
    }
    wait(0.1);
  }, []);

  return (
    <div>
      <Section
        setShowBars={setShowBars}
        data={finalData}
        howToLoadData={howToLoadData}
        type="home"
      />
    </div>
  );
}
