import React, { useState, useEffect, useRef } from "react";
import actress from "../../actress.json";

export default function Suggest({ name }) {
  const [data, setData] = useState([]);
  const nameWords = name.toLowerCase().split(" ");
  let exactMatchFound = useRef(false);
  useEffect(() => {
    exactMatchFound.current = false;
    setData(
      actress
        .map((item) => {
          const itemWords = item.words ?? item.name.toLowerCase().split(" ");
          const actualWordsLen = item.name.toLowerCase().split(" ").length;
          const matchingWords = itemWords.filter((word) =>
            nameWords.includes(word)
          );
          const exactMatch =
            actualWordsLen == nameWords.length &&
            actualWordsLen == matchingWords.length;
          if (exactMatch) exactMatchFound.current = true;
          let partialMatch = false;
          if (!exactMatchFound.current) {
            partialMatch =
              actualWordsLen == matchingWords.length ||
              matchingWords.length >= 2;
          }
          return {
            ...item,
            exactMatch,
            partialMatch,
            actualWordsLen,
            w: matchingWords,
            matchingWords: matchingWords.length,
          };
        })
        .filter((item) => item.matchingWords > 0)
        .sort((a, b) => b.matchingWords - a.matchingWords)
    );
  }, [name]);

  console.log(data);

  return (
    <div className="suggestions">
      <p className="name">Name: {name}</p>
      {/* <h2>Suggested Actresses:</h2> */}
      {data.map((item) => (
        <div key={item.name}>
          {/* <p>
            m:{item.matchingWords} a:{item.actualWordsLen}
          </p>
          {item.w.map((it, index) => {
            return <p>{it}</p>;
          })} */}

          <p
            className={
              "sugg-item " +
              (item.exactMatch ? "exact-match " : "") +
              (item.partialMatch ? "partial-match " : "")
            }
          >
            {item.name}
          </p>
        </div>
      ))}
    </div>
  );
}

// Aishwarya lekshmi, ivana, annu emmanual
