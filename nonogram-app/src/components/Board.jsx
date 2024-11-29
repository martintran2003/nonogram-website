import { useState } from "react";
import "./Board.css";
function Board({ size, rowLabels, columnLabels }) {
  const [boardState, setBoardState] = useState(() => {
    const initBoard = [];
    for (let row = 0; row < size; row++) {
      const boardRow = [];
      for (let col = 0; col < size; col++) {
        boardRow.push(-1);
      }
      initBoard.push(boardRow);
    }
    return initBoard;
  });

  const [selecting, setSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState([]);
  const [pointing, setPointing] = useState([]);

  const [rowLabelsSolved, setRowLabelsSolved] = useState(() => {
    const rowsSolved = [];
    for (let i = 0; i < size; i++) {
      const row = [];

      for (let j = 0; j < rowLabels[i].length; j++) {
        row.push(false);
      }

      rowsSolved.push(row);
    }
    return rowsSolved;
  });
  const [columnLabelsSolved, setColumnLabelsSolved] = useState(() => {
    const colsSolved = [];

    for (let i = 0; i < size; i++) {
      const col = [];

      for (let j = 0; j < columnLabels[i].length; j++) {
        col.push(false);
      }

      colsSolved.push(col);
    }
    return colsSolved;
  });

  /*
    EVENT LISTENERS
  */

  // On downpress
  function selectStartCell(row, col) {
    function f() {
      console.log("down", row, col);
      setPointing([row, col]);
      // if either one is currently held down, the opposite will cancel
      if (selecting) {
        setSelecting(false);
      } else {
        setSelecting(true);
        setSelectionStart([row, col]); // set the selection start to the current cell
      }
    }

    return f;
  }

  // When cell is hovered
  function hoverCell(row, col) {
    function f() {
      // set the pointing cell
      setPointing([row, col]);
    }

    return f;
  }

  // resets state back to start and ends current selections/pointing
  function resetState() {
    resetSelection();
    setPointing([]);
  }

  // remove the selection
  function resetSelection() {
    setSelectionStart([]);
    setSelecting(false);
  }

  // Mark available cells as selected
  function performSelection(event) {
    // make sure still in leftSelecting mode
    if (selecting) {
      if (event.button == 0) {
        console.log("left release");
        setCells(1);
      } else if (event.button == 2) {
        console.log("right release");
        setCells(0);
      }

      resetSelection();
    }
  }

  /* 
    HELPER FUNCTIONS
  */

  // create a deep copy of the current board state
  function copyBoardState() {
    const copy = [];
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        row.push(boardState[i][j]);
      }
      copy.push(row);
    }

    return copy;
  }

  // returns true if the difference in rows is > difference in cols from the start and pointing cell
  function maxDirection() {
    return (
      Math.abs(selectionStart[0] - pointing[0]) >
      Math.abs(selectionStart[1] - pointing[1])
    );
  }

  /*
    GAME FUNCTIONS
  */

  // set cells from start cell to pointing cell
  function setCells(type) {
    const copy = copyBoardState();

    // Find the direction where the start and end is farthest
    if (maxDirection()) {
      // if in a column
      let col = selectionStart[1];
      let startRow = Math.min(selectionStart[0], pointing[0]);
      let endRow = Math.max(selectionStart[0], pointing[0]);
      for (let i = startRow; i <= endRow; i++) {
        if (copy[i][col] == type) {
          // if same selection, flip
          copy[i][col] = -1;
        } else {
          // if different, set to type
          copy[i][col] = type;
        }
      }
    } else {
      // if in a row
      let row = selectionStart[0];
      let startCol = Math.min(selectionStart[1], pointing[1]);
      let endCol = Math.max(selectionStart[1], pointing[1]);
      for (let i = startCol; i <= endCol; i++) {
        if (copy[row][i] == type) {
          copy[row][i] = -1;
        } else {
          copy[row][i] = type;
        }
      }
    }

    evaluateBoard(copy);

    // Set the new state
    setBoardState(copy);
  }

  // evaluates the row and checks for solved pieces and updates
  function evaluateRow(board, row) {
    // Get the pieces in the row
    const pieces = [];
    let currentPiece = 0;
    for (let i = 0; i < size; i++) {
      if (board[row][i] == 1) {
        currentPiece++;
      } else {
        if (currentPiece > 0) {
          pieces.push(currentPiece);
          currentPiece = 0;
        }
      }
    }
    if (currentPiece > 0) {
      pieces.push(currentPiece);
    }

    const solved = Array(rowLabels[row].length).fill(false);

    // if there are more pieces than on the labels, don't evaluate the pieces
    if (pieces.length > rowLabels[row].length) return solved;

    // go forward and look for matching pieces
    let forwardIndex = 0;
    while (
      forwardIndex < pieces.length &&
      pieces[forwardIndex] == rowLabels[row][forwardIndex]
    ) {
      solved[forwardIndex] = true;
      forwardIndex++;
    }

    // go backwards and look for matching pieces
    // go up to the piece that the forward pass was not able to solve
    let backwardIndex = 0;
    while (
      pieces.length - 1 - backwardIndex >= forwardIndex &&
      pieces[pieces.length - 1 - backwardIndex] ==
        rowLabels[row][rowLabels[row].length - 1 - backwardIndex]
    ) {
      solved[solved.length - 1 - backwardIndex] = true;
      backwardIndex++;
    }

    return solved;
  }

  // evaluates the column and checks for solved pieces
  function evaluateCol(board, col) {
    // Get the pieces in the row
    const pieces = [];
    let currentPiece = 0;
    for (let i = 0; i < size; i++) {
      if (board[i][col] == 1) {
        currentPiece++;
      } else {
        if (currentPiece > 0) {
          pieces.push(currentPiece);
          currentPiece = 0;
        }
      }
    }
    if (currentPiece > 0) {
      pieces.push(currentPiece);
    }

    const solved = Array(columnLabels[col].length).fill(false);

    // if there are more pieces than on the labels, don't evaluate the pieces
    if (pieces.length > columnLabels[col].length) return solved;

    // go forward and look for matching pieces
    let forwardIndex = 0;
    while (
      forwardIndex < pieces.length &&
      pieces[forwardIndex] == columnLabels[col][forwardIndex]
    ) {
      solved[forwardIndex] = true;
      forwardIndex++;
    }

    // go backwards and look for matching pieces
    // go up to the piece that the forward pass was not able to solve
    let backwardIndex = 0;
    while (
      pieces.length - 1 - backwardIndex >= forwardIndex &&
      pieces[pieces.length - 1 - backwardIndex] ==
        columnLabels[col][columnLabels[col].length - 1 - backwardIndex]
    ) {
      solved[solved.length - 1 - backwardIndex] = true;
      backwardIndex++;
    }

    return solved;
  }

  // evaluates the board and checks that all pieces are solved for
  function evaluateBoard(board) {
    const rowSolved = [];
    const colSolved = [];

    for (let i = 0; i < size; i++) {
      rowSolved.push(evaluateRow(board, i));
      colSolved.push(evaluateCol(board, i));
    }

    setRowLabelsSolved(rowSolved);
    setColumnLabelsSolved(colSolved);
  }
  /*
    DOM Helpers
  */
  function getClasses(row, col) {
    let classes = "cell ";
    // evaluate marked cells
    if (boardState[row][col] == 1) {
      classes += "selected ";
    } else if (boardState[row][col] == 0) {
      classes += "eliminated ";
    }

    // determine which cells are hovered/guides based on selection mode
    // if currently selecting, all cells in the way of the selection are hovered
    // cells perpendicular to the pointed cell are guides
    // if not selecting, only the cell pointed at is hovered
    // all cells that share the same x/y with the pointing are guides
    if (!selecting) {
      // if not selecting, only the pointing gets to hover
      if (row == pointing[0] && col == pointing[1]) {
        classes += "hover";
      } else if (
        boardState[row][col] == -1 &&
        (col == pointing[1] || row == pointing[0])
      ) {
        classes += "guide";
      }
    } else {
      // if selecting
      if (maxDirection()) {
        // if vertical, same column as start and between rows are hovered
        // same row as pointed is guide
        const minRow = Math.min(selectionStart[0], pointing[0]);
        const maxRow = Math.max(selectionStart[0], pointing[0]);

        if (col == selectionStart[1] && minRow <= row && row <= maxRow) {
          classes += "hover";
        } else if (boardState[row][col] == -1 && row == pointing[0]) {
          classes += "guide";
        }
      } else {
        // if horizontal, same row as start and between cols are hovered
        // save col as pointed is guide
        const minCol = Math.min(selectionStart[1], pointing[1]);
        const maxCol = Math.max(selectionStart[1], pointing[1]);

        if (row == selectionStart[0] && minCol <= col && col <= maxCol) {
          classes += "hover";
        } else if (boardState[row][col] == -1 && col == pointing[1]) {
          classes += "guide";
        }
      }
    }
    return classes;
  }

  function getRowHints(row) {
    const rowsSolved = rowLabels[row].map((item, index) => {
      return rowLabelsSolved[row][index] ? (
        <em>{String(item)}</em>
      ) : (
        String(item)
      );
    });

    const interleaved = [];
    rowsSolved.forEach((element) => {
      if (interleaved) {
        interleaved.push(" ");
      }
      interleaved.push(element);
    });
    return interleaved;
  }

  function getColHints(col) {
    const colsSolved = columnLabels[col].map((item, index) => {
      return columnLabelsSolved[col][index] ? (
        <em>{String(item)}</em>
      ) : (
        String(item)
      );
    });

    const interleaved = [];
    colsSolved.forEach((element, index) => {
      if (interleaved) {
        interleaved.push(<br key={"columnlabelbreak" + String(index)} />);
      }
      interleaved.push(element);
    });
    return interleaved;
  }

  return (
    <table
      onMouseLeave={resetState}
      onContextMenu={(event) => {
        event.preventDefault();
      }}
    >
      <tbody>
        <tr>
          <td className="label" onMouseEnter={resetState}></td>
          {columnLabels.map((colHints, index) => (
            <td
              key={"columnlabel" + String(index)}
              className="label"
              onMouseEnter={resetState}
            >
              {getColHints(index)}
            </td>
          ))}
        </tr>
        {boardState.map((row, index) => (
          <tr key={"row" + String(index)}>
            <td className="label" onMouseEnter={resetState}>
              {getRowHints(index)}
            </td>
            {row.map((cell, index2) => (
              <td
                key={"cell" + String(index) + "-" + String(index2)}
                className={getClasses(index, index2)}
                onMouseUp={performSelection}
                onMouseDown={selectStartCell(index, index2)}
                onMouseEnter={hoverCell(index, index2)}
              ></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Board;
