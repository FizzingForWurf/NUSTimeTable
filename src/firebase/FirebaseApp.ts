import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: JSON.stringify(process.env.FIREBASE_API_KEY),
  appId: JSON.stringify(process.env.FIREBASE_APP_ID),
  messagingSenderId: JSON.stringify(process.env.FIREBASE_SENDER_ID),
  measurementId: JSON.stringify(process.env.FIREBASE_MEASUREMENT_ID), // Optional
  authDomain: 'nustimetable.firebaseapp.com',
  projectId: 'nustimetable',
  storageBucket: 'nustimetable.appspot.com',
};

// Initialize Firebase
const FirebaseApp = initializeApp(firebaseConfig);
export default FirebaseApp;
