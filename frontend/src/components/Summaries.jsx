/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-target-blank */
import { getSingleQuery } from "../javascript/database-logic";
import { testDb } from "../javascript/firebase-test";
import { useEffect, useState } from "react";
import Header from "./Header";

export default function Summaries() {
  // const [snapshot, setSnapshot] = useState([]);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSingleQuery(testDb, "summaries")
      .then((querySnapshot) => {
        // setSnapshot(querySnapshot);
        return querySnapshot.docs.map((doc) => doc.data().summary);
      })
      .then((mapped) => setItems(mapped))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
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
      <main>
        <h1>Things</h1>
        {items.length > 0 ? (
          items.map((item) => <p key={item}>{item}</p>)
        ) : (
          <p>No items available</p>
        )}
      </main>
    </>
  );
}
