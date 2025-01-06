import { useEffect, useState } from "react";
// Component that selects the rows and columns of the board
function Selector({ rows, cols, seed, updateBoard }) {
  const [currentRows, setCurrentRows] = useState(rows);
  const [currentCols, setCurrentCols] = useState(cols);
  const [currentSeed, setCurrentSeed] = useState(seed);

  useEffect(() => {
    setCurrentRows(rows);
    setCurrentCols(cols);
    setCurrentSeed(seed);
  }, [rows, cols, seed]);

  function sumbitNewBoard(event) {
    event.preventDefault();
    updateBoard(
      event.target.rows.value,
      event.target.cols.value,
      event.target.seed.value
    );
  }

  return (
    <>
      <form onSubmit={sumbitNewBoard}>
        <label htmlFor="rows">Rows:</label>
        <input
          type="number"
          id="rows"
          name="rows"
          min="1"
          max="20"
          value={currentRows}
          onChange={(event) => {
            setCurrentRows(event.target.value);
          }}
        ></input>
        <label htmlFor="cols">Columns</label>
        <input
          type="number"
          id="cols"
          name="cols"
          min="1"
          max="20"
          value={currentCols}
          onChange={(event) => {
            setCurrentCols(event.target.value);
          }}
        ></input>
        <label htmlFor="seed">Seed</label>
        <input
          type="number"
          id="seed"
          name="seed"
          min="0"
          max={2 ** 32 - 1}
          value={currentSeed}
          onChange={(event) => {
            setCurrentSeed(event.target.value);
          }}
        ></input>

        <input type="submit" />
      </form>
    </>
  );
}

export default Selector;
