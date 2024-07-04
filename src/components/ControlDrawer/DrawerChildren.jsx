// @ts-nocheck
import React from "react";
import { useDrawer } from "../../contexts/DrawerContext.jsx";
import ControlDrawerUnit from "./ControlDrawerUnit.jsx";
import {
  defaultControls,
  minMaxValues,
  descriptions,
} from "../SpinningGraph/constants";

const DrawerChildren = () => {
  const { controls, updateControl } = useDrawer();

  return (
    <div className="controls">
      {Object.keys(defaultControls).map((key) => (
        <ControlDrawerUnit
          key={key}
          name={key}
          value={
            controls[key] !== undefined ? controls[key] : defaultControls[key]
          }
          min={minMaxValues[key]?.min || 0}
          max={minMaxValues[key]?.max || 100}
          description={descriptions[key] || ""}
          onChange={(value) => updateControl(key, value)}
          buttonChangeValue={minMaxValues[key]?.buttonChangeValue || 1}
        />
      ))}
    </div>
  );
};

export default DrawerChildren;
