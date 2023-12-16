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
import { db } from "../javascript/firebase";
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

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    getSingleQuery(db, "jobs")
      .then((result) => result.docs.map((doc) => doc.data()))
      .then((mapped) => {
        // Sort job items and transform data for the chart
        const sorted = sortJobItems(mapped);
        const chartData = getChartData(sorted);

        // Extract unique months and final data for the chart
        const uniqueMonths = Object.keys(chartData);
        const finalData = Object.values(chartData);

        // Update state with unique months and chart data
        setMonths(uniqueMonths);
        setData(finalData);
      })
      .catch((error) => console.error(error));
  }, []);

  // Define colors for the chart lines
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

          {/* Retrieve the keys of the first object within the data array. If 
          data is empty, use empty object {} to avoid errors. */}
          {Object.keys(data[0] || {})
            // Filter out "name", "month", and "year" keys from the retrieved keys list.
            .filter((key) => !["name", "month", "year"].includes(key))
            // Map over the filtered keys to generate a set of <Line /> components for each key-value pair.
            .map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={key}
                // Assign line colors from an array, cycling through colors based on line index
                stroke={lineColors[index % lineColors.length]}
              />
            ))}
        </LineChart>
      </main>
      <Footer />
    </>
  );
}
