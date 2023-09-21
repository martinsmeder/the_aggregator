const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: process.env.FIREBASE_TEST_API_KEY,
  authDomain: "the-aggregator-b51bd.firebaseapp.com",
  projectId: "the-aggregator-b51bd",
  storageBucket: "the-aggregator-b51bd.appspot.com",
  messagingSenderId: "280028868322",
  appId: "1:280028868322:web:f654a928da9628d6c378bb",
  measurementId: "G-408NCFQLCF",
};

const testApp = initializeApp(firebaseConfig);
const testDb = getFirestore(testApp);

module.exports = { testApp, testDb };
