import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Summaries from "./Summaries";
import News from "./News";
import Trends from "./Trends";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Summaries />,
    },
    {
      path: "news",
      element: <News />,
    },
    {
      path: "trends",
      element: <Trends />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
