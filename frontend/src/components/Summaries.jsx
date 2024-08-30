/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-target-blank */
import { getSingleQuery } from "../javascript/database-logic";
import { sortItems } from "../javascript/utils";
import { db } from "../javascript/firebase";
import { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function Summaries() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getSingleQuery(db, "summaries")
      .then((querySnapshot) => {
        return querySnapshot.docs.map((doc) => doc.data());
      })
      .then((mapped) => {
        const sortedItems = sortItems(mapped);
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
          <div key={item.title} className="card">
            <div className="wrapper">
              <div className="top">
                <h3>{item.title}</h3>
                <p className="summaryText">{item.summary}</p>
              </div>
            </div>
          </div>
        ))}
      </main>
      <Footer />
    </>
  );
}
