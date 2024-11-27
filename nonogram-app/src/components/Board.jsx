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

  const [isLeftSelecting, setIsLeftSelecting] = useState(false);
  const [isRightSelecting, setIsRightSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState([]);
  const [pointing, setPointing] = useState([]);

  console.log(pointing);
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

  // On downpress
  function OnClickFactory(row, col) {
    function OnClick() {
      // if either one is currently held down, the opposite will cancel
      if (isLeftSelecting || isRightSelecting) {
        setIsLeftSelecting(false);
        setIsRightSelecting(false);
      } else {
        setSelectionStart([row, col]); // set the selection start to the current cell
      }
    }

    return OnClick;
  }

  // When cell is hovered
  function OnHoverFactory(row, col) {
    function OnHover() {
      // set the pointing cell
      setPointing([row, col]);
    }

    return OnHover;
  }

  function OnUnhover() {
    setPointing([]);
  }

  // Mark available cells as selected
  function OnLeftClickRelease() {
    // make sure still in leftSelecting mode
    if (isLeftSelecting) {
      setCells(1);
    }
  }

  // Mark available cells as eliminated
  function OnRightClickRelease(event) {
    event.preventDefault();
    // make sure still in rightSelecting mode
    if (isRightSelecting) {
      setCells(0);
    }
  }

  // set cells from start cell to pointing cell
  function setCells(type) {
    const copy = copyBoardState();

    // Find the direction where the start and end is farthest
    if (maxDirection()) {
      // if in a row
      col = selectionStart[1];
      startRow = min(selectionStart[0], pointing[0]);
      endRow = max(selectionStart[0], pointing[0]);
      for (let i = startRow; i <= endRow; i++) {
        copy[i][col] = type;
      }
    } else {
      // if in a column
      row = selectionStart[0];
      startCol = min(selectionStart[1], pointing[1]);
      endCol = max(selectionStart[1], pointing[1]);
      for (let i = startCol; i <= endCol; i++) {
        copy[row][i] = type;
      }
    }

    // Set the new state
    setBoardState(copy);
  }

  // create a deep copy of the current board state
  function copyBoardState() {
    const copy = [];
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        row.push(boardState[i][j]);
      }
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
    if (!isLeftSelecting && !isRightSelecting) {
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
      if (maxDirection) {
        // if vertical, same column as start and between rows are hovered
        // same row as pointed is guide
        const minRow = Math.min(selectionStart[0], pointing[0]);
        const maxRow = Math.max(selectionStart[0], pointing[0]);

        if (col == selectionStart[1] && minRow <= row && row <= maxRow) {
          classes += "hover";
        } else if (boardState[row][col] == -1 && row == pointing[0]) {
          classes += "hover";
        }
      } else {
        // if horitontal, same row as start and between cols are hovered
        // save col as pointed is guide
        const minCol = Math.min(selectionStart[1], pointing[1]);
        const maxCol = Math.max(selectionStart[1], pointing[1]);

        if (row == selectionStart[0] && minCol <= col && col <= maxCol) {
          classes += "hover";
        } else if (boardState[row][col] == -1 && col == pointing[1]) {
          classes += "hover";
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
    console.log(interleaved);
    return interleaved;
  }

  return (
    <table>
      <tbody>
        <tr>
          <td className="label"></td>
          {columnLabels.map((colHints, index) => (
            <td key={"columnlabel" + String(index)} className="label">
              {getColHints(index)}
            </td>
          ))}
        </tr>
        {boardState.map((row, index) => (
          <tr key={"row" + String(index)}>
            <td className="label">{getRowHints(index)}</td>
            {row.map((cell, index2) => (
              <td
                key={"cell" + String(index) + "-" + String(index2)}
                className={getClasses(index, index2)}
                onClick={OnLeftClickRelease}
                onMouseDown={OnClickFactory(index, index2)}
                onMouseOver={OnHoverFactory(index, index2)}
                onMouseOut={OnUnhover}
                onContextMenu={OnRightClickRelease}
              ></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Board;
