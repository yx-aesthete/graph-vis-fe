import React from "react";

const Node = ({ node, currentNode, visitedNodes }) => {
  let fill = "blue";
  if (node.id === currentNode) {
    fill = "red";
  } else if (visitedNodes.includes(node.id)) {
    fill = "orange";
  }

  return (
    <circle cx={node.x} cy={node.y} r="20" fill={fill}>
      <title>{node.id}</title>
    </circle>
  );
};

export default Node;
