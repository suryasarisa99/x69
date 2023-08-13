import React, { useState, useEffect, useRef } from "react";
import actress from "../../actress.json";

export default function SearchResults({ name, onSelect }) {
  const [data, setData] = useState([]);
  let exactMatchFound = useRef(false);
  useEffect(() => {
    exactMatchFound.current = false;
    setData(
      actress.filter((item) =>
        item.name.toLowerCase().includes(name.toLowerCase())
      )
    );
  }, [name]);

  //   console.log(data);

  return (
    <div className="search-results">
      {data.map((item) => (
        <div key={item.name}>
          <p className={"sugg-item "} onClick={() => onSelect(item.name)}>
            {item.name}
          </p>
        </div>
      ))}
    </div>
  );
}

// Aishwarya lekshmi, ivana, annu emmanual
