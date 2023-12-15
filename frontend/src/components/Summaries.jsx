/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-target-blank */
import { getSingleQuery } from "../javascript/database-logic";
import { sortFeedItems } from "../javascript/utils";
import { testDb } from "../javascript/firebase-test";
import { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function Summaries() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getSingleQuery(testDb, "summaries")
      .then((querySnapshot) => {
        return querySnapshot.docs.map((doc) => doc.data());
      })
      .then((mapped) => {
        const sortedItems = sortFeedItems(mapped);
        setItems(sortedItems);
      })
      .catch((error) => setError(error));
  }, []);

  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Header />
      <main id="summaries">
        {items.map((item) => (
          <div key={item.rssId} className="card">
            <img src={item.image} alt={item.title} />
            <div className="wrapper">
              <div className="top">
                <h3>{item.title}</h3>
                <p className="summaryText">{item.summary}</p>
              </div>
              <div className="bottom">
                <p>{item.published}</p>
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
