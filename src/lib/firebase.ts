import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBuVjykdvsqxHdgvbJtr0-9CPpwanWDkKA",
  authDomain: "velvetrose-a933c.firebaseapp.com",
  projectId: "velvetrose-a933c",
  storageBucket: "velvetrose-a933c.firebasestorage.app",
  messagingSenderId: "1059560705009",
  appId: "1:1059560705009:web:4349f233426098cf409250"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
