// Reingold-Tilford Algorithm

import React, { useState, useEffect, useRef } from "react";
import {
  getBfsTraversal,
  getDfsTraversal,
  generateRandomTreeGraphForTraversal,
} from "../services/api";
import Graph from "./Graph/Graph";

const Traversal = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [sequence, setSequence] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [speed, setSpeed] = useState(1000);
  const [traversalName, setTraversalName] = useState("");
  const [numNodes, setNumNodes] = useState(50);

  const graphRef = useRef(null);

  const fetchBfsTraversal = async () => {
    try {
      const traversal = await getBfsTraversal({ nodes, edges });
      setSequence(traversal);
      setCurrentStep(0);
      setTraversalName("BFS");
    } catch (error) {
      console.error("Error during BFS traversal:", error);
    }
  };

  const fetchDfsTraversal = async () => {
    try {
      const traversal = await getDfsTraversal({ nodes, edges });
      setSequence(traversal);
      setCurrentStep(0);
      setTraversalName("DFS");
    } catch (error) {
      console.error("Error during DFS traversal:", error);
    }
  };

  const fetchRandomGraph = async () => {
    try {
      const graph = await generateRandomTreeGraphForTraversal(numNodes);
      // @ts-ignore
      const viewportWidth = graphRef.current.clientWidth;
      // @ts-ignore
      const viewportHeight = graphRef.current.clientHeight;
      const nodeSize = Math.max(10, Math.min(30, 1000 / numNodes));
      const nodesWithPositions = calculateNodePositionsForTraversalGraph(
        graph.nodes,
        graph.edges,
        viewportWidth,
        viewportHeight,
        nodeSize
      );
      setNodes(nodesWithPositions);
      setEdges(graph.edges);
      setSequence([]);
      setCurrentStep(0);
      setTraversalName("");
    } catch (error) {
      console.error("Error generating random graph:", error);
    }
  };

  const calculateNodePositionsForTraversalGraph = (
    nodes,
    edges,
    viewportWidth,
    viewportHeight,
    nodeSize
  ) => {
    const nodeMap = new Map(
      nodes.map((node) => [node.id, { ...node, children: [] }])
    );
    edges.forEach((edge) => {
      nodeMap.get(edge.source).children.push(nodeMap.get(edge.target));
    });

    const root = nodeMap.get(nodes[0].id);
    const positions = {};

    // Calculate levels and widths
    const levels = [];
    const widths = [];

    const buildLevels = (node, depth = 0) => {
      if (!levels[depth]) {
        levels[depth] = [];
      }
      levels[depth].push(node);
      if (!widths[depth]) {
        widths[depth] = 0;
      }
      widths[depth] += nodeSize * 2; // Add node size spacing
      node.children.forEach((child) => buildLevels(child, depth + 1));
    };

    buildLevels(root);

    const depthCount = levels.length;
    const levelSeparation = Math.min(100, viewportHeight / (depthCount + 1));
    const minNodeSeparation = nodeSize * 2;
    const maxLevelWidth = Math.max(...widths);
    // @ts-ignore
    const nodeSeparation = Math.max(
      minNodeSeparation,
      viewportWidth / maxLevelWidth
    );

    const calculateSubtreeWidth = (node) => {
      if (node.children.length === 0) {
        return nodeSize * 2;
      }
      return node.children.reduce((width, child) => {
        return width + calculateSubtreeWidth(child);
      }, 0);
    };

    const setPositions = (node, depth, xOffset) => {
      const subtreeWidth = calculateSubtreeWidth(node);
      const x = xOffset + subtreeWidth / 2;
      positions[node.id] = {
        x: Math.round(x),
        y: Math.round((depth + 1) * levelSeparation),
      };
      let childXOffset = xOffset;
      node.children.forEach((child) => {
        setPositions(child, depth + 1, childXOffset);
        childXOffset += calculateSubtreeWidth(child);
      });
    };

    const rootSubtreeWidth = calculateSubtreeWidth(root);
    setPositions(root, 0, (viewportWidth - rootSubtreeWidth) / 2);

    return nodes.map((node) => ({
      ...node,
      ...positions[node.id],
    }));
  };

  useEffect(() => {
    if (sequence.length > 0) {
      const id = setInterval(() => {
        setCurrentStep((prev) =>
          prev < sequence.length - 1 ? prev + 1 : prev
        );
      }, speed);
      // @ts-ignore
      setIntervalId(id);
      return () => clearInterval(id);
    }
  }, [sequence, speed]);

  const currentNode = sequence.length > 0 ? sequence[currentStep] : null;

  return (
    <div>
      <input
        type="number"
        min="1"
        value={numNodes}
        onChange={(e) => setNumNodes(Number(e.target.value))}
        placeholder="Number of nodes"
      />
      <button onClick={fetchRandomGraph}>Generate Random Graph</button>
      <button onClick={fetchBfsTraversal}>Run BFS</button>
      <button onClick={fetchDfsTraversal}>Run DFS</button>
      <input
        type="range"
        min="100"
        max="2000"
        step="100"
        value={speed}
        onChange={(e) => setSpeed(Number(e.target.value))}
      />
      <p>Traversal: {traversalName}</p>
      <div ref={graphRef} style={{ width: "100vw", height: "80vh" }}>
        <Graph
          nodes={nodes}
          edges={edges}
          currentNode={currentNode}
          visitedNodes={sequence.slice(0, currentStep + 1)}
        />
      </div>
    </div>
  );
};

export default Traversal;
