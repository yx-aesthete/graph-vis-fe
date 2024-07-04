import { generateRandomBuildGraph } from "../../services/api";
// HERE  calculate node positions

export const calculateNodePositions = (
  nodes,
  edges,
  containerWidth,
  containerHeight,
  nodeSize,
  maxIterations,
  optimalDistance
) => {
  const positions = {};
  const width = containerWidth;
  const height = containerHeight;
  const area = width * height;
  const k = optimalDistance || Math.sqrt(area / nodes.length);
  let temperature = width / 10;

  // Initialize positions with better spread
  nodes.forEach((node) => {
    positions[node.id] = {
      x: (Math.random() * 0.6 + 0.4) * width, // 5% to 95% of the width
      y: (Math.random() * 0.2 + 0.05) * height, // 5% to 95% of the height
    };
  });

  // Function to calculate repulsive force
  const repulsiveForce = (distance) => k ** 2 / distance;

  // Function to calculate attractive force
  const attractiveForce = (distance) => distance ** 2 / k;

  // Function to apply forces and update positions
  const applyForces = () => {
    // Initialize displacement vectors
    const displacements = nodes.reduce((acc, node) => {
      acc[node.id] = { x: 0, y: 0 };
      return acc;
    }, {});

    // Calculate repulsive forces between all pairs of nodes
    nodes.forEach((nodeA) => {
      nodes.forEach((nodeB) => {
        if (nodeA.id !== nodeB.id) {
          const dx = positions[nodeA.id].x - positions[nodeB.id].x;
          const dy = positions[nodeA.id].y - positions[nodeB.id].y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = repulsiveForce(distance);
          displacements[nodeA.id].x += (dx / distance) * force;
          displacements[nodeA.id].y += (dy / distance) * force;
          displacements[nodeB.id].x -= (dx / distance) * force;
          displacements[nodeB.id].y -= (dy / distance) * force;
        }
      });
    });

    // Calculate attractive forces for each edge
    edges.forEach((edge) => {
      const nodeA = positions[edge.source];
      const nodeB = positions[edge.target];
      const dx = nodeA.x - nodeB.x;
      const dy = nodeA.y - nodeB.y;
      const distance = Math.sqrt(dx * dx + dy * dy) || 1;
      const force = attractiveForce(distance);
      const displacement = (distance / k) * force;
      displacements[edge.source].x -= (dx / distance) * displacement;
      displacements[edge.source].y -= (dy / distance) * displacement;
      displacements[edge.target].x += (dx / distance) * displacement;
      displacements[edge.target].y += (dy / distance) * displacement;
    });

    // Update positions based on displacements
    nodes.forEach((node) => {
      const displacement = Math.sqrt(
        displacements[node.id].x ** 2 + displacements[node.id].y ** 2
      );
      if (displacement > temperature) {
        const scale = temperature / displacement;
        displacements[node.id].x *= scale;
        displacements[node.id].y *= scale;
      }
      positions[node.id].x += displacements[node.id].x;
      positions[node.id].y += displacements[node.id].y;
    });

    // Cool down the temperature
    temperature *= 0.95;
  };

  // Main loop to apply forces and update positions iteratively
  for (let i = 0; i < maxIterations; i++) {
    applyForces();
    // Visualize or log intermediate states
    if (i % 100 === 0) {
      // console.log(`Iteration ${i}`, positions);
    }
  }

  // Ensure nodes are within the viewport boundaries
  nodes.forEach((node) => {
    positions[node.id].x = Math.max(
      nodeSize,
      Math.min(width - nodeSize, positions[node.id].x)
    );
    positions[node.id].y = Math.max(
      nodeSize,
      Math.min(height - nodeSize, positions[node.id].y)
    );
  });

  // Center the graph within the viewport
  const minX = Math.min(...nodes.map((node) => positions[node.id].x));
  const maxX = Math.max(...nodes.map((node) => positions[node.id].x));
  const minY = Math.min(...nodes.map((node) => positions[node.id].y));
  const maxY = Math.max(...nodes.map((node) => positions[node.id].y));

  const offsetX = (width - (maxX - minX)) / 2 - minX;
  const offsetY = (height - (maxY - minY)) / 2 - minY;

  nodes.forEach((node) => {
    positions[node.id].x += offsetX;
    positions[node.id].y += offsetY;
  });

  // console.log("Final positions:", positions);

  // Check connectivity
  const isConnected = checkGraphConnectivity(nodes, edges);
  // console.log("Graph connectivity check:", { isConnected });

  // Assign final positions to nodes
  return nodes.map((node) => ({
    ...node,
    ...positions[node.id],
  }));
};

