import {
  // getCategoryQueries,
  getAllQueries,
  getCategoryQueries,
} from "../javascript/database-logic";
import sortItems from "../javascript/utils";
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

  function handleLoadClick(snapshot, category) {
    if (category) {
      getCategoryQueries(testDb, category, snapshot)
        .then((querySnapshot) => {
          setSnapshot(querySnapshot);
          return querySnapshot.docs.map((doc) => doc.data());
        })
        .then((mapped) => {
          setItems((itemsCopy) => [...itemsCopy, ...mapped]);
        });
    } else {
      getAllQueries(testDb, snapshot)
        .then((querySnapshot) => {
          setSnapshot(querySnapshot);
          return querySnapshot.docs.map((doc) => doc.data());
        })
        .then((mapped) => {
          setItems((itemsCopy) => [...itemsCopy, ...mapped]);
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
            <h3>{item.title}</h3>
            <p>
              {item.source} - {item.published}
            </p>
            {/* {item.isReddit ? (
              <p>No description available</p>
            ) : (
              <p> {item.description} </p>
            )} */}
            <a target="_blank" href={item.url} rel="noreferrer">
              Full article
            </a>
          </div>
        ))}
        <button onClick={() => handleLoadClick(snapshot, category)}>
          Load more
        </button>
      </main>
      <Footer />
    </>
  );
}
