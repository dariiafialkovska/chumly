import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyARddaJ_Fl1ZNiXkJAgeNcnSM9EEG5pESw",
  authDomain: "chum-ly.firebaseapp.com",
  projectId: "chum-ly",
  storageBucket: "chum-ly.firebasestorage.app",
  messagingSenderId: "805472140179",
  appId: "1:805472140179:web:98db385eb369e7b95c4666",
  measurementId: "G-R8WVJS9Z6X"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);