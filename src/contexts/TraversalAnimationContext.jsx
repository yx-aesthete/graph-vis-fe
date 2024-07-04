import React, { createContext, useContext, useState, useRef } from "react";
import { generateTraversalSequence } from "../services/api"; // Adjust the import path as needed

// Create the context
const TraversalAnimationContext = createContext();

// Custom hook to use the animation context
export const useAnimation = () => useContext(TraversalAnimationContext);

// Animation provider component
export const TraversalAnimationProvider = ({ children }) => {
  const [isTraversalAnimationActive, setTraversalAnimationActive] =
    useState(false);
  const [isTraversalAnimationComplete, setTraversalAnimationComplete] =
    useState(false);
  const [traversedNodes, setTraversedNodes] = useState([]);
  const [traversedEdges, setTraversedEdges] = useState([]);
  const [currentNode, setCurrentNode] = useState(null);
  const [animationSpeed, setAnimationSpeed] = useState(50); // Default speed
  const [graph, setGraph] = useState(null);
  const intervalRef = useRef(null);

  const animationSpeedTransformed = 2000 - animationSpeed * 18;

  // Function to start traversal animation
  const startTraversalAnimation = (sequence) => {
    console.log("Starting traversal animation with sequence:", sequence);
    setTraversalAnimationComplete(false);
    let index = 0;
    const interval = setInterval(() => {
      if (index >= sequence.length) {
        clearInterval(interval);
        setTraversalAnimationActive(false);
        setTraversalAnimationComplete(true);
        return;
      }
      const id = sequence[index];
      if (id !== undefined) {
        setTraversedNodes((prev) => {
          const updatedNodes = [...prev, id];
          console.log("Traversed Nodes: ", updatedNodes);
          return updatedNodes;
        });
        setCurrentNode(id);
        console.log("Current Node: ", id);

        // Check and add the traversed edge
        if (index > 0) {
          setTraversedEdges((prev) => {
            const edge = { source: sequence[index - 1], target: id };
            const updatedEdges = [...prev, edge];
            console.log("Traversed Edges: ", updatedEdges);
            return updatedEdges;
          });
        }
      } else {
        console.log("Unknown type in sequence:", id);
      }
      index += 1;
    }, animationSpeedTransformed);

    intervalRef.current = interval; // Store interval ID in ref
    setTraversalAnimationActive(true);
  };

  const requestAndStartTraversal = async (
    graph,
    startNode,
    algorithm,
    goalNode
  ) => {
    if (!graph) {
      console.error("Graph data is not set");
      return;
    }
    try {
      const response = await generateTraversalSequence(
        graph,
        startNode,
        algorithm,
        goalNode
      );
      console.log("Traversal sequence received:", response);
      startTraversalAnimation(response);
    } catch (error) {
      console.error("Error generating traversal sequence:", error);
    }
  };

  const stopTraversalAnimation = () => {
    setTraversalAnimationActive(false);
    setTraversalAnimationComplete(false);
    setCurrentNode(null);
    setTraversedNodes([]);
    setTraversedEdges([]);
    clearInterval(intervalRef.current); // Clear interval using ref
  };

  isTraversalAnimationComplete && stopTraversalAnimation();

  return (
    <TraversalAnimationContext.Provider
      value={{
        setTraversalAnimationActive,
        isTraversalAnimationActive,
        isTraversalAnimationComplete,
        traversedNodes,
        traversedEdges,
        currentNode,
        animationSpeed,
        setAnimationSpeed,
        requestAndStartTraversal,
        stopTraversalAnimation,
        setGraph,
      }}
    >
      {children}
    </TraversalAnimationContext.Provider>
  );
};
