// src/firebase/firebase.ts (ou onde você quiser)

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD4m7CXbe7Gk1eULVX7jXgAkn3KOS8zEGc",
  authDomain: "sikola-6e3ec.firebaseapp.com",
  projectId: "sikola-6e3ec",
  storageBucket: "sikola-6e3ec.appspot.com",
  messagingSenderId: "196378007285",
  appId: "1:196378007285:web:1ba362b2ae5565d84717bc",
  measurementId: "G-PGH6DQHBB0"

};

// Inicializar App Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth com persistência no React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Firestore
const db = getFirestore(app);
const storage = getStorage(app)
export { app , db, auth, storage};


