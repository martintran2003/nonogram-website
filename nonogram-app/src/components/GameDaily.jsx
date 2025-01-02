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

  // Initialize a 10x10 board
  useEffect(() => {
    updateBoard(10, 10);
  }, []);

  useEffect(() => {
    if (solved) {
      setPlayable(false);
    }
  }, [solved]);

  // update and fetch a new board
  async function updateBoard(row, col) {
    const { rowHints, colHints } = await fetch(
      "http://localhost:8000/dailyproblem"
    ).then((res) => res.json());

    setRowHints(rowHints);
    setColHints(colHints);
    setRows(row);
    setCols(col);
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
