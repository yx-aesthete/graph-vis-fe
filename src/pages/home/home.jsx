// @ts-nocheck
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
// import NodeInfo from "./components/NodeInfo";
import "./styles/spinningGraphs.styles.scss";
// import { ControlDrawerProvider } from "./contexts/DrawerContext.jsx";
import GoHomeHalfCircle from "../../components/GoHomeHalfCircle.jsx";
import SpinningGraph from "../../components/SpinningGraph.jsx";
import { NodePositionsProvider } from "../../contexts/NodePositionsContext";
import About from "../about/about";
import LearnGraphs from "../learn-graphs";
import TraversalDemo from "../traversal-demo";

const App = () => {
  const nodes = [
    { id: 1, name: "Graph Builder", link: "/graph-builder" },
    { id: 2, name: "Learn Graphs", link: "/learn-graphs" },
    { id: 3, name: "Traversal Demo", link: "/traversal-demo" },
  ];

  return (
    <NodePositionsProvider>
      {/* <ControlDrawerProvider> */}
      <div className="App">
        <Router>
          {/* <GoHomeHalfCircle /> */}
          <SpinningGraph nodes={nodes} />
          <Routes>
            <Route path="/graph-builder" element={<About />} />
            <Route path="/learn-graphs" element={<LearnGraphs />} />
            <Route path="/traversal-demo" element={<TraversalDemo />} />
          </Routes>
        </Router>
      </div>
      {/* </ControlDrawerProvider> */}
    </NodePositionsProvider>
  );
};

export default App;
