import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAES8iOsxtgQhNved5dltrilIt8X5fxHL0",
  authDomain: "the-aggregator-b51bd.firebaseapp.com",
  projectId: "the-aggregator-b51bd",
  storageBucket: "the-aggregator-b51bd.appspot.com",
  messagingSenderId: "280028868322",
  appId: "1:280028868322:web:f654a928da9628d6c378bb",
  measurementId: "G-408NCFQLCF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const db = getFirestore(app);

export { app, db };
