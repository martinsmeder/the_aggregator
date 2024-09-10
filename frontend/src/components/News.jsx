/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-comment-textnodes */
import {
  getAllQueries,
  // getContent,
} from "../javascript/database-logic";
import {
  sortItems,
  getUniqueItems,
  getTimeDifference,
} from "../javascript/utils";
import { db } from "../javascript/firebase";
import { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function News() {
  const [snapshot, setSnapshot] = useState([]);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    function handleScroll() {
      // Get properties from document.documentElement
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;

      // Calculates the scroll percentage of the page.
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      // If user scrolled beyond 90% of the page, fetch more items
      if (scrollPercentage > 0.9) {
        fetchItems(snapshot, "news");
      }
    }

    // Add event listener to window to track scrolling behavior
    window.addEventListener("scroll", handleScroll);
    // Remove event listener on component unmounts to avoid memory leaks
    return () => window.removeEventListener("scroll", handleScroll);
    // Re-run the effect whenever 'snapshot'
  }, [snapshot]);

  useEffect(() => {
    // Get initial data
    getAllQueries(db, "news")
      .then((querySnapshot) => {
        // Set snapshot to enable fetching of new items on scroll
        setSnapshot(querySnapshot);
        // Get stored data from database query
        return querySnapshot.docs.map((doc) => doc.data());
      })
      .then((mapped) => {
        // Sort items and update state
        const sortedItems = sortItems(mapped);
        setItems(sortedItems);
      })
      .catch((error) => setError(error));
  }, []);

  function fetchItems(snapshot, collectionName) {
    getAllQueries(db, collectionName, snapshot)
      .then((querySnapshot) => {
        setSnapshot(querySnapshot);
        return querySnapshot.docs.map((doc) => doc.data());
      })
      .then((newItems) => {
        setItems((prevItems) => {
          const updatedItems = getUniqueItems(prevItems, newItems);
          return updatedItems;
        });
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  }

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
