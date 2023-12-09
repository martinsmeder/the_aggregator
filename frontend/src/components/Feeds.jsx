import { getFeedQueries } from "../javascript/database-logic";
import sortItems from "../javascript/utils";
import { testDb } from "../javascript/firebase-test";
import { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function Feeds() {
  // const [snapshot, setSnapshot] = useState([]);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeedQueries(testDb, "ai")
      .then((querySnapshot) => {
        return querySnapshot.docs.map((doc) => doc.data());
      })
      .then((mapped) => {
        const sortedItems = sortItems(mapped);
        console.log(sortedItems);
        setItems(sortedItems);
      })
      .catch((error) => setError(error));
    // .finally(() => setLoading(false));
  }, []);

  // function handleLoadClick(snapshot) {
  //   getCategoryQuery(testDb, "ai", snapshot)
  //     .then((querySnapshot) => {
  //       setSnapshot(querySnapshot);
  //       return querySnapshot.docs.map((doc) => doc.data().title);
  //     })
  //     .then((mapped) => {
  //       setItems((itemsCopy) => [...itemsCopy, ...mapped]);
  //     });
  // }

  if (error) return <p>Error: {error}</p>;
  // if (loading) return <p>Loading...</p>;
  return (
    <>
      <Header />
      <main id="feeds">
        {items.map((item) => (
          <div key={item.rssId} className="card">
            <div className="wrapper">
              <div className="top">
                <h3>{item.title}</h3>
              </div>
              <div className="bottom">
                <p>{item.published}</p>
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
