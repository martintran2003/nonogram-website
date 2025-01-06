import Board from "./Board.jsx";
import Selector from "./Selector.jsx";
import { useState, useEffect } from "react";
import SolveMessage from "./SolveMessage.jsx";

function Game() {
  const [rowHints, setRowHints] = useState([]);
  const [colHints, setColHints] = useState([]);
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);
  const [seed, setSeed] = useState(0);
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
  async function updateBoard(row, col, seed) {
    const { rowHints, colHints } = await fetch(
      "http://localhost:8000/randomproblem?" +
        new URLSearchParams({
          rows: row,
          cols: col,
          seed: seed,
        })
    ).then((res) => res.json());

    setRowHints(rowHints);
    setColHints(colHints);

    setRows(row);
    setCols(col);
    setSeed(seed);

    setSolved(false);

    setPlayable(true);

    setStartTime(Date.now());
  }

  function newGame() {
    updateBoard(rows, cols, Math.floor(Math.random() * 2 ** 32));
  }

  function solve() {
    setSolved(true);
    setEndTime(Date.now());
  }

  return (
    <>
      <h1>Practice Nonograms</h1>
      <Selector rows={rows} cols={cols} seed={seed} updateBoard={updateBoard} />
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
        <>
          <SolveMessage solveTime={endTime - startTime} />
          <button onClick={newGame}>New Game</button>
        </>
      )}
    </>
  );
}

export default Game;
