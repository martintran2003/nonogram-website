import "./Nav.css";
function Nav({ setHome, setPractice }) {
  return (
    <div className="nav">
      <ul className="nav-list">
        <li className="nav-item home" onClick={setHome}>
          Nonograms
        </li>
        <li className="nav-item practice" onClick={setPractice}>
          Practice Mode
        </li>
      </ul>
    </div>
  );
}

export default Nav;
