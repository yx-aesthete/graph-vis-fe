import { useState, useEffect } from "react";
import { defaultControls } from "./constants";

const useControls = (storageKey, onUpdate) => {
  const [controls, setControls] = useState(() => {
    const savedControls = localStorage.getItem(storageKey);
    return savedControls ? JSON.parse(savedControls) : defaultControls;
  });

  useEffect(() => {
    if (!localStorage.getItem(storageKey)) {
      localStorage.setItem(storageKey, JSON.stringify(defaultControls));
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(controls));
    if (onUpdate) {
      onUpdate(controls);
    }
  }, [controls, storageKey, onUpdate]);

  const updateControl = (name, value) => {
    const parsedValue =
      typeof value === "number" && !isNaN(value) ? value : parseFloat(value);
    setControls((prev) => {
      const newControls = { ...prev, [name]: parsedValue };
      if (onUpdate) {
        onUpdate(newControls);
      }
      return newControls;
    });
  };

  return { controls, updateControl };
};

export default useControls;
