import { useState, useEffect } from "react";
import "./App.css";
import GamePractice from "./components/GamePractice.jsx";
import GameDaily from "./components/GameDaily.jsx";
import Nav from "./components/Nav.jsx";

function App() {
  const [mode, setMode] = useState("daily");

  function setPractice() {
    setMode("practice");
  }

  function setDaily() {
    setMode("daily");
  }

  return (
    <>
      <Nav setHome={setDaily} setPractice={setPractice} />
      <div className="content">
        {mode == "daily" && <GameDaily />}
        {mode == "practice" && <GamePractice />}
      </div>
    </>
  );
}

export default App;
