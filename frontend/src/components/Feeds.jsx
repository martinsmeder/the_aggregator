import Header from "./Header";
import Footer from "./Footer";

export default function Feeds() {
  // const [snapshot, setSnapshot] = useState([]);
  return (
    <>
      <Header />
      <main>{/* <h1>FEEDS</h1> */}</main>
      <Footer />
    </>
  );
}

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
