/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-comment-textnodes */
import {
  getSingleQuery,
} from "../javascript/database-logic";
import {
  sortItems,
  getTimeDifference,
} from "../javascript/utils";
import { db } from "../javascript/firebase";
import { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function News() {
  const [items, setItems] = useState([]);  // State to store fetched items
  const [error, setError] = useState(null);  // State to store any error

  useEffect(() => {
    // Fetch data from "news" collection
    getSingleQuery(db, "news")
      .then((querySnapshot) => {
        // Map documents to an array of items
        return querySnapshot.docs.map((doc) => doc.data());
      })
      .then((mapped) => {
        // Sort the mapped items and update state
        const sortedItems = sortItems(mapped);
        setItems(sortedItems);
      })
      .catch((error) => setError(error));  // Catch and store any errors
  }, []);  // Empty dependency array to run the effect only once on component mount

  if (error) return <p>Error: {error}</p>;
  return (
    <>
      <Header />
      <main id="news">
        {items.map((item) => (
          <div key={item.url} className="card">
            <div className="wrapper">
              <div className="top">
                <h3>{item.title}</h3>
              </div>

              <hr />
              <div className="bottom">
                <p>
                  {getTimeDifference(item.published)}
                </p>

                <a target="_blank" href={item.url} rel="noreferrer">
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
