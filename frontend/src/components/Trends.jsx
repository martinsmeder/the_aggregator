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

export default function Trends() {
  const [data, setData] = useState([]);
  const [months, setMonths] = useState([]);

  useEffect(() => {
    getSingleQuery(testDb, "jobs")
      .then((result) => result.docs.map((doc) => doc.data()))
      .then((mapped) => {
        // Reduce the fetched data to transform it into a suitable format for Recharts
        const chartData = mapped.reduce((acc, item) => {
          // Generate a unique key for each combination of month and year
          const key = `${item.month}-${item.year}`;
          // Initialize the entry for the key in the accumulator or use an existing entry
          acc[key] = acc[key] || { name: key };
          // Store the count of each item name within its respective month-year entry
          acc[key][item.name] = item.count;

          return acc;
        }, {}); // Initial empty object for the accumulator

        const uniqueMonths = Object.keys(chartData);
        const finalData = Object.values(chartData);

        setMonths(uniqueMonths);
        setData(finalData);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      <Header />

      <main>
        <LineChart width={700} height={400} data={data}>
          <XAxis dataKey="name" tickCount={months.length} />
          <YAxis />
          <CartesianGrid stroke="#eee" />
          <Tooltip />
          <Legend />

          {Object.keys(data[0] || {})
            // Filter out keys that are not needed for rendering lines in the chart
            .filter((key) => !["name", "month", "year"].includes(key))
            // Map each relevant key to a Line component for rendering in the chart
            .map((key) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={key}
                stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
              />
            ))}
        </LineChart>
      </main>
      <Footer />
    </>
  );
}
