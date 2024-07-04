import React, { useEffect, useState } from "react";
import { RiArrowRightWideFill, RiHomeFill } from "react-icons/ri";
import "./../../styles/controlDrawer.styles.scss";
import { useLocation } from "react-router-dom";
import HoverCircleIcon from "./HoverCircleIcon.jsx";

const ControlDrawer = ({
  children,
  isInitiallyOpen,
  isHomeButtonShowed,
  maxWidth,
  onToggle,
}) => {
  const [isOpen, setIsOpen] = useState(isInitiallyOpen);

  const toggleDrawer = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (onToggle) {
      onToggle(newIsOpen);
    }
  };

  const location = useLocation();
  const [isHomePage, setIsHomePage] = useState(location.pathname === "/");

  useEffect(() => {
    setIsHomePage(location.pathname === "/");
  }, [location]);

  return (
    <div
      className={`drawer-container ${isOpen ? "opened" : "closed"}`}
      style={{ maxWidth: maxWidth }}
    >
      <HoverCircleIcon
        icon={RiArrowRightWideFill}
        icon2={RiHomeFill}
        hoverText1={
          "Display controls to play with particles mesh algorithm parameters"
        }
        hoverText2={
          "Navigate to the home page to move somewhere else and play with cool mesh"
        }
        onClick={() => {
          toggleDrawer();
        }}
        onClick2={() => {
          window.location.href = "/";
        }}
        showSecondCircle={isHomeButtonShowed}
        isOpen={isOpen}
      />
      <div className="drawer-content">{children}</div>
    </div>
  );
};

export default ControlDrawer;
