import React, { useState, useEffect } from "react";
import LearnGraphsControls from "./../../components/LearnGraphs/LearnGraphsControls";
import LearnGraphsGraph from "./../../components/LearnGraphs/LearnGraphsGraph";
import LearnGraphFormats from "./../../components/LearnGraphs/LearnGraphFormats.jsx";
import {
  validateGraphParameters,
  fetchAndGenerateGraph,
} from "../../components/LearnGraphs/LearnGraph.utils";
import "../../styles/shared.styles.scss";
import "../../styles/learnGraph.styles.scss";
import ControlDrawer from "../../components/ControlDrawer/ControlDrawer";
import { useAnimation } from "../../contexts/TraversalAnimationContext"; // Import the custom hook
import LoaderSpinner from "../../components/LoaderSpinner.jsx";

const LearnGraphs = () => {
  const initialNodesAmount = [18, 24];
  const [numNodes, setNumNodes] = useState(
    Math.floor(
      Math.random() * (initialNodesAmount[1] - initialNodesAmount[0] + 1)
    ) + initialNodesAmount[0]
  );
  const [connectivity, setConnectivity] = useState("random");

  const initialEdgesAmount = [20, 30];
  const initialEdges =
    Math.floor(
      Math.random() * (initialEdgesAmount[1] - initialEdgesAmount[0] + 1)
    ) + initialEdgesAmount[0];
  const { validatedEdges: initialNumEdges, infoMessage: initialInfoMessage } =
    validateGraphParameters(numNodes, initialEdges, connectivity);

  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [graphFormats, setGraphFormats] = useState({});
  const [error, setError] = useState(null);
  const [numEdges, setNumEdges] = useState(initialNumEdges);
  const [infoMessage, setInfoMessage] = useState(initialInfoMessage);
  const [maxIterations, setMaxIterations] = useState(1000);
  const [optimalDistance, setOptimalDistance] = useState(100);

  const calculateNodeSize = (numNodes) => {
    const baseSize =
      window.innerWidth < 1400
        ? window.innerWidth * 0.024
        : window.innerWidth * 0.012;
    const scalingFactor = Math.max(1, Math.log(numNodes) / 4); // Adjust the denominator to control the scaling sensitivity
    return Math.floor(baseSize / scalingFactor);
  };

  useEffect(() => {
    setNodeSize(calculateNodeSize(graphData.nodes.length));
  }, [graphData]);

  const [nodeSize, setNodeSize] = useState(
    calculateNodeSize(graphData.nodes.length)
  );
  const [svgWidth, setSvgWidth] = useState(5000);
  const [svgHeight, setSvgHeight] = useState(5000);

  const [transform, setTransform] = useState({
    scale: 1,
    translateX: 0,
    translateY: 0,
  });

  const [algorithm, setAlgorithm] = useState("bfs");
  const [startNode, setStartNode] = useState(1);
  const [goalNode, setGoalNode] = useState(null);
  const {
    setTraversalAnimationActive,
    isTraversalAnimationActive,
    setGraph,
    stopTraversalAnimation,
    animationSpeed,
    setAnimationSpeed,
    requestAndStartTraversal,
  } = useAnimation();

  const [isLoading, setIsLoading] = useState(false);
  const [isDelayedLoading, setIsDelayedLoading] = useState(false);

  const funnyWaitSentences = [
    "While the database takes a coffee break, let's enjoy a moment of zen.",
    "Hold on tight, the server is just tying its shoelaces.",
    "Our backend is on a quick snack break, please enjoy this intermission.",
    "The server hamster is taking a breather, one moment please.",
    "Our backend is currently consulting its crystal ball, hold on a sec.",
    "Hang tight, the server is practicing its yoga poses.",
    "The database is currently on a power nap, please stand by. I'll wait him ok...",
    "Our backend is playing hide and seek, give it a moment to be found.",
    "The server is daydreaming, we'll be back to reality shortly.",
    "Our backend is taking a bubble bath, we'll be back after it dries off.",
  ];

  const handleNumNodesChange = (e) => {
    const newNumNodes = Number(e.target.value);
    const { validatedEdges, infoMessage } = validateGraphParameters(
      newNumNodes,
      numEdges,
      connectivity
    );
    setNumNodes(newNumNodes);
    setNumEdges(validatedEdges);
    setInfoMessage(infoMessage);
  };

  const handleNumEdgesChange = (e) => {
    const newNumEdges = Number(e.target.value);
    const { validatedEdges, infoMessage } = validateGraphParameters(
      numNodes,
      newNumEdges,
      connectivity
    );
    setNumEdges(validatedEdges);
    setInfoMessage(infoMessage);
  };

  const handleConnectivityChange = (e) => {
    const newConnectivity = e.target.value;
    const { validatedEdges, infoMessage } = validateGraphParameters(
      numNodes,
      numEdges,
      newConnectivity
    );
    setConnectivity(newConnectivity);
    setNumEdges(validatedEdges);
    setInfoMessage(infoMessage);
  };

  const handleTraversal = () => {
    requestAndStartTraversal(graphData, startNode, algorithm, goalNode);
  };

  const handleClickTraversalAnimationButton = () => {
    if (isTraversalAnimationActive) {
      stopTraversalAnimation();
    } else {
      handleTraversal();
    }
  };

  const handleWheel = (event) => {
    const { deltaY } = event;
    const scaleAmount = -deltaY * 0.01;
    const newScale = Math.min(Math.max(transform.scale + scaleAmount, 0.1), 10);

    const centerX = svgWidth / 2;
    const centerY = svgHeight / 2;

    const newTranslateX =
      centerX - ((centerX - transform.translateX) * newScale) / transform.scale;
    const newTranslateY =
      centerY - ((centerY - transform.translateY) * newScale) / transform.scale;

    setTransform({
      scale: newScale,
      translateX: newTranslateX,
      translateY: newTranslateY,
    });
  };

  useEffect(() => {
    fetchAndGenerateGraph(
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
      setGraphFormats,
      setIsLoading,
      setIsDelayedLoading
    );
  }, [numNodes, numEdges, maxIterations, optimalDistance, connectivity]);
  useEffect(() => {
    if (graphData.nodes.length > 0) {
      setGraph(graphData);
    }
  }, [graphData, setGraph]);

  return (
    <div className="show-over-shadow">
      <ControlDrawer
        onToggle={undefined}
        isInitiallyOpen={true}
        isHomeButtonShowed={true}
        maxWidth={"20%"}
      >
        <LearnGraphsControls
          numNodes={numNodes}
          handleNumNodesChange={handleNumNodesChange}
          numEdges={numEdges}
          handleNumEdgesChange={handleNumEdgesChange}
          optimalDistance={optimalDistance}
          setOptimalDistance={setOptimalDistance}
          maxIterations={maxIterations}
          setMaxIterations={setMaxIterations}
          nodeSize={nodeSize}
          setNodeSize={setNodeSize}
          connectivity={connectivity}
          handleConnectivityChange={handleConnectivityChange}
          fetchAndGenerateGraph={() => {
            fetchAndGenerateGraph(
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
              setGraphFormats,
              setIsLoading // Pass the setLoading function
            );
            stopTraversalAnimation();
          }}
          infoMessage={infoMessage}
          error={error}
          algorithm={algorithm}
          setAlgorithm={setAlgorithm}
          startNode={startNode}
          setStartNode={setStartNode}
          goalNode={goalNode}
          setGoalNode={setGoalNode}
          handleTraversal={handleTraversal}
          animationSpeed={animationSpeed}
          setAnimationSpeed={setAnimationSpeed}
          handleClickTraversalAnimationButton={
            handleClickTraversalAnimationButton
          }
          isTraversalAnimationActive={isTraversalAnimationActive}
        />
      </ControlDrawer>
      {isLoading && isDelayedLoading ? (
        <LoaderSpinner isDisplayBlock={true} text={funnyWaitSentences} />
      ) : (
        <LearnGraphsGraph
          graphData={graphData}
          transform={transform}
          svgWidth={svgWidth}
          svgHeight={svgHeight}
          nodeSize={nodeSize}
          handleWheel={handleWheel}
        />
      )}
      {graphFormats && <LearnGraphFormats graphFormats={graphFormats} />}
    </div>
  );
};

export default LearnGraphs;
