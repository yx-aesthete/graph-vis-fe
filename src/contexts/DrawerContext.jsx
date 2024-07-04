import React, { createContext, useContext, useState } from "react";
import ControlDrawer from "../components/ControlDrawer/ControlDrawer.jsx";
const ControlDrawerContext = createContext({});

export const ControlDrawerProvider = ({ children, initialControls }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [controls, setControls] = useState(initialControls);

  const toggleDrawer = () => setIsOpen(!isOpen);

  const updateControl = (name, value) => {
    setControls((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <ControlDrawerContext.Provider
      value={{ isOpen, toggleDrawer, controls, updateControl }}
    >
      {children}
    </ControlDrawerContext.Provider>
  );
};

export const useDrawer = () => useContext(ControlDrawerContext);
