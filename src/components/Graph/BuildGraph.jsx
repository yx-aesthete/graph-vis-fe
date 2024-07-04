// BuildGraph.jsx

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useHover } from "../../contexts/HoverContext.jsx";
import { useAnimation } from "../../contexts/TraversalAnimationContext";
import "./../../styles/buildGraph.styles.scss";

const BuildGraph = ({
  nodes,
  edges,
  transform,
  nodeSize,
  svgWidth,
  svgHeight,
}) => {
  const {
    hoveredNode,
    hoveredConnection,
    handleMouseEnterNode,
    handleMouseEnterConnection,
    handleMouseLeave,
  } = useHover();

  const {
    traversedNodes,
    traversedEdges,
    currentNode,
    isTraversalAnimationActive,
    isTraversalAnimationComplete,
  } = useAnimation();

  if (!nodes || !edges) {
    return null;
  }

  // ADJUST node id font size in build graph
  const nodeIdFontSize = nodeSize * 2.3;

  // Calculate remoteness levels for nodes
  const calculateRemotenessLevels = () => {
    if (!hoveredNode) return {};
    const levels = {};
    const queue = [{ id: hoveredNode, level: 0 }];
    const visited = new Set([hoveredNode]);

    while (queue.length > 0) {
      const { id, level } = queue.shift();
      levels[id] = level;

      edges.forEach((edge) => {
        const targetNode =
          edge.source.toString() === id.toString()
            ? edge.target.toString()
            : edge.target.toString() === id.toString()
              ? edge.source.toString()
              : null;
        if (targetNode && !visited.has(targetNode)) {
          visited.add(targetNode);
          queue.push({ id: targetNode, level: level + 1 });
        }
      });
    }

    return levels;
  };

  const remotenessLevels = calculateRemotenessLevels();

  // Get gradient ID based on remoteness level
  const getEdgeGradientId = (edge) => {
    const sourceLevel = remotenessLevels[edge.source];
    const targetLevel = remotenessLevels[edge.target];

    if (
      hoveredConnection &&
      ((hoveredConnection.source === edge.source.toString() &&
        hoveredConnection.target === edge.target.toString()) ||
        (hoveredConnection.source === edge.target.toString() &&
          hoveredConnection.target === edge.source.toString()))
    ) {
      return `gradient-red-${edge.source}-${edge.target}`;
    }
    if (sourceLevel === 0 || targetLevel === 0) {
      return `gradient-red-to-semi-${edge.source}-${edge.target}`;
    }
    if (sourceLevel === 1 || targetLevel === 1) {
      return `gradient-semi-to-blue-${edge.source}-${edge.target}`;
    }
    return `gradient-default-${edge.source}-${edge.target}`;
  };

  // Get edge class based on remoteness level and traversal
  const getEdgeClass = (edge) => {
    if (isTraversalAnimationComplete || isTraversalAnimationActive) {
      if (
        traversedEdges.some(
          (e) => e.source === edge.source && e.target === edge.target
        )
      ) {
        return "traversed-edge";
      }
    }
    const sourceLevel = remotenessLevels[edge.source];
    const targetLevel = remotenessLevels[edge.target];

    if (
      hoveredConnection &&
      ((hoveredConnection.source === edge.source.toString() &&
        hoveredConnection.target === edge.target.toString()) ||
        (hoveredConnection.source === edge.target.toString() &&
          hoveredConnection.target === edge.source.toString()))
    ) {
      return "hovered-edge-1";
    }
    if (sourceLevel >= 0 || targetLevel >= 0) {
      return "hovered-edge-2";
    }
    return "";
  };

  // Get node class based on remoteness level and traversal
  const getNodeClass = (node) => {
    if (isTraversalAnimationComplete || isTraversalAnimationActive) {
      if (currentNode === node.id) {
        return "current-node";
      }
      if (traversedNodes.includes(node.id)) {
        return "traversed-node";
      }
    }
    const nodeLevel = remotenessLevels[node.id];

    if (
      hoveredConnection &&
      (node.id.toString() === hoveredConnection.source ||
        node.id.toString() === hoveredConnection.target)
    ) {
      return "hovered-node-2";
    }
    if (nodeLevel === 0) {
      return "hovered-node-1";
    }
    if (nodeLevel === 1) {
      return "hovered-node-2";
    }
    if (nodeLevel === 2) {
      return "hovered-node-3";
    }
    return "";
  };

  const getGradientDefinition = (
    edge,
    sourceNode,
    targetNode,
    gradientType
  ) => (
    <linearGradient
      key={gradientType}
      id={gradientType}
      gradientUnits="userSpaceOnUse"
      x1={
        remotenessLevels[edge.source] <= remotenessLevels[edge.target]
          ? sourceNode.x * transform.scale + transform.translateX
          : targetNode.x * transform.scale + transform.translateX
      }
      y1={
        remotenessLevels[edge.source] <= remotenessLevels[edge.target]
          ? sourceNode.y * transform.scale + transform.translateY
          : targetNode.y * transform.scale + transform.translateY
      }
      x2={
        remotenessLevels[edge.source] <= remotenessLevels[edge.target]
          ? targetNode.x * transform.scale + transform.translateX
          : sourceNode.x * transform.scale + transform.translateX
      }
      y2={
        remotenessLevels[edge.source] <= remotenessLevels[edge.target]
          ? targetNode.y * transform.scale + transform.translateY
          : sourceNode.y * transform.scale + transform.translateY
      }
    >
      <stop
        offset="0%"
        stopColor={gradientType.includes("red") ? "#fb6161" : "#ffc1c1"}
      />
      <stop
        offset="100%"
        stopColor={gradientType.includes("semi") ? "#ffc1c1" : "#85affb"}
      />
    </linearGradient>
  );

  return (
    <svg
      className="graph"
      style={{ width: "100%", height: "100%" }}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`} // Use the passed SVG dimensions
    >
      <defs>
        {edges.map((edge, index) => {
          const sourceNode = nodes.find((node) => node.id === edge.source);
          const targetNode = nodes.find((node) => node.id === edge.target);
          return getGradientDefinition(
            edge,
            sourceNode,
            targetNode,
            `gradient-default-${edge.source}-${edge.target}`
          );
        })}
        {edges.map((edge, index) => {
          const sourceNode = nodes.find((node) => node.id === edge.source);
          const targetNode = nodes.find((node) => node.id === edge.target);
          return getGradientDefinition(
            edge,
            sourceNode,
            targetNode,
            `gradient-red-to-semi-${edge.source}-${edge.target}`
          );
        })}
        {edges.map((edge, index) => {
          const sourceNode = nodes.find((node) => node.id === edge.source);
          const targetNode = nodes.find((node) => node.id === edge.target);
          return getGradientDefinition(
            edge,
            sourceNode,
            targetNode,
            `gradient-semi-to-blue-${edge.source}-${edge.target}`
          );
        })}
      </defs>
      {edges.map((edge, index) => {
        const sourceNode = nodes.find((node) => node.id === edge.source);
        const targetNode = nodes.find((node) => node.id === edge.target);

        if (
          !sourceNode ||
          !targetNode ||
          isNaN(sourceNode.x) ||
          isNaN(sourceNode.y) ||
          isNaN(targetNode.x)
        ) {
          return null;
        }

        return (
          <line
            key={index}
            x1={sourceNode.x * transform.scale + transform.translateX}
            y1={sourceNode.y * transform.scale + transform.translateY}
            x2={targetNode.x * transform.scale + transform.translateX}
            y2={targetNode.y * transform.scale + transform.translateY}
            className={`edge ${getEdgeClass(edge)}`}
            stroke={`url(#${getEdgeGradientId(edge)})`}
            onMouseEnter={() =>
              handleMouseEnterConnection({
                source: Math.min(edge.source, edge.target).toString(),
                target: Math.max(edge.source, edge.target).toString(),
              })
            }
            onMouseLeave={handleMouseLeave}
          />
        );
      })}
      {nodes.map((node) => (
        <g
          key={node.id}
          onMouseEnter={() => handleMouseEnterNode(node.id)}
          onMouseLeave={handleMouseLeave}
        >
          <circle
            cx={node.x * transform.scale + transform.translateX}
            cy={node.y * transform.scale + transform.translateY}
            r={nodeSize * window.innerWidth * 0.001} // Adjust radius based on scale
            className={`node ${getNodeClass(node)}`}
          />
          <text
            x={node.x * transform.scale + transform.translateX}
            y={node.y * transform.scale + transform.translateY}
            textAnchor="middle"
            alignmentBaseline="central"
            fontSize={nodeIdFontSize} // Increase font size based on node size
            fill="white"
          >
            {node.id}
          </text>
        </g>
      ))}
    </svg>
  );
};

BuildGraph.propTypes = {
  nodes: PropTypes.array.isRequired,
  edges: PropTypes.array.isRequired,
  transform: PropTypes.shape({
    scale: PropTypes.number.isRequired,
    translateX: PropTypes.number.isRequired,
    translateY: PropTypes.number.isRequired,
  }).isRequired,
  nodeSize: PropTypes.number.isRequired,
  svgWidth: PropTypes.number.isRequired,
  svgHeight: PropTypes.number.isRequired,
};

export default BuildGraph;
