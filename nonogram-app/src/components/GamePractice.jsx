import Board from "./Board.jsx";
import Selector from "./Selector.jsx";
import { useState, useEffect } from "react";
import SolveMessage from "./SolveMessage.jsx";

function GamePractice() {
  // Board states
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);
  const [seed, setSeed] = useState(0);
  const [rowHints, setRowHints] = useState([]);
  const [colHints, setColHints] = useState([]);

  const [solved, setSolved] = useState(false);
  const [playable, setPlayable] = useState(false);

  // Timer states
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);

  // Initialize board on load
  useEffect(() => {
    // attempt to load a problem from the local storage
    if (loadCurrentGame()) return;

    // if failed to load game, generate a new random game
    updateBoard(10, 10, Math.floor(Math.random() * 2 ** 32));
  }, []);

  // when solved, make the board not playable
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

    const startTime = Date.now();

    setStartTime(startTime);

    // save the new game into local storage
    saveCurrentGame(row, col, seed, rowHints, colHints, startTime);
  }

  // create a new game with the same board dimensions but with random seed
  function newGame() {
    updateBoard(rows, cols, Math.floor(Math.random() * 2 ** 32));
  }

  // when puzzle is solved, set as solved and mark the end time to calculate solve time
  function solve() {
    const solveTime = Date.now();

    setSolved(true);

    localStorage.setItem("random.solved", true);
    localStorage.setItem("random.endTime", solveTime);

    // if the problem was not already solved (i.e from local storage), set the new end time
    if (!solved) setEndTime(solveTime);
  }

  /*
  Local Storage functions
  functions that interact with localStorage to keep track of state of the game
  */

  function saveCurrentGame(rows, cols, seed, rowHints, colHints, time) {
    localStorage.setItem("random.rows", rows);
    localStorage.setItem("random.cols", cols);
    localStorage.setItem("random.seed", seed);

    localStorage.setItem("random.rowHints", JSON.stringify(rowHints));
    localStorage.setItem("random.colHints", JSON.stringify(colHints));
    localStorage.setItem("random.solved", false);

    localStorage.setItem("random.startTime", time);
    localStorage.setItem("random.endTime");
  }

  // attempt to load the current game from local storage
  // return true if able to; else, return false
  function loadCurrentGame() {
    const rows = Number(localStorage.getItem("random.rows"));
    const cols = Number(localStorage.getItem("random.cols"));
    const seed = Number(localStorage.getItem("random.seed"));
    const rowHints = JSON.parse(localStorage.getItem("random.rowHints"));
    const colHints = JSON.parse(localStorage.getItem("random.colHints"));
    const startTime = Number(localStorage.getItem("random.startTime"));
    const endTime = Number(localStorage.getItem("random.endTime"));
    const solved = localStorage.getItem("random.solved");

    // if any component is missing, fail to load
    if (
      rows == null ||
      cols == null ||
      seed == null ||
      rowHints == null ||
      colHints == null ||
      startTime == null ||
      endTime == null ||
      solved == null
    )
      return false;

    // update the state using the local game
    setRows(rows);
    setCols(cols);
    setSeed(seed);
    setRowHints(rowHints);
    setColHints(colHints);

    setSolved(solved === "true");
    setPlayable(true);

    setStartTime(startTime);
    setEndTime(endTime);

    return true;
  }

  return (
    <>
      <h1>Practice Nonograms</h1>
      <Selector rows={rows} cols={cols} seed={seed} updateBoard={updateBoard} />
      <Board
        gameName="random"
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

export default GamePractice;
