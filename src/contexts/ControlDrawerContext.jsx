import React, { createContext, useContext, useState } from "react";

const defaultContextValue = {
  isOpen: false,
  toggleDrawer: () => {},
  drawerName: "homePage", // default to homePage
  changeDrawer: () => {},
  updateDrawerContent: () => {},
  drawerContent: null,
};

const ControlDrawerContext = createContext(defaultContextValue);

export const ControlDrawerProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [drawerName, setDrawerName] = useState("homePage");
  const [drawerContent, setDrawerContent] = useState(null);

  const toggleDrawer = () => setIsOpen(!isOpen);
  const changeDrawer = (name) => setDrawerName(name);
  const updateDrawerContent = (content) => setDrawerContent(content);

  return (
    <ControlDrawerContext.Provider
      value={{
        isOpen,
        toggleDrawer,
        drawerName,
        changeDrawer,
        drawerContent,
        updateDrawerContent,
      }}
    >
      {children}
    </ControlDrawerContext.Provider>
  );
};

export const useDrawer = () => useContext(ControlDrawerContext);
