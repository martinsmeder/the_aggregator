import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  query,
  orderBy,
  where,
  deleteDoc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
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

export {
  app,
  db,
  collection,
  doc,
  addDoc,
  where,
  deleteDoc,
  query,
  orderBy,
  getDoc,
  getDocs,
  setDoc,
};
