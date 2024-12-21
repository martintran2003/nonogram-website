import Board from "./Board.jsx";
import Selector from "./Selector.jsx";
import { useState, useEffect } from "react";

function Game() {
  const [rowHints, setRowHints] = useState([]);
  const [colHints, setColHints] = useState([]);
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);

  // Initialize a 10x10 board
  useEffect(() => {
    updateBoard(10, 10);
  }, []);

  // update and fetch a new board
  function updateBoard(row, col) {
    async function getProblem() {
      const { rowHints, colHints } = await fetch(
        "http://localhost:8000/randomproblem?" +
          new URLSearchParams({
            rows: row,
            cols: col,
          })
      )
        .then((res) => res.json())
        .then((data) => JSON.parse(data));

      setRowHints(rowHints);
      setColHints(colHints);
      setRows(row);
      setCols(col);

      console.log("received problem");
    }
    getProblem();
  }

  console.log("rendering game", rows, cols, rowHints, colHints);
  return (
    <>
      <Selector rows={rows} cols={cols} updateBoard={updateBoard} />
      <Board
        rowCount={rows}
        colCount={cols}
        rowLabelsProp={rowHints}
        columnLabelsProp={colHints}
      />
    </>
  );
}

export default Game;
