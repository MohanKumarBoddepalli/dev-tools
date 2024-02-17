// App.js
import React, { useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import CompareText from "./components/compare-text";
import Formatter from "./components/formatter";
import "./App.css";

const App = () => {
  const [background, setBackground] = useState("");

  useEffect(() => {
    setBackground(window.location.hash);
  }, []);

  return (
    <Router>
      <div className="">
        <div className="header-bar">
          <nav className="horizontal-tabs">
            <ul>
              <li
                className={background === "#/" ? "selected-tab" : ""}
                onClick={() => setBackground(window.location.hash)}
              >
                <Link to="/">Compare Text</Link>
              </li>
              <li
                className={background === "#/format" ? "selected-tab" : ""}
                onClick={() => setBackground(window.location.hash)}
              >
                <Link to="/format">sql-Format</Link>
              </li>
              {/* ... other navigation links */}
            </ul>
          </nav>
        </div>
        <Routes>
          <Route path="/" element={<CompareText />} />
          <Route path="/format" element={<Formatter />} />
          {/* ... other route definitions */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
