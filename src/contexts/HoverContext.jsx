import React, { createContext, useContext, useState } from "react";

const HoverContext = createContext();

export const useHover = () => useContext(HoverContext);

export const HoverProvider = ({ children }) => {
  const [hoveredNode, setHoveredNode] = useState(null);
  console.log("🚀 ~ HoverProvider ~ hoveredNode:", hoveredNode);
  const [hoveredConnection, setHoveredConnection] = useState(null);
  console.log("🚀 ~ HoverProvider ~ hoveredConnection:", hoveredConnection);

  const handleMouseEnterNode = (node) => {
    setHoveredNode(node.toString());
    setHoveredConnection(null);
  };

  const handleMouseEnterConnection = (connection) => {
    setHoveredConnection({
      source: connection.source.toString(),
      target: connection.target.toString(),
    });
    setHoveredNode(null);
  };

  const handleMouseLeave = () => {
    setHoveredNode(null);
    setHoveredConnection(null);
  };

  return (
    <HoverContext.Provider
      value={{
        hoveredNode,
        hoveredConnection,
        handleMouseEnterNode,
        handleMouseEnterConnection,
        handleMouseLeave,
      }}
    >
      {children}
    </HoverContext.Provider>
  );
};
