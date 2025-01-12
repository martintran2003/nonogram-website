import Board from "./Board.jsx";
import Selector from "./Selector.jsx";
import { useState, useEffect } from "react";
import SolveMessage from "./SolveMessage.jsx";
import "./styles/GamePractice.css";

function GamePractice() {
  // Board states
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);
  const [seed, setSeed] = useState(-1);
  const [rowHints, setRowHints] = useState([]);
  const [colHints, setColHints] = useState([]);

  // State of the game
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
      `${import.meta.env.VITE_NONOGRAM_SERVER}/randomproblem?` +
        new URLSearchParams({
          rows: row,
          cols: col,
          seed: seed,
        })
    ).then((res) => res.json());

    setRows(row);
    setCols(col);
    setSeed(seed);

    setRowHints(rowHints);
    setColHints(colHints);

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

    // if the problem was not already solved (i.e from local storage), set the new end time
    if (!solved) {
      localStorage.setItem("random.endTime", solveTime);
      setEndTime(solveTime);
    }
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
    localStorage.setItem("random.endTime", endTime);
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
    setPlayable(solved !== "true");

    setStartTime(startTime);
    setEndTime(endTime);

    return true;
  }

  return (
    <div className="game-container">
      <h2>Practice Nonograms</h2>
      <div className="board-container">
        <Selector
          rows={rows}
          cols={cols}
          seed={seed}
          updateBoard={updateBoard}
        />
        <Board
          gameName="random"
          gameID={startTime > 0 ? String(startTime) : null} // use the game's start time as the game's ID
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
      </div>
    </div>
  );
}

export default GamePractice;
