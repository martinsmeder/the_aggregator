/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-target-blank */
import { getSingleQuery } from "../javascript/database-logic";
import { sortItems } from "../javascript/utils";
import { db } from "../javascript/firebase";
import { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function Summaries() {
  const [items, setItems] = useState([]);  // State to store fetched summaries
  const [error, setError] = useState(null);  // State to store any error

  useEffect(() => {
    // Fetch data from "summaries" collection
    getSingleQuery(db, "summaries")
      .then((querySnapshot) => {
        // Map documents to an array of items
        return querySnapshot.docs.map((doc) => doc.data());
      })
      .then((mapped) => {
        // Sort the items and update the state
        const sortedItems = sortItems(mapped);
        setItems(sortedItems);
      })
      .catch((error) => setError(error));  // Handle and store any errors
  }, []);  // Empty dependency array ensures this effect runs once on component mount

  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Header />
      <main id="summaries">
        {items.map((item) => (
          <div key={item.title} className="card">
            <div className="wrapper">
              <div className="top">
                <h3>{item.title}</h3>
                <p className="summaryText">{item.summary}</p>
              </div>
              <div className="bottom">
                <a target="_blank" href={item.url}>
                  Full article
                </a>
              </div>
            </div>
          </div>
        ))}
      </main>
      <Footer />
    </>
  );
}
