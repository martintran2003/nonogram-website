import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Board from "./components/Board.jsx";

const { rowHints, colHints, rows, cols } = await fetch(
  "http://localhost:8000/randomproblem"
)
  .then((res) => res.json())
  .then((data) => JSON.parse(data));

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Board size={rows} rowLabels={rowHints} columnLabels={colHints} />
  </StrictMode>
);
