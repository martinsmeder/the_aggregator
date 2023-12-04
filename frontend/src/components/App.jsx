import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Summaries from "./Summaries";
import Feeds from "./Feeds";
import Trends from "./Trends";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Summaries />,
    },
    {
      path: "feeds",
      element: <Feeds />,
    },
    {
      path: "trends",
      element: <Trends />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
