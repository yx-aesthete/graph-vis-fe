import React from "react";
import BuildGraph from "../Graph/BuildGraph";

const LearnGraphsGraph = ({
  graphData,
  transform,
  svgWidth,
  svgHeight,
  nodeSize,
  handleWheel,
}) => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div
        onWheel={handleWheel}
        style={{
          width: "100%",
          height: "100%",
          border: "1px solid black",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <BuildGraph
          nodes={graphData.nodes}
          edges={graphData.edges}
          transform={transform}
          nodeSize={nodeSize}
          svgWidth={svgWidth}
          svgHeight={svgHeight}
        />
      </div>
    </div>
  );
};

export default LearnGraphsGraph;
