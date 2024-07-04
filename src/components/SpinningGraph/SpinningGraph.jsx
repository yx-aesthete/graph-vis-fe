import React, { useEffect, useState } from "react";
import "./../../styles/spinningGraphs.styles.scss";
import Particles from "./Particles.jsx";
import ControlDrawer from "./../ControlDrawer/ControlDrawer.jsx";
import SpinningGraphControls from "./SpinningGraphControls";
import { useLocation } from "react-router-dom";
import useControls from "./useControls";
import FullPageReloaderSpinner from "./../../components/fullPageReloaderSpinner.jsx";

const SpinningGraph = ({ nodes }) => {
  const { controls, updateControl } = useControls("spinningGraphControls");

  const [positions, setPositions] = useState([]);
  const radius = 180;
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2.7;
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const [isDrawerOpen, setIsDrawerOpen] = useState(() => {
    const savedState = localStorage.getItem("isDrawerOpen");
    return savedState ? JSON.parse(savedState) : false;
  });

  useEffect(() => {
    const newPositions = nodes.map((node, index) => {
      const angle = (index / nodes.length) * 2 * Math.PI;
      const cx = centerX + radius * Math.cos(angle);
      const cy = centerY + radius * Math.sin(angle);
      return { cx, cy, node };
    });

    setPositions(newPositions);
  }, [nodes, centerX, centerY, radius, controls]);

  const handleDrawerToggle = (isOpen) => {
    setIsDrawerOpen(isOpen);
    localStorage.setItem("isDrawerOpen", JSON.stringify(isOpen));
  };

  return (
    <div className="spinning-graph-container">
      {isHomePage && (
        <ControlDrawer
          maxWidth={"20%"}
          isInitiallyOpen={isDrawerOpen}
          isHomeButtonShowed={false}
          onToggle={handleDrawerToggle}
        >
          <SpinningGraphControls
            controls={controls}
            storageKey="spinningGraphControls"
            updateControl={updateControl}
          />
        </ControlDrawer>
      )}
      <Particles positions={positions} controls={controls} />
    </div>
  );
};

export default SpinningGraph;
