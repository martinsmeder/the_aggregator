// https://recharts.org/en-US/guide
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  {
    name: "Jan (2023)",
    jobsField1: Math.floor(Math.random() * (500000 - 50000 + 1)) + 50000,
    jobsField2: Math.floor(Math.random() * (500000 - 50000 + 1)) + 50000,
    // Add more fields as needed...
  },
  {
    name: "Feb (2023)",
    jobsField1: Math.floor(Math.random() * (500000 - 50000 + 1)) + 50000,
    jobsField2: Math.floor(Math.random() * (500000 - 50000 + 1)) + 50000,
    // Add more fields as needed...
  },
  {
    name: "Mar (2023)",
    jobsField1: Math.floor(Math.random() * (500000 - 50000 + 1)) + 50000,
    jobsField2: Math.floor(Math.random() * (500000 - 50000 + 1)) + 50000,
    // Add more fields as needed...
  },
  {
    name: "Apr (2023)",
    jobsField1: Math.floor(Math.random() * (500000 - 50000 + 1)) + 50000,
    jobsField2: Math.floor(Math.random() * (500000 - 50000 + 1)) + 50000,
    // Add more fields as needed...
  },
  {
    name: "May (2023)",
    jobsField1: Math.floor(Math.random() * (500000 - 50000 + 1)) + 50000,
    jobsField2: Math.floor(Math.random() * (500000 - 50000 + 1)) + 50000,
    // Add more fields as needed...
  },
  {
    name: "Jun (2023)",
    jobsField1: Math.floor(Math.random() * (500000 - 50000 + 1)) + 50000,
    jobsField2: Math.floor(Math.random() * (500000 - 50000 + 1)) + 50000,
    // Add more fields as needed...
  },

  // Add other months...
];

const MyChart = () => (
  <LineChart width={700} height={400} data={data}>
    <XAxis dataKey="name" />
    <YAxis />
    <CartesianGrid stroke="#eee" />
    <Tooltip />
    <Legend />
    <Line
      type="monotone"
      dataKey="jobsField1"
      stroke="#8884d8"
      name="Front End"
    />
    <Line
      type="monotone"
      dataKey="jobsField2"
      stroke="#82ca9d"
      name="Back End"
    />
    {/* Add more <Line /> components for additional fields */}
  </LineChart>
);

export default MyChart;
