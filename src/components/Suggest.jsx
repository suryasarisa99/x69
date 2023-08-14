import React, { useState, useEffect, useRef, useContext } from "react";
import actress from "../../actress.json";
import { DataContext } from "../context/DataContext";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Suggest({ name, onSelect }) {
  const [data, setData] = useState([]);
  const { accFuseRef } = useContext(DataContext);

  let nameWords = name.toLowerCase().trim().split(" ");
  nameWords = nameWords.map((item) => item.trim().replace(/[^\x20-\x7E]/g, ""));
  const [query, setQuery] = useState("");
  let exactMatchFound = useRef(false);
  const navigate = useNavigate();
  useEffect(() => {
    exactMatchFound.current = false;
    setData([]);
    const fdata = actress
      .map((item, ind) => {
        const itemWords = item.words ?? item.name.toLowerCase().split(" ");
        const actualWordsLen = item.name.toLowerCase().split(" ").length;
        const matchingWords = itemWords.filter((word) =>
          nameWords.includes(word)
        );
        if (matchingWords.lnegth > 1)
          console.log("matched words", matchingWords);
        const exactMatch =
          actualWordsLen == nameWords.length &&
          actualWordsLen == matchingWords.length;
        if (exactMatch) exactMatchFound.current = true;
        let partialMatch = false;
        if (!exactMatchFound.current) {
          partialMatch =
            actualWordsLen == matchingWords.length || matchingWords.length >= 2;
        }
        return {
          ...item,
          exactMatch,
          partialMatch,
          ind,
          // actualWordsLen,
          // w: matchingWords,
          // aw: itemWords,
          matchingWords: matchingWords.length,
        };
      })
      .filter((item) => item.matchingWords > 0)
      .sort((a, b) => b.matchingWords - a.matchingWords);

    setTimeout(() => setData(fdata), 1);
  }, [name]);

  useEffect(() => {
    setQuery("");
  }, []);

  useEffect(() => {
    if (query) {
      const fdata = accFuseRef.current.search(query).map((item) => item.item);
      setData([]);
      setTimeout(() => setData(fdata), 0.1);
    }
  }, [query]);

  return (
    <div className="suggestions" onClick={(e) => e.stopPropagation()}>
      <p className="name">Name: {name}</p>
      <form action="">
        <input
          type="text"
          placeholder="search"
          value={query}
          onClick={(e) => e.stopPropagation()}
          // autoFocus
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
      {/* <h2>Suggested Actresses:</h2> */}
      {data.map((item, ind) => (
        <div key={item.name + "" + ind} onClick={() => onSelect(item.name)}>
          {/* <p>
            m:{item.matchingWords} a:{item.actualWordsLen}
          </p>
          {item.w.map((it, index) => {
            return <p key={it + " " + index}>{it}</p>;
          })} */}

          <div
            className={
              "sugg-item " +
              (item.exactMatch ? "exact-match " : "") +
              (item.partialMatch ? "partial-match " : "")
            }
          >
            <p>{item.name}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/search/${"home"}/${item.name}`);
                document.getElementById("overlay").classList.add("hidden");
              }}
            >
              <FaSearch />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Aishwarya lekshmi, ivana, annu emmanual
