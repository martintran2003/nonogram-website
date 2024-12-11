import Board from "./Board.jsx";
import { useState, useEffect } from "react";

function Game() {
  const [rowHints, setRowHints] = useState([]);
  const [colHints, setColHints] = useState([]);
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);

  useEffect(() => {
    async function getProblem() {
      const { rowHints, colHints, rows, cols } = await fetch(
        "http://localhost:8000/randomproblem"
      )
        .then((res) => res.json())
        .then((data) => JSON.parse(data));

      setRowHints(rowHints);
      setColHints(colHints);
      setRows(rows);
      setCols(cols);

      console.log("received problem");
    }
    getProblem();
  }, []);

  console.log("rendering game", rows, cols, rowHints, colHints);
  return (
    <Board
      rowCount={rows}
      colCount={cols}
      rowLabelsProp={rowHints}
      columnLabelsProp={colHints}
    />
  );
}

export default Game;
