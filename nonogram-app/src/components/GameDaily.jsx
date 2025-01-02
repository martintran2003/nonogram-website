import Board from "./Board.jsx";
import { useState, useEffect } from "react";
import SolveMessage from "./SolveMessage.jsx";

function GameDaily() {
  const [rowHints, setRowHints] = useState([]);
  const [colHints, setColHints] = useState([]);
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);
  const [solved, setSolved] = useState(false);
  const [playable, setPlayable] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);

  const [received, setReceived] = useState(false); // whether or not the problem has been received from server yet

  // Initialize a 10x10 board
  useEffect(() => {
    getDailyProblem();
  }, []);

  useEffect(() => {
    if (solved) {
      setPlayable(false);
    }
  }, [solved]);

  // update and fetch a new board
  async function getDailyProblem() {
    const result = await fetch("http://localhost:8000/dailyproblem").then(
      (res) => res.json()
    );
    if (result == null) {
      console.log("No problem was found for today");
      return;
    }
    const { rows, cols, rowHints, colHints } = result;

    setRowHints(rowHints);
    setColHints(colHints);
    setRows(rows);
    setCols(cols);
    setSolved(false);

    setPlayable(true);

    setStartTime(Date.now());
  }

  function newGame() {
    updateBoard(rows, cols);
  }

  function solve() {
    setSolved(true);
    setEndTime(Date.now());
  }

  return (
    <>
      <h1>Today's Nonogram</h1>
      <Board
        rowCount={rows}
        colCount={cols}
        rowLabelsProp={rowHints}
        columnLabelsProp={colHints}
        solved={solved}
        updateSolved={solve}
        playable={playable}
      />
      {solved && (
        <SolveMessage solveTime={endTime - startTime} newGame={newGame} />
      )}
    </>
  );
}

export default GameDaily;
