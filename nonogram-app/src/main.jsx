import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Board from "./components/Board.jsx";

var size = 5;
const cols = [[1, 1], [2, 1], [1, 1], [1], []];
const rows = [[2], [1, 1], [1], [], [3]];
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <Board size={size} rowLabels={rows} columnLabels={cols} />
  </StrictMode>
);