// Helper function to check graph connectivity
const checkGraphConnectivity = (nodes, edges) => {
  const adjList = new Map();
  nodes.forEach((node) => {
    adjList.set(node.id, []);
  });
  edges.forEach((edge) => {
    adjList.get(edge.source).push(edge.target);
    adjList.get(edge.target).push(edge.source);
  });

  const visited = new Set();
  const stack = [nodes[0].id];

  while (stack.length > 0) {
    const node = stack.pop();
    if (!visited.has(node)) {
      visited.add(node);
      adjList.get(node).forEach((neighbor) => {
        if (!visited.has(neighbor)) {
          stack.push(neighbor);
        }
      });
    }
  }

  const isConnected = visited.size === nodes.length;
  // console.log("Graph connectivity check:", { isConnected });
  return isConnected;
};

export const validateGraphParameters = (numNodes, numEdges, connectivity) => {
  let validatedEdges = numEdges;
  let infoMessage = null;

  if (connectivity === "tree") {
    if (numEdges !== numNodes - 1) {
      validatedEdges = numNodes - 1;
      infoMessage = `In tree connectivity, the number of edges has been adjusted to nodes - 1.<br>
      This is because a tree with ${numNodes} nodes must have exactly ${numNodes - 1} edges to be a valid tree.`;
    }
  } else if (connectivity === "random") {
    if (numEdges < numNodes) {
      validatedEdges = numNodes;
      infoMessage = `In random connectivity, the number of edges has been adjusted to at least the number of nodes.<br>
      A random graph with ${numNodes} nodes must have at least ${numNodes} edges to be random and connected.<br>
      If you want to have fewer edges than nodes, you actually want to have a tree diagram, not a random graph. You can change it in the connectivity dropdown.`;
    }
  } else if (connectivity === "complete") {
    const maxEdges = (numNodes * (numNodes - 1)) / 2;
    if (numEdges !== maxEdges) {
      validatedEdges = maxEdges;
      infoMessage = `In complete connectivity, the number of edges has been adjusted to the maximum possible value: ${maxEdges}.<br>
      A complete graph with ${numNodes} nodes has all possible edges, which is ${maxEdges} edges. Each node is connected to every other node.`;
    }
  }

  return { validatedEdges, infoMessage };
};

export const fetchAndGenerateGraph = async (
  numNodes,
  numEdges,
  connectivity,
  setGraphData,
  setError,
  setTransform,
  svgWidth,
  svgHeight,
  nodeSize,
  maxIterations,
  optimalDistance,
  setGraphFormats // Add this parameter to handle graph formats
) => {
  const containerWidth = svgWidth;
  const containerHeight = svgHeight;

  try {
    const data = await generateRandomBuildGraph(
      numNodes,
      numEdges,
      connectivity
    );

    const nodesWithPositions = calculateNodePositions(
      data.graph.nodes,
      data.graph.edges,
      containerWidth * 3,
      containerHeight * 3,
      nodeSize,
      maxIterations,
      optimalDistance
    );

    if (nodesWithPositions === null) {
      setError(
        "You need to decrease the number of nodes or adjust the initial position parameters to show all the nodes."
      );
      setGraphData({ nodes: [], edges: [] });
    } else {
      setError(null);
      setGraphData({ nodes: nodesWithPositions, edges: data.graph.edges });
      centerGraph(nodesWithPositions, setTransform, svgWidth, svgHeight);
      setGraphFormats(data.formats); // Set the graph formats
    }
  } catch (err) {
    console.error("🚀 ~ fetchRandomBuildGraph ~ error:", err);
    setError("Failed to fetch external graph data");
  }
};

export const centerGraph = (nodes, setTransform, svgWidth, svgHeight) => {
  const minX = Math.min(...nodes.map((node) => node.x));
  const minY = Math.min(...nodes.map((node) => node.y));
  const maxX = Math.max(...nodes.map((node) => node.x));
  const maxY = Math.max(...nodes.map((node) => node.y));

  const graphWidth = maxX - minX;
  const graphHeight = maxY - minY;
  console.log("🚀 ~ centerGraph ~ graphHeight:", graphHeight);

  const containerWidth = svgWidth;
  const containerHeight = svgHeight;
  console.log("🚀 ~ centerGraph ~ containerHeight:", containerHeight);

  // ADJUST nodes initial position
  const initialScale = (containerHeight * 0.8) / graphHeight;
  const adjustedGraphHeight = graphHeight * initialScale;
  const translateY = containerHeight * 0.1 - minY * initialScale;
  const translateX =
    (containerWidth - graphWidth * initialScale) / 2 - minX * initialScale;

  setTransform({
    scale: initialScale,
    translateX,
    translateY,
  });
};
