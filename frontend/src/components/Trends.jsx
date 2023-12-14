import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { getSingleQuery } from "../javascript/database-logic";
import { testDb } from "../javascript/firebase-test";
import Header from "./Header";
import Footer from "./Footer";
import { getChartData, sortJobItems } from "../javascript/utils";

export default function Trends() {
  const [data, setData] = useState([]);
  const [months, setMonths] = useState([]);
  const [chartWidth, setChartWidth] = useState(800);

  useEffect(() => {
    function handleResize() {
      const screenWidth = window.innerWidth;
      if (screenWidth < 600) {
        setChartWidth(500);
      } else if (screenWidth < 900) {
        setChartWidth(600);
      } else {
        setChartWidth(800);
      }
    }

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    getSingleQuery(testDb, "jobs")
      .then((result) => result.docs.map((doc) => doc.data()))
      .then((mapped) => {
        const sorted = sortJobItems(mapped);
        const chartData = getChartData(sorted);

        const uniqueMonths = Object.keys(chartData);
        const finalData = Object.values(chartData);

        setMonths(uniqueMonths);
        setData(finalData);
      })
      .catch((error) => console.error(error));
  }, []);

  const lineColors = ["#FF0000", "#0000FF", "#00FF00", "#FFA500", "#800080"];

  return (
    <>
      <Header />
      <main id="charts">
        <h1>Available jobs on Jooble</h1>

        <LineChart width={chartWidth} height={400} data={data}>
          <XAxis dataKey="name" tickCount={months.length} />
          <YAxis />
          <CartesianGrid stroke="#eee" />
          <Tooltip />
          <Legend />
          {Object.keys(data[0] || {})
            .filter((key) => !["name", "month", "year"].includes(key))
            .map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={key}
                stroke={lineColors[index % lineColors.length]}
              />
            ))}
        </LineChart>
      </main>
      <Footer />
    </>
  );
}
