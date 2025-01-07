import { useEffect, useState } from "react";
import "./Board.css";

function Board({
  gameName,
  rowCount,
  colCount,
  rowLabelsProp,
  columnLabelsProp,
  solved,
  updateSolved,
  playable,
}) {
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);

  const [rowLabels, setRowLabels] = useState([]);
  const [columnLabels, setColumnLabels] = useState([]);
  const [rowLabelsSolved, setRowLabelsSolved] = useState([]);
  const [columnLabelsSolved, setColumnLabelsSolved] = useState([]);

  const [boardState, setBoardState] = useState([]);

  const [selecting, setSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState([]);
  const [pointing, setPointing] = useState([]);

  // update the board if the game changes
  useEffect(() => {
    // set the basic parts of the board
    setRows(rowCount);
    setCols(colCount);
    setRowLabels(rowLabelsProp);
    setColumnLabels(columnLabelsProp);

    // if there are no rows and cols, it is the first load
    // at this point, we can try to look for localStorage to find the board state
    if (rows == 0 && cols == 0 && loadBoardState() && loadSolvedState()) {
      return;
    }

    setBoardState(initBoard(rowCount, colCount));
    setRowLabelsSolved(initRowsSolved(rowCount, rowLabelsProp));
    setColumnLabelsSolved(initColsSolved(colCount, columnLabelsProp));
  }, [rowCount, colCount, rowLabelsProp, columnLabelsProp]);

  /*
    EVENT LISTENERS
  */

  // On downpress
  function selectStartCell(row, col) {
    function f() {
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
    if (selecting) {
      if (event.button == 0) {
        setCells(1);
      } else if (event.button == 2) {
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

  // get the cell states in a column of the board
  function boardColumn(board, col) {
    return board.map((x) => x[col]);
  }

  // create an empty board with given dimensions
  function initBoard(rows, cols) {
    const initBoard = [];
    for (let row = 0; row < rows; row++) {
      const boardRow = [];
      for (let col = 0; col < cols; col++) {
        boardRow.push(-1);
      }
      initBoard.push(boardRow);
    }
    return initBoard;
  }

  // create array for the solved states of row pieces
  function initRowsSolved(rows, rowLabels) {
    const rowsSolved = [];
    for (let i = 0; i < rows; i++) {
      const row = [];

      for (let j = 0; j < rowLabels[i].length; j++) {
        row.push(false);
      }

      rowsSolved.push(row);
    }

    return rowsSolved;
  }

  // create array for the solved states of column pieces
  function initColsSolved(cols, columnLabels) {
    const colsSolved = [];

    for (let i = 0; i < cols; i++) {
      const col = [];

      for (let j = 0; j < columnLabels[i].length; j++) {
        col.push(false);
      }

      colsSolved.push(col);
    }
    return colsSolved;
  }

  /*
    GAMEPLAY FUNCTIONS
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

    // evaluate solved board
    evaluateBoard(copy);

    // Set the new state
    setBoardState(copy);

    // save new state to localStorage
    saveBoardState(copy);
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

    // Check if the nonogram is solved
    if (checkWin(rowSolved, colSolved)) {
      updateSolved();
    }

    saveSolvedState(rowSolved, colSolved);

    setRowLabelsSolved(rowSolved);
    setColumnLabelsSolved(colSolved);
  }

  // check that all pieces are won
  function checkWin(rowSolved, colSolved) {
    if (rowSolved.length == 0 && colSolved.length == 0) return false; // never solve if there is no board

    return (
      rowSolved.every((row) => row.every((piece) => piece)) &&
      colSolved.every((col) => col.every((piece) => piece))
    );
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
    try {
      const rowsSolved = rowLabels[row].map((item, index) => {
        return rowLabelsSolved[row][index] ? (
          <em key={"rowhint" + row + "-" + index}>{String(item)}</em>
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
    } catch (err) {
      return [];
    }
  }

  function getColHints(col) {
    try {
      const colsSolved = columnLabels[col].map((item, index) => {
        return columnLabelsSolved[col][index] ? (
          <em key={"colhint" + col + "-" + index}>{String(item)}</em>
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
    } catch (err) {
      return [];
    }
  }

  /*
    Local Storage functions
  */

  // save the current board state into localStorage
  // use the given name for the board to differentiate between different game types
  function saveBoardState(board) {
    localStorage.setItem(gameName + ".board", JSON.stringify(board));
  }

  // load the saved board state from localStorage
  function loadBoardState() {
    const board = JSON.parse(localStorage.getItem(gameName + ".board"));
    if (board == null) return false;

    setBoardState(board); // set the board state

    return true;
  }

  // save the state of the solved rows and columns
  function saveSolvedState(solvedRows, solvedCols) {
    localStorage.setItem(gameName + ".solvedRows", JSON.stringify(solvedRows));
    localStorage.setItem(
      gameName + ".solvedColumns",
      JSON.stringify(solvedCols)
    );
  }

  // load the saved hint solved state from localStorage
  function loadSolvedState() {
    const rowsSolved = JSON.parse(
      localStorage.getItem(gameName + ".solvedRows")
    );
    const colsSolved = JSON.parse(
      localStorage.getItem(gameName + ".solvedColumns")
    );

    if (rowsSolved == null || colsSolved == null) return false;

    setRowLabelsSolved(rowsSolved);
    setColumnLabelsSolved(colsSolved);

    return true;
  }

  return (
    <div className="board">
      <table
        className={
          "table" +
          (solved ? " solved" : "") +
          " " +
          (playable ? "" : "unplayable")
        }
        onMouseLeave={resetState}
        onContextMenu={(event) => {
          event.preventDefault();
        }}
      >
        <tbody>
          <tr key="top-row">
            <td className="label" onMouseEnter={resetState}></td>
            {columnLabels.map((_, index) => (
              <td
                key={"columnlabel-" + String(index)}
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
    </div>
  );
}

export default Board;
