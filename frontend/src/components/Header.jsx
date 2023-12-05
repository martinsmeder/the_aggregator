import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header>
      <h1>THE AGGREGATOR</h1>

      <nav>
        <Link to="/">
          <img src="summaries.png" alt="Summaries" />
          <p>Summaries</p>
        </Link>

        <Link to="/feeds">
          <img src="feeds.png" alt="Feeds" />
          <p>Feeds</p>
        </Link>

        <Link to="/trends">
          <img src="trends.png" alt="Trends" />
          <p>Trends</p>
        </Link>
      </nav>
    </header>
  );
}
