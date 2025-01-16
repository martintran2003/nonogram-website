import "./styles/Nav.css";
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
      <div className="nav-container">
        <div className="nav-left">
          <h1 className="logo" tabIndex="0" onKeyDown={onEnterPress(setHome)}>
            <a className="home" href="/">
              Nonograms
            </a>
          </h1>
          <ul className="nav-list">
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
        <div className="nav-right"></div>
      </div>
    </div>
  );
}

export default Nav;
