import "./Nav.css";
function Nav({ setHome, setPractice }) {
  function onEnterPress(func) {
    return (event) => {
      if ((event.key = "Enter")) {
        func();
      }
    };
  }
  return (
    <div className="nav">
      <ul className="nav-list">
        <li className="nav-item" onClick={setHome}>
          <h1 tabIndex="0" onKeyDown={onEnterPress(setHome)} className="home">
            Nonograms
          </h1>
        </li>
        <li className="nav-item" onClick={setPractice}>
          <p
            tabIndex="0"
            onKeyDown={onEnterPress(setPractice)}
            className="practice"
          >
            Practice Mode
          </p>
        </li>
      </ul>
    </div>
  );
}

export default Nav;
