import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header>
      <nav>
        <Link to="/">Summaries</Link>

        <Link to="/feeds">Feeds</Link>

        <Link to="/trends">Trends</Link>
      </nav>
    </header>
  );
}
