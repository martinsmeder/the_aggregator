import { getSingleQuery } from "../javascript/database-logic";
import { db } from "../javascript/firebase";
import Header from "./Header";
import Footer from "./Footer";
import { sortJobItems } from "../javascript/utils";
import { useState, useEffect } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

export default function Trends() {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  const lineColors = ["#FF0000", "#0000FF", "#00FF00", "#FFA500", "#800080"];
  const backgroundColors = [
    "rgba(255, 0, 0, 0.5)",
    "rgba(0, 0, 255, 0.5)",
    "rgba(0, 255, 0, 0.5)",
    "rgba(255, 165, 0, 0.5)",
    "rgba(128, 0, 128, 0.5)",
  ];

  useEffect(() => {
    getSingleQuery(db, "jobs")
      .then((result) => result.docs.map((doc) => doc.data()))
      .then((mapped) => {
        // Sort job data
        const sorted = sortJobItems(mapped);
        //Transform data for the chart
        const chartData = sorted.reduce(
          (acc, item, index) => {
            // Create label for x-axis
            const label = `${item.month}-${item.year}`;
            // Add label to accumulator if not present
            if (!acc.labels.includes(label)) {
              acc.labels.push(label);
            }

            // Find index of dataset with the same label
            const datasetIndex = acc.datasets.findIndex(
              (dataset) => dataset.label === item.name
            );

            // If dataset with the label doesn't exist, create a new one
            if (datasetIndex === -1) {
              acc.datasets.push({
                label: item.name,
                data: [item.count],
                borderColor: lineColors[index % lineColors.length],
                backgroundColor:
                  backgroundColors[index % backgroundColors.length],
                borderWidth: 1,
              });
            } else {
              // If dataset exists, add count to its data array
              acc.datasets[datasetIndex].data.push(item.count);
            }

            return acc; // Return updated accumulator
          },
          { labels: [], datasets: [] } // Initial accumulator with empty labels and datasets arrays
        );
        setChartData(chartData);
      })
      .catch((error) => console.error(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header />

      <main id="charts">
        <h1>Available jobs on Jooble</h1>
        <Line options={options} data={chartData} />
      </main>

      <Footer />
    </>
  );
}
