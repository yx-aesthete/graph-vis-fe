// controlSettings.js

export const defaultControls = {
  NUMBER_OF_NODES: { value: 30, visible: true },
  NUMBER_OF_EDGES: { value: 50, visible: true },
  OPTIMAL_DISTANCE: { value: 85, visible: false },
  MAX_ITERATIONS: { value: 8000, visible: true },
  NODE_SIZE: { value: 25, visible: true },
};

export const minMaxValues = {
  NUMBER_OF_NODES: { min: 1, max: 100, buttonChangeValue: 1 },
  NUMBER_OF_EDGES: { min: 1, max: 200, buttonChangeValue: 5 },
  OPTIMAL_DISTANCE: { min: 1, max: 2000, buttonChangeValue: 200 },
  MAX_ITERATIONS: { min: 1, max: 10000, buttonChangeValue: 1000 },
  NODE_SIZE: { min: 1, max: 20, buttonChangeValue: 1 },
  ANIMATION_SPEED: { min: 0, max: 100, buttonChangeValue: 10 }, // New setting
  START_NODE: { min: 0, max: 100, buttonChangeValue: 1 }, // New setting
  GOAL_NODE: { min: 0, max: 100, buttonChangeValue: 1 }, // New setting
};

export const descriptions = {
  NUMBER_OF_NODES: "The number of nodes in the graph.",
  NUMBER_OF_EDGES: "The number of edges in the graph.",
  OPTIMAL_DISTANCE: "The optimal distance between nodes.",
  MAX_ITERATIONS: "The maximum number of iterations for layout.",
  NODE_SIZE: "The size of the nodes.",
  ANIMATION_SPEED: "The speed of the traversal animation.",
  START_NODE: "The starting node for traversal.",
  GOAL_NODE: "The goal node for traversal (if applicable).",
};

export const algorithmsList = ["bfs", "dfs", "dijkstra", "a_star"];
