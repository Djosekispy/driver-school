// src/firebase/firebase.ts (ou onde você quiser)

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAtLq80MuX937AbGJQw82_qwbwXsmVduCI",
  authDomain: "sorteio-13df5.firebaseapp.com",
  databaseURL: "https://sorteio-13df5-default-rtdb.firebaseio.com",
  projectId: "sorteio-13df5",
  storageBucket: "sorteio-13df5.appspot.com",
  messagingSenderId: "517479363665",
  appId: "1:517479363665:web:c3f1c2b3945f4848507470"
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

