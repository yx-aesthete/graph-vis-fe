import React from "react";

const Graph = ({
  nodes,
  edges,
  currentNode,
  visitedNodes,
  showLabels = true,
  animate = false,
  nodeSize = 20,
  nodeColors = { default: "blue", current: "red", visited: "green" },
  bezierEdges = true,
}) => {
  const calculatedNodeSize = Math.max(
    10,
    Math.min(30, 1000 / nodes.length, nodeSize)
  );

  const getBezierPath = (sourceX, sourceY, targetX, targetY) => {
    const controlX1 = sourceX;
    const controlY1 = (sourceY + targetY) / 2;
    const controlX2 = targetX;
    const controlY2 = (sourceY + targetY) / 2;
    return `M ${sourceX},${sourceY} C ${controlX1},${controlY1} ${controlX2},${controlY2} ${targetX},${targetY}`;
  };

  const getStraightPath = (sourceX, sourceY, targetX, targetY) => {
    return `M ${sourceX},${sourceY} L ${targetX},${targetY}`;
  };

  return (
    <svg width="100%" height="100%">
      {edges.map((edge, index) => {
        const source = nodes.find((node) => node.id === edge.source);
        const target = nodes.find((node) => node.id === edge.target);
        const pathD = bezierEdges
          ? getBezierPath(source.x, source.y, target.x, target.y)
          : getStraightPath(source.x, source.y, target.x, target.y);

        return (
          <path
            key={index}
            d={pathD}
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
        );
      })}
      {nodes.map((node) => (
        <g key={node.id}>
          <circle
            cx={node.x}
            cy={node.y}
            r={calculatedNodeSize}
            fill={
              currentNode === node.id
                ? nodeColors.current
                : visitedNodes.includes(node.id)
                  ? nodeColors.visited
                  : nodeColors.default
            }
            className={animate ? "animate-node" : ""}
          />
          {showLabels && (
            <text
              x={node.x}
              y={node.y - calculatedNodeSize - 5}
              fontSize={calculatedNodeSize / 2}
              textAnchor="middle"
              fill="white"
            >
              {node.name || node.id}
            </text>
          )}
        </g>
      ))}
      <style
        // @ts-ignore
        jsx
      >{`
        .animate-node {
          transition: all 0.3s ease-in-out;
        }
      `}</style>
    </svg>
  );
};

export default Graph;
