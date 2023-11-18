/* eslint-disable react/jsx-no-target-blank */
import firebase from "./logic";
import { testDb } from "./firebase-test";
import { useEffect, useState } from "react";

function App() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    firebase
      .getCategoryQuery(testDb, "ai", null)
      .then((querySnapshot) =>
        querySnapshot.docs.map((doc) => doc.data().title)
      )
      .then((mapped) => setItems(mapped))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  if (error) return <p>Error: {error}</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <>
      <h1>Things</h1>
      {items.length > 0 ? (
        items.map((item, index) => <p key={index}>{item}</p>)
      ) : (
        <p>No items available</p>
      )}
    </>
  );
}

export default App;
