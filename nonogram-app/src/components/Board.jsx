import { useState } from "react";
import "./Board.css";
function Board({ rows, cols, rowLabels, columnLabels }) {
  const [boardState, setBoardState] = useState(() => {
    const initBoard = [];
    for (let row = 0; row < rows; row++) {
      const boardRow = [];
      for (let col = 0; col < cols; col++) {
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
    for (let i = 0; i < rows; i++) {
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

    for (let i = 0; i < cols; i++) {
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
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
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

  function boardColumn(board, col) {
    return board.map((x) => x[col]);
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
    // Generate the possible positions for the pieces based on the row state
    const possiblePositions = generatePossiblePositions(
      rowLabels[row],
      board[row]
    );

    // If all the positions have a piece in the same spot, that piece is solved
    const solved = Array(rowLabels[row].length).fill(false);

    if (possiblePositions.length == 0) {
      return solved;
    }
    // iterate through each piece and check if all pieces starting locations are equal
    for (let pieceIndex = 0; pieceIndex < rowLabels[row].length; pieceIndex++) {
      let flag = false;
      const placement = possiblePositions[0][pieceIndex];
      for (let posIndex = 0; posIndex < possiblePositions.length; posIndex++) {
        if (placement != possiblePositions[posIndex][pieceIndex]) {
          flag = true;
          break;
        }
      }
      if (flag) continue;

      // if all are equal, also check if the cells of the piece are marked (avoids premptively marking solved)
      for (let i = placement; i < placement + rowLabels[row][pieceIndex]; i++) {
        if (board[row][i] != 1) {
          flag = true;
          break;
        }
      }
      if (flag) continue;

      solved[pieceIndex] = true;
    }

    return solved;
  }

  // evaluates the column and checks for solved pieces
  function evaluateCol(board, col) {
    // Generate the possible positions for the pieces based on the row state
    const possiblePositions = generatePossiblePositions(
      columnLabels[col],
      boardColumn(board, col)
    );

    console.log(col, possiblePositions);
    // If all the positions have a piece in the same spot, that piece is solved
    const solved = Array(columnLabels[col].length).fill(false);

    if (possiblePositions.length == 0) {
      return solved;
    }
    // iterate through each piece and check if all pieces starting locations are equal
    for (
      let pieceIndex = 0;
      pieceIndex < columnLabels[col].length;
      pieceIndex++
    ) {
      let flag = false;
      const placement = possiblePositions[0][pieceIndex];
      for (let posIndex = 0; posIndex < possiblePositions.length; posIndex++) {
        if (placement != possiblePositions[posIndex][pieceIndex]) {
          flag = true;
          break;
        }
      }
      if (flag) continue;

      // if all are equal, also check if the cells of the piece are marked (avoids premptively marking solved)
      for (
        let i = placement;
        i < placement + columnLabels[col][pieceIndex];
        i++
      ) {
        if (board[i][col] != 1) {
          flag = true;
          break;
        }
      }
      if (flag) continue;

      solved[pieceIndex] = true;
    }

    return solved;
  }

  // evaluates the board and checks that all pieces are solved for
  function evaluateBoard(board) {
    const rowSolved = [];
    const colSolved = [];

    for (let i = 0; i < rows; i++) {
      rowSolved.push(evaluateRow(board, i));
    }

    for (let i = 0; i < cols; i++) {
      colSolved.push(evaluateCol(board, i));
    }

    setRowLabelsSolved(rowSolved);
    setColumnLabelsSolved(colSolved);
  }

  // Given the pieces required and state of the row/Col, return the possible positions for the pieces
  function generatePossiblePositions(pieceSizes, state) {
    const size = state.length;
    const positions = [];

    const sum = (arr = []) => arr.reduce((total, val) => total + val, 0);

    // Iterate through possible placements of all of the pieces
    const stack = [[0, 0, sum(pieceSizes) + pieceSizes.length - 1, []]];

    let pieceIndex, start, minReq, pieces;
    while (stack.length > 0) {
      [pieceIndex, start, minReq, pieces] = stack.pop();

      if (pieceIndex == pieceSizes.length) {
        // If all pieces are placed, make sure that none of the trailing cells are selected
        let flag = false;
        for (let i = start; i < size; i++) {
          if (state[i] == 1) {
            flag = true;
            break;
          }
        }
        if (flag) continue;

        // Place the arrangements of pieces into the valid positions
        positions.push(pieces);
      } else {
        // Find the possible starting positions of the pieces
        // If there is a selected cell, that must be the start of the next piece only
        // If the previous cell was selected, then the piece must start there, so stop searching
        let pos = start - 1;
        while (++pos <= size - minReq && (pos == 0 || state[pos - 1] != 1)) {
          let flag = false;

          // Check cells where piece would be if there is an eliminated cell
          for (let i = 0; i < pieceSizes[pieceIndex]; i++) {
            if (state[pos + i] == 0) {
              flag = true;
              break;
            }
          }
          if (flag) continue;

          // Check bounds are not selected as pieces
          if (pos > 0 && state[pos - 1] == 1) continue;
          if (
            pos + pieceSizes[pieceIndex] < size &&
            state[pos + pieceSizes[pieceIndex]] == 1
          )
            continue;

          // Once validated, add the piece at pos and try to find the next piece
          stack.push([
            pieceIndex + 1,
            pos + pieceSizes[pieceIndex] + 1,
            minReq - pieceSizes[pieceIndex] - 1,
            pieces.concat([pos]),
          ]);
        }
      }
    }

    return positions;
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
