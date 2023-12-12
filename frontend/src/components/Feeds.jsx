/* eslint-disable react/jsx-no-comment-textnodes */
import {
  // getCategoryQueries,
  getAllQueries,
  getCategoryQueries,
} from "../javascript/database-logic";
import {
  sortItems,
  stripHtmlTags,
  getUniqueItems,
  getTimeDifference,
} from "../javascript/utils";
import { testDb } from "../javascript/firebase-test";
import { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function Feeds() {
  const [category, setCategory] = useState(null);
  const [snapshot, setSnapshot] = useState([]);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    function handleScroll() {
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;

      if (scrollTop + clientHeight >= scrollHeight - 5) {
        fetchItems(snapshot, category);
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshot, category]);

  useEffect(() => {
    getAllQueries(testDb)
      .then((querySnapshot) => {
        setSnapshot(querySnapshot);
        return querySnapshot.docs.map((doc) => doc.data());
      })
      .then((mapped) => {
        const sortedItems = sortItems(mapped);
        setItems(sortedItems);
      })
      .catch((error) => setError(error));
    // .finally(() => setLoading(false));
  }, []);

  function fetchItems(snapshot, category) {
    if (category) {
      getCategoryQueries(testDb, category, snapshot)
        .then((querySnapshot) => {
          setSnapshot(querySnapshot);
          return querySnapshot.docs.map((doc) => doc.data());
        })
        .then((mapped) => {
          let updatedItems = getUniqueItems(items, mapped);
          setItems(updatedItems);
        });
    } else {
      getAllQueries(testDb, snapshot)
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
    if (category) {
      getCategoryQueries(testDb, category)
        .then((querySnapshot) => {
          setSnapshot(querySnapshot);
          return querySnapshot.docs.map((doc) => doc.data());
        })
        .then((mapped) => {
          setItems((itemsCopy) => [...itemsCopy, ...mapped]);
        });
    } else {
      getAllQueries(testDb)
        .then((querySnapshot) => {
          setSnapshot(querySnapshot);
          return querySnapshot.docs.map((doc) => doc.data());
        })
        .then((mapped) => {
          setItems((itemsCopy) => [...itemsCopy, ...mapped]);
        });
    }
  }

  if (error) return <p>Error: {error}</p>;
  // if (loading) return <p>Loading...</p>;
  return (
    <>
      <Header />
      <main id="feeds">
        <div className="categories">
          <button onClick={() => handleCategoryClick("ai")}>AI</button>
          <button onClick={() => handleCategoryClick("science")}>
            Science
          </button>
          <button onClick={() => handleCategoryClick("gaming")}>Gaming</button>
          <button onClick={() => handleCategoryClick(null)}>All</button>
        </div>
        {items.map((item) => (
          <div key={item.rssId} className="card">
            <div className="wrapper">
              <h3>{item.title}</h3>
              <p>{stripHtmlTags(item.description)}</p>
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
