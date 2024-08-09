import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Header() {
  const location = useLocation(); // Get access to the current URL location
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    // Update activeLink when location changes
    setActiveLink(location.pathname);
  }, [location]);

  const handleClick = (path) => {
    setActiveLink(path);
  };

  return (
    <header>
      <h1>THE AGGREGATOR</h1>
      <nav>
        <Link
          to="/"
          onClick={() => handleClick("/")}
          className={activeLink === "/" ? "active" : ""}
        >
          <img src="summaries.png" alt="Summaries" />
          <p>Summaries</p>
        </Link>

        <Link
          to="/news"
          onClick={() => handleClick("/news")}
          className={activeLink === "/news" ? "active" : ""}
        >
          <img src="feeds.png" alt="Feeds" />
          <p>News</p>
        </Link>

        <Link
          to="/trends"
          onClick={() => handleClick("/trends")}
          className={activeLink === "/trends" ? "active" : ""}
        >
          <img src="trends.png" alt="Trends" />
          <p>Trends</p>
        </Link>
      </nav>
    </header>
  );
}
