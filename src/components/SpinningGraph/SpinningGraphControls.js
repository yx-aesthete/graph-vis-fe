import React, { useState } from "react";
import ControlDrawerUnit from "./../ControlDrawer/ControlDrawerUnit";
import { defaultControls, minMaxValues, descriptions } from "./constants";
import useControls from "./useControls";
import FullPageReloaderSpinner from "./../../components/fullPageReloaderSpinner.jsx"; // Ensure this import is correct

const SpinningGraphControls = ({ storageKey, controls, updateControl }) => {
  const [showLoader, setShowLoader] = useState(false);

  const timeOutReload = () =>
    setTimeout(() => {
      reload();
    }, 3000);

  const reload = () => {
    setShowLoader(true);
    setTimeout(() => {
      setShowLoader(false);
      window.location.reload();
    }, 1000); // Wait for 3 seconds after each controls update
  };

  return (
    <div className="controls">
      {showLoader && <FullPageReloaderSpinner />}
      {Object.keys(defaultControls).map((key) => {
        const control = defaultControls[key];
        const controlValue =
          controls[key] !== undefined ? controls[key] : control.value;
        const minValue = minMaxValues[key]?.min || 0;
        const maxValue = minMaxValues[key]?.max || 100;
        const description = descriptions[key] || "";
        const buttonChangeValue = minMaxValues[key]?.buttonChangeValue || 1;

        return (
          <ControlDrawerUnit
            key={key}
            type="numeric"
            name={key}
            value={controlValue}
            min={minValue}
            max={maxValue}
            description={description}
            onChange={(name, value) => {
              updateControl(name, value);
              timeOutReload();
            }}
            buttonChangeValue={buttonChangeValue}
          />
        );
      })}
    </div>
  );
};

export default SpinningGraphControls;
