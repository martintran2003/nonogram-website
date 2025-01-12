import "./styles/StartPanel.css";

function StartPanel({
  startAction, // what to perform when the game is started
}) {
  return (
    <div>
      <p>
        Start Game
        <br />
        Start a new game.
        <br />
        <span className="caution">
          NOTE: starting the game will start the timer which will continue even
          when the game is closed or paused.
        </span>
      </p>
      <button onClick={startAction}>Start</button>
    </div>
  );
}

export default StartPanel;
