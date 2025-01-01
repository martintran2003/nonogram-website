import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Game from "./components/Game.jsx";
import GameDaily from "./components/GameDaily.jsx";

function App() {
  return (
    <>
      <GameDaily />
    </>
  );
}

export default App;
