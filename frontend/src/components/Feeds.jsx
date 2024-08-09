/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-comment-textnodes */
import {
  getAllQueries,
  getCategoryQueries,
  getNews,
} from "../javascript/database-logic";
import {
  sortFeedItems,
  stripHtmlTags,
  getUniqueItems,
  getTimeDifference,
} from "../javascript/utils";
import { db } from "../javascript/firebase";
import { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function Feeds() {
  const [category, setCategory] = useState(null);
  const [isFixed, setIsFixed] = useState(false);
  const [snapshot, setSnapshot] = useState([]);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    function handleScroll() {
      // Get properties from document.documentElement
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;

      // Calculates the scroll percentage of the page.
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      // If user scrolled beyond 90% of the page, fetch more items
      if (scrollPercentage > 0.9) {
        fetchItems(snapshot, category);
      }

      // Add/remove fixed class based on scroll location
      if (scrollTop >= 150) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    }

    // Add event listener to window to track scrolling behavior
    window.addEventListener("scroll", handleScroll);
    // Remove event listener on component unmounts to avoid memory leaks
    return () => window.removeEventListener("scroll", handleScroll);
    // Re-run the effect whenever 'snapshot' or 'category' changes
  }, [snapshot, category]);

  useEffect(() => {
    // Get initial data
    // getAllQueries(db)
    getNews(db)
      .then((querySnapshot) => {
        // Set snapshot to enable fetching of new items on scroll
        setSnapshot(querySnapshot);
        // Get stored data from database query
        return querySnapshot.docs.map((doc) => doc.data());
      })
      .then((mapped) => {
        // Sort items and update state
        const sortedItems = sortFeedItems(mapped);
        setItems(sortedItems);
      })
      .catch((error) => setError(error));
  }, []);

  function fetchItems(snapshot, category) {
    if (category) {
      getCategoryQueries(db, category, snapshot)
        .then((querySnapshot) => {
          setSnapshot(querySnapshot);
          return querySnapshot.docs.map((doc) => doc.data());
        })
        .then((mapped) => {
          // Get unique items to avoid duplication, and update state
          let updatedItems = getUniqueItems(items, mapped);
          setItems(updatedItems);
        });
    } else {
      getAllQueries(db, snapshot)
        .then((querySnapshot) => {
          setSnapshot(querySnapshot);
          return querySnapshot.docs.map((doc) => doc.data());
        })
        .then((mapped) => {
          let updatedItems = getUniqueItems(items, mapped);
          setItems(updatedItems);
        });
    }
  }

  function handleCategoryClick(category) {
    setItems([]);
    setCategory(category);
    setActiveCategory(category);
    setSnapshot([]);

    if (category) {
      getCategoryQueries(db, category)
        .then((querySnapshot) => {
          setSnapshot(querySnapshot);
          return querySnapshot.docs.map((doc) => doc.data());
        })
        .then((mapped) => {
          setItems(mapped);
        });
    } else {
      getAllQueries(db)
        .then((querySnapshot) => {
          setSnapshot(querySnapshot);
          return querySnapshot.docs.map((doc) => doc.data());
        })
        .then((mapped) => {
          setItems(mapped);
        });
    }
  }

  if (error) return <p>Error: {error}</p>;
  return (
    <>
      <Header />
      <main id="feeds">
        {/* <div className={isFixed ? "categories fixed" : "categories"}>
          <button
            className={activeCategory === "ai" ? "active" : ""}
            onClick={() => handleCategoryClick("ai")}
          >
            AI
          </button>
          <button
            className={activeCategory === "science" ? "active" : ""}
            onClick={() => handleCategoryClick("science")}
          >
            Science
          </button>
          <button
            className={activeCategory === "gaming" ? "active" : ""}
            onClick={() => handleCategoryClick("gaming")}
          >
            Gaming
          </button>
          <button
            className={!activeCategory ? "active" : ""}
            onClick={() => handleCategoryClick(null)}
          >
            All
          </button>
        </div> */}
        {items.map((item) => (
          <div key={item.url} className="card">
            <div className="wrapper">
              <div className="top">
                <h3>{item.title}</h3>
                {/* <p>{stripHtmlTags(item.description)}</p> */}
              </div>

              <hr />
              <div className="bottom">
                <p>
                  {item.source} // {getTimeDifference(item.published)}
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
