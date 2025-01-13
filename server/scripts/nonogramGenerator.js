// nonogramGenerator.js

function generateBoard(rows, columns, seed) {
  board = [];
  const randGen = sfc320or1(rows, columns, seed, seed);

  // generate the board
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < columns; j++) {
      row.push(randGen());
    }
    board.push(row);
  }

  // get the hints for the board
  const [rowHints, colHints] = generatePieceSizes(board);

  return {
    rowHints: rowHints,
    colHints: colHints,
    rows: rows,
    cols: columns,
  };
}

function generatePieceSizes(board) {
  const rows = board.length;
  const cols = board[0].length;

  const rowHints = [];
  const colHints = [];

  for (let i = 0; i < rows; i++) {
    let currentSize = 0;
    const hintRow = [];

    for (let j = 0; j < cols; j++) {
      if (board[i][j] == 1) {
        currentSize += 1;
      } else {
        if (currentSize > 0) {
          hintRow.push(currentSize);
          currentSize = 0;
        }
      }
    }

    if (currentSize > 0) {
      hintRow.push(currentSize);
    }

    rowHints.push(hintRow);
  }

  for (let j = 0; j < cols; j++) {
    let currentSize = 0;
    const hintCol = [];

    for (let i = 0; i < rows; i++) {
      if (board[i][j] == 1) {
        currentSize += 1;
      } else {
        if (currentSize > 0) {
          hintCol.push(currentSize);
          currentSize = 0;
        }
      }
    }

    if (currentSize > 0) {
      hintCol.push(currentSize);
    }

    colHints.push(hintCol);
  }

  return [rowHints, colHints];
}

// random function that returns either 0 or 1
function sfc320or1(a, b, c, d) {
  return function () {
    a |= 0;
    b |= 0;
    c |= 0;
    d |= 0;
    let t = (((a + b) | 0) + d) | 0;
    d = (d + 1) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    c = (c + t) | 0;
    return (t >>> 0) % 2;
  };
}

module.exports = { generateBoard };
