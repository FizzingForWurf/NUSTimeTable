import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  appId: process.env.FIREBASE_APP_ID,
  messagingSenderId: process.env.FIREBASE_SENDER_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID, // Optional
  authDomain: 'nustimetable.firebaseapp.com',
  projectId: 'nustimetable',
  storageBucket: 'nustimetable.appspot.com',
};

// Initialize Firebase
const FirebaseApp = initializeApp(firebaseConfig);
export default FirebaseApp;
