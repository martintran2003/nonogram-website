// Component that selects the rows and columns of the board
function Selector({ rows, cols, updateBoard }) {
  function sumbitNewBoard(event) {
    event.preventDefault();
    updateBoard(event.target.rows.value, event.target.cols.value);
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
          placeholder={rows}
        ></input>
        <label htmlFor="cols">Columns</label>
        <input
          type="number"
          id="cols"
          name="cols"
          min="1"
          max="20"
          placeholder={cols}
        ></input>
        <input type="submit" />
      </form>
    </>
  );
}

export default Selector;
