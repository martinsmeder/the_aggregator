const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: process.env.FIREBASE_TEST_API_KEY,
  authDomain: "the-aggregator-test.firebaseapp.com",
  projectId: "the-aggregator-test",
  storageBucket: "the-aggregator-test.appspot.com",
  messagingSenderId: "935577100983",
  appId: "1:935577100983:web:6aba1d3741f773010ce332",
};

const testApp = initializeApp(firebaseConfig);
const testDb = getFirestore(testApp);

module.exports = { testApp, testDb };
