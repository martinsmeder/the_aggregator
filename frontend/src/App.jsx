/* eslint-disable react/jsx-no-target-blank */
import firebase from "./logic";
import { testDb } from "./firebase-test";
import { useEffect, useState } from "react";

function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    firebase
      .getCategoryQuery(testDb, "ai", null)
      .then((querySnapshot) =>
        querySnapshot.docs.map((doc) => doc.data().title)
      )
      .then((mapped) => setItems(mapped))
      .catch((error) => {
        console.error("Error fetching data:", error);
        setItems([]);
      });
  }, []);

  return (
    <>
      <h1>Things</h1>
      {Array.isArray(items) && items.length > 0 ? (
        items.map((item, index) => <p key={index}>{item}</p>)
      ) : (
        <p>No items available</p>
      )}
    </>
  );
}

export default App;
