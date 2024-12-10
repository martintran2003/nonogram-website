import random
import sys
import json

def boardGenerator(rows, columns, seed=1):
  board = [[0] * columns for _ in range(rows)]

  random.seed(seed)
  # GENERATE BOARD
  for row in range(rows):
    for col in range(columns):
      board[row][col] = random.randint(0, 1)
  
  return board

def generatePieceSizes(board):
  rows = len(board)
  cols = len(board[0])

  rowClues = [list() for _ in range(rows)]
  colClues = [list() for _ in range(cols)]

  for row in range(rows):
    currentSize = 0
    for col in range(cols):
      if board[row][col]:
        currentSize += 1
      else:
        if currentSize:
          rowClues[row].append(currentSize)
          currentSize = 0
    
    if currentSize:
      rowClues[row].append(currentSize)
  
  for col in range(cols):
    currentSize = 0
    for row in range(rows):
      if board[row][col]:
        currentSize += 1
      else:
        if currentSize:
          colClues[col].append(currentSize)
          currentSize = 0

    if currentSize: 
      colClues[col].append(currentSize)
  
  return [rowClues, colClues]

if __name__ == "__main__":
  rows = int(sys.argv[1])
  cols = int(sys.argv[2])
  seed = int(sys.argv[3])
  board = boardGenerator(rows, cols, seed)
  pieces = generatePieceSizes(board)
  print(json.dumps({"rowHints": pieces[0], "colHints": pieces[1], "rows": rows, "cols": cols}))

    
    