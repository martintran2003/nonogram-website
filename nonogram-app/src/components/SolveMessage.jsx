function SolveMessage({ solveTime, newGame }) {
  const minutes = Math.floor(solveTime / 60000);
  const seconds = Math.floor((solveTime % 60000) / 1000);
  const milliseconds = solveTime % 1000;

  const timeStr =
    (minutes > 0 ? String(minutes) + ":" : "") +
    (seconds < 10 && minutes > 0 ? "0" : "") +
    seconds +
    "." +
    (milliseconds < 100 ? "0" : "") +
    (milliseconds < 10 ? "0" : "") +
    milliseconds;
  return (
    <div>
      You solved the puzzle in {timeStr}
      <button onClick={newGame}>New Game</button>
    </div>
  );
}

export default SolveMessage;
