import { initializeApp } from 'firebase/app';
import { initializeFirestore, memoryLocalCache } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBuVjykdvsqxHdgvbJtr0-9CPpwanWDkKA",
  authDomain: "velvetrose-a933c.firebaseapp.com",
  projectId: "velvetrose-a933c",
  storageBucket: "velvetrose-a933c.firebasestorage.app",
  messagingSenderId: "1059560705009",
  appId: "1:1059560705009:web:4349f233426098cf409250"
};

const app = initializeApp(firebaseConfig);

// IndexedDB önbelleğini KAPAT — silinmiş ürünlerin önbellekten geri gelmesini önler
// memoryLocalCache: sadece bellekte tutar, sekme kapanınca temizlenir
// ignoreUndefinedProperties: undefined alanlar yüzünden setDoc'un çökmesini önler
export const db = initializeFirestore(app, {
  localCache: memoryLocalCache(),
  ignoreUndefinedProperties: true
});
