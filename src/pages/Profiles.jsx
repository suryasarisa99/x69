import { useState, useContext, useEffect, useRef } from "react";
import { DataContext } from "../context/DataContext";
import { useNavigate } from "react-router-dom";
import actressX from "../../actress.json";
export default function Profiles() {
  const { data } = useContext(DataContext);
  const [profiles, setProfiles] = useState([]);
  let actress = actressX;
  let totalVerCarousels = useRef(0);

  useState(() => {
    if (profiles.length == 0) {
      data
        .filter((item) => item.name)
        .forEach((item) => {
          let accItem = actress.find((acc) => acc.name == item.name);
          if (accItem) {
            if (accItem.count == undefined) {
              accItem.count = 1;
            } else accItem.count += 1;
          }
        });
      setProfiles(
        actress
          .filter((item) => item.count > 0)
          .sort((a, b) => b.count - a.count)
      );
    }
  }, [data]);

  return (
    <div className="profiles">
      {/* <p>{data.length}</p> */}
      {profiles.map((profile) => {
        return (
          <div className="profile" key={profile.name}>
            <p className="name">{profile.name}</p>
            <p className="count">{profile.count}</p>
          </div>
        );
      })}
    </div>
  );
}
