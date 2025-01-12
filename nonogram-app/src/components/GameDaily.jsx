import Board from "./Board.jsx";
import { useState, useEffect } from "react";
import SolveMessage from "./SolveMessage.jsx";
import StartPanel from "./StartPanel.jsx";
import "./styles/GameDaily.css";

function GameDaily() {
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);
  const [rowHints, setRowHints] = useState([]);
  const [colHints, setColHints] = useState([]);
  const [seed, setSeed] = useState(0);

  const [date, setDate] = useState("");

  const [solved, setSolved] = useState(false);
  const [playable, setPlayable] = useState(false);

  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);

  const [loaded, setLoaded] = useState(false);

  // Initialize a 10x10 board
  useEffect(() => {
    getDailyProblem();
  }, []);

  // when the game is solved, make the game not playable
  useEffect(() => {
    if (solved) {
      setPlayable(false);
    }
  }, [solved]);

  // update and fetch a new board
  async function getDailyProblem() {
    const result = await fetch(
      `${import.meta.env.VITE_NONOGRAM_SERVER}/daily`
    ).then((res) => res.json());
    if (result == null) {
      console.log("No problem was found for today");
      return;
    }

    const { date, rows, cols, rowHints, colHints } = result;

    console.log(date, rows, cols, rowHints, colHints);
    // look in the localstorage for the date of the stored problem
    // if it matches the problem received from the server, load in the saved progress
    // if there is no loading, generate a new problem
    const storedDate = localStorage.getItem("daily.date");
    if (storedDate == null || storedDate !== date || !loadCurrentGame()) {
      deleteCurrentGame(); // clear local storage

      createNewGame(rows, cols, rowHints, colHints, date); // generate a new game

      saveMetadata(date, false); // save the date and set solved as false

      saveTime(0, 0); // set a base timer
    }

    setLoaded(true);
  }

  // solve the problem and set the solved time
  function solve() {
    const solveTime = Date.now();

    setSolved(true);

    // set as solved in storage
    localStorage.setItem("daily.solved", true);

    // if the problem was not already solved (i.e from local storage), set the new end time
    if (!solved) {
      localStorage.setItem("daily.endTime", solveTime);
      setEndTime(solveTime);
    }
  }

  function createNewGame(rows, cols, rowHints, colHints, date) {
    setRows(rows);
    setCols(cols);
    setRowHints(rowHints);
    setColHints(colHints);

    setDate(date);

    setSolved(false);
    setPlayable(false);
  }

  // start the timer
  function startTimer() {
    // if the problem is not loaded yet, don't do anything
    if (rows == 0 || cols == 0) {
      return;
    }

    // set new game time
    const startTime = Date.now();

    setStartTime(startTime); // set start time

    saveTime(startTime, 0); // save the timer into the local storage

    console.log(rows, cols, rowHints, colHints, seed);
    // save the current game into local storage (confidential information)
    saveCurrentGame(rows, cols, rowHints, colHints, seed);

    setPlayable(true); // game the game playable
  }

  /* 
    Local Storage functions
  */

  // saves the details of the current game
  function saveCurrentGame(rows, cols, rowHints, colHints, seed) {
    localStorage.setItem("daily.rows", rows);
    localStorage.setItem("daily.cols", cols);

    localStorage.setItem("daily.rowHints", JSON.stringify(rowHints));
    localStorage.setItem("daily.colHints", JSON.stringify(colHints));

    localStorage.setItem("daily.seed", seed);
  }

  // load the entire game (NOTE: could split up soon)
  function loadCurrentGame() {
    const rows = Number(localStorage.getItem("daily.rows"));
    const cols = Number(localStorage.getItem("daily.cols"));
    const rowHints = JSON.parse(localStorage.getItem("daily.rowHints"));
    const colHints = JSON.parse(localStorage.getItem("daily.colHints"));

    const startTime = Number(localStorage.getItem("daily.startTime"));
    const endTime = Number(localStorage.getItem("daily.endTime"));

    const solved = localStorage.getItem("daily.solved");
    const date = localStorage.getItem("daily.date");
    const seed = Number(localStorage.getItem("daily.seed"));

    // if any component is missing, fail to load
    if (
      rows == null ||
      cols == null ||
      rowHints == null ||
      colHints == null ||
      startTime == null ||
      endTime == null ||
      solved == null ||
      date == null ||
      seed == null
    )
      return false;

    // update the state using the local game
    setRows(rows);
    setCols(cols);
    setRowHints(rowHints);
    setColHints(colHints);

    setSeed(seed);

    setDate(date);

    // set the solved state; if solved, then make the game not playable
    setSolved(solved === "true");
    setPlayable(solved !== "true");

    setStartTime(startTime);
    setEndTime(endTime);

    return true;
  }

  // delete the current game
  function deleteCurrentGame() {
    localStorage.removeItem("daily.rows");
    localStorage.removeItem("daily.cols");

    localStorage.removeItem("daily.rowHints");
    localStorage.removeItem("daily.colHints");

    localStorage.removeItem("daily.seed");

    localStorage.removeItem("daily.date");
    localStorage.removeItem("daily.solved");

    localStorage.removeItem("daily.startTime");
    localStorage.removeItem("daily.endTime");
  }
  // save metadata which contains the date and the solved status
  function saveMetadata(date, solved) {
    localStorage.setItem("daily.date", date);
    localStorage.setItem("daily.solved", solved);
  }

  // set the time in local storage
  function saveTime(startTime, endTime) {
    localStorage.setItem("daily.startTime", startTime);
    localStorage.setItem("daily.endTime", endTime);
  }

  return (
    <div className="game-container">
      <h2 className="board-label">Today's Nonogram</h2>
      <div className="board-container">
        {loaded ? (
          <>
            {startTime == 0 ? (
              <StartPanel startAction={startTimer} />
            ) : (
              <Board
                gameName="daily"
                gameID={date} // use the date as the game's ID
                rowCount={rows}
                colCount={cols}
                rowLabelsProp={rowHints}
                columnLabelsProp={colHints}
                solved={solved}
                updateSolved={solve}
                playable={playable}
              />
            )}
            {solved && <SolveMessage solveTime={endTime - startTime} />}
          </>
        ) : (
          <div>Loading Game...</div>
        )}
      </div>
    </div>
  );
}

export default GameDaily;
