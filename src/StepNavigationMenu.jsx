import React, { useRef, useEffect, useContext, useState } from "react";
import { ModelContext } from "./ModelContext.jsx";

export default function StepNavigationMenu() {
  const { stepList, setStepPosition, stepCount, modelProperties } =
    useContext(ModelContext);
  const [btnClass, setBtnClass] = useState(false);
  const [btnColor, setBtnColor] = useState("red");

  if (stepList) {
    const tempArray = [...Array(stepList.length)];
  }

  return (
    <div id="navigationMenu">
      {stepList
        ? stepList.map((name, index) => (
            <li className={"stepNaviClass"} key={index}>
              <button
                onClick={() => {
                  setStepPosition(index);
                }}
                className={btnClass ? "active" : "stepNaviBtn"}
              >
                {name}
              </button>
            </li>
          ))
        : null}
    </div>
  );
}
