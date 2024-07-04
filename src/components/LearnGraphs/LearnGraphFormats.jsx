import React, { useState, useMemo, useCallback } from "react";
import "../../styles/learnGraph.styles.scss";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { CSSTransition } from "react-transition-group";
import { useHover } from "../../contexts/HoverContext.jsx";
import { useAnimation } from "../../contexts/TraversalAnimationContext";

const LearnGraphFormats = ({ graphFormats }) => {
  const {
    hoveredNode,
    hoveredConnection,
    handleMouseEnterNode,
    handleMouseEnterConnection,
    handleMouseLeave,
  } = useHover();

  const {
    traversedNodes,
    currentNode,
    isTraversalAnimationActive,
    isTraversalAnimationComplete,
  } = useAnimation();

  const [openSections, setOpenSections] = useState({
    adjacencyList: true,
    adjacencyMatrix: true,
    dotFormat: true,
    gmlFormat: true,
    graphmlFormat: true,
  });

  const matrixSize = graphFormats.adjacency_matrix
    ? graphFormats.adjacency_matrix.length
    : 0;

  const toggleSection = (section) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const isNodeHovered = (node) => {
    return node.toString() === hoveredNode;
  };

  const isConnectionHovered = (connection) => {
    return (
      hoveredConnection &&
      hoveredConnection.source === connection.source.toString() &&
      hoveredConnection.target === connection.target.toString()
    );
  };

  const isNodeCurrentOrTraversed = (node) => {
    if (node === currentNode) {
      return "current";
    }
    if (traversedNodes.includes(node)) {
      return "traversed";
    }
    return "";
  };

  const processText = (text) => {
    if (!text) return [];
    return text.split("\n").map((line) => line.trim());
  };

  const highlightLine = (line) => {
    if (hoveredNode) {
      return new RegExp(`\\b${hoveredNode}\\b`).test(line);
    }
    if (hoveredConnection) {
      return (
        new RegExp(`\\b${hoveredConnection.source}\\b`).test(line) &&
        new RegExp(`\\b${hoveredConnection.target}\\b`).test(line)
      );
    }
    if (currentNode && line.includes(currentNode.toString())) {
      return true;
    }
    if (
      traversedNodes &&
      traversedNodes.some((node) => line.includes(node.toString()))
    ) {
      return true;
    }
    return false;
  };

  const highlightText = (lines) => {
    return lines.map((line) => ({
      line,
      isHighlighted: highlightLine(line),
    }));
  };

  const dotLines = useMemo(
    () => highlightText(processText(graphFormats.dot)),
    [
      graphFormats.dot,
      hoveredNode,
      hoveredConnection,
      currentNode,
      traversedNodes,
    ]
  );

  const gmlLines = useMemo(
    () => highlightText(processText(graphFormats.gml)),
    [
      graphFormats.gml,
      hoveredNode,
      hoveredConnection,
      currentNode,
      traversedNodes,
    ]
  );

  const graphmlLines = useMemo(
    () => highlightText(processText(graphFormats.graphml)),
    [
      graphFormats.graphml,
      hoveredNode,
      hoveredConnection,
      currentNode,
      traversedNodes,
    ]
  );

  const handleMatrixMouseEnter = useCallback(
    (rowIndex, cellIndex) => {
      handleMouseEnterConnection({
        source: rowIndex.toString(),
        target: cellIndex.toString(),
      });
    },
    [handleMouseEnterConnection]
  );

  const handleMouseEnterNodeOrConnection = (line) => {
    const connection =
      parseGmlLine(line) || parseGraphmlLine(line) || parseDotLine(line);
    if (connection) {
      handleMouseEnterConnection(connection);
    } else {
      const match = line.match(/id\s*=\s*"(\d+)"/) || line.match(/id\s+(\d+)/);
      if (match) {
        handleMouseEnterNode(match[1]);
      }
    }
  };

  return (
    <div className="graph-formats">
      <h3>Graph Formats</h3>

      <div className="format-section">
        <h4 onClick={() => toggleSection("adjacencyList")}>
          Adjacency List{" "}
          {openSections.adjacencyList ? <FaChevronUp /> : <FaChevronDown />}
        </h4>
        <CSSTransition
          in={openSections.adjacencyList}
          timeout={300}
          classNames="slide"
          unmountOnExit
        >
          <div className="grid-container">
            {graphFormats.adjacency_list &&
              Object.entries(graphFormats.adjacency_list).map(
                ([node, edges], index) => (
                  <div
                    key={index}
                    className={`grid-item ${isNodeHovered(node) ? "hovered" : ""} ${isNodeCurrentOrTraversed(
                      Number(node)
                    )}`}
                    onMouseEnter={() => handleMouseEnterNode(node)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <strong>{Number(node)}:</strong>{" "}
                    {edges.map((edge) => (
                      <span
                        key={edge}
                        className={`edge-item ${
                          isConnectionHovered({ source: node, target: edge })
                            ? "hovered"
                            : ""
                        }`}
                        onMouseEnter={() =>
                          handleMouseEnterConnection({
                            source: node,
                            target: edge,
                          })
                        }
                        onMouseLeave={handleMouseLeave}
                      >
                        {edge},{" "}
                      </span>
                    ))}
                  </div>
                )
              )}
          </div>
        </CSSTransition>
      </div>

      <div className="format-section">
        <h4 onClick={() => toggleSection("adjacencyMatrix")}>
          Adjacency Matrix{" "}
          {openSections.adjacencyMatrix ? <FaChevronUp /> : <FaChevronDown />}
        </h4>
        <CSSTransition
          in={openSections.adjacencyMatrix}
          timeout={300}
          classNames="slide"
          unmountOnExit
        >
          <div className="matrix-container">
            <div className="matrix-row">
              <div className="matrix-header-cell"></div>
              {Array.from({ length: matrixSize }, (_, index) => (
                <div key={index} className="matrix-header-cell">
                  <div className="matrix-head-cell-container">{index}</div>
                </div>
              ))}
            </div>
            {graphFormats.adjacency_matrix &&
              graphFormats.adjacency_matrix.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className={`matrix-row ${
                    isNodeHovered(rowIndex) ? "hovered" : ""
                  } ${isNodeCurrentOrTraversed(rowIndex)}`}
                  onMouseEnter={() => handleMouseEnterNode(rowIndex)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="matrix-row-id">{rowIndex}</div>
                  {row.map((cell, cellIndex) => (
                    <div
                      key={cellIndex}
                      className={`matrix-cell ${
                        isConnectionHovered({
                          source: rowIndex,
                          target: cellIndex,
                        })
                          ? "hovered"
                          : ""
                      }`}
                      onMouseEnter={() =>
                        handleMatrixMouseEnter(rowIndex, cellIndex)
                      }
                      onMouseLeave={handleMouseLeave}
                    >
                      {cell}
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </CSSTransition>
      </div>

      <div className="format-section">
        <h4 onClick={() => toggleSection("dotFormat")}>
          DOT Format{" "}
          {openSections.dotFormat ? <FaChevronUp /> : <FaChevronDown />}
        </h4>
        <CSSTransition
          in={openSections.dotFormat}
          timeout={300}
          classNames="slide"
          unmountOnExit
        >
          <pre>
            {dotLines.map(({ line, isHighlighted }, index) => (
              <span
                key={index}
                className={`${
                  isHighlighted && !isTraversalAnimationActive
                    ? "highlight"
                    : ""
                } ${
                  isHighlighted && isTraversalAnimationActive ? "traversed" : ""
                }`}
                onMouseEnter={() => handleMouseEnterNodeOrConnection(line)}
                onMouseLeave={handleMouseLeave}
              >
                {line}
                <br />
              </span>
            ))}
          </pre>
        </CSSTransition>
      </div>

      <div className="format-section">
        <h4 onClick={() => toggleSection("gmlFormat")}>
          GML Format{" "}
          {openSections.gmlFormat ? <FaChevronUp /> : <FaChevronDown />}
        </h4>
        <CSSTransition
          in={openSections.gmlFormat}
          timeout={300}
          classNames="slide"
          unmountOnExit
        >
          <pre>
            {gmlLines.map(({ line, isHighlighted }, index) => (
              <span
                key={index}
                className={`${
                  isHighlighted && !isTraversalAnimationActive
                    ? "highlight"
                    : ""
                } ${
                  isHighlighted && isTraversalAnimationActive ? "traversed" : ""
                }`}
                onMouseEnter={() => handleMouseEnterNodeOrConnection(line)}
                onMouseLeave={handleMouseLeave}
              >
                {line}
                <br />
              </span>
            ))}
          </pre>
        </CSSTransition>
      </div>

      <div className="format-section">
        <h4 onClick={() => toggleSection("graphmlFormat")}>
          GraphML Format{" "}
          {openSections.graphmlFormat ? <FaChevronUp /> : <FaChevronDown />}
        </h4>
        <CSSTransition
          in={openSections.graphmlFormat}
          timeout={300}
          classNames="slide"
          unmountOnExit
        >
          <pre>
            {graphmlLines.map(({ line, isHighlighted }, index) => (
              <span
                key={index}
                className={`${
                  isHighlighted && !isTraversalAnimationActive
                    ? "highlight"
                    : ""
                } ${
                  isHighlighted && isTraversalAnimationActive ? "traversed" : ""
                }`}
                onMouseEnter={() => handleMouseEnterNodeOrConnection(line)}
                onMouseLeave={handleMouseLeave}
              >
                {line}
                <br />
              </span>
            ))}
          </pre>
        </CSSTransition>
      </div>
    </div>
  );
};

const parseDotLine = (line) => {
  const match = line.match(/(\d+)\s*--\s*(\d+)/);
  return match ? { source: match[1], target: match[2] } : null;
};

const parseGmlLine = (line) => {
  const nodeMatch = line.match(/id (\d+)/);
  if (nodeMatch) {
    return { node: nodeMatch[1] };
  }
  const edgeMatch = line.match(/source (\d+)\s*target (\d+)/);
  return edgeMatch ? { source: edgeMatch[1], target: edgeMatch[2] } : null;
};

const parseGraphmlLine = (line) => {
  const match = line.match(/source="(\d+)"\s*target="(\d+)"/);
  return match ? { source: match[1], target: match[2] } : null;
};

export default LearnGraphFormats;
