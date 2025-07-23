
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, initializeAuth, getReactNativePersistence} from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyD4m7CXbe7Gk1eULVX7jXgAkn3KOS8zEGc",
  authDomain: "sikola-6e3ec.firebaseapp.com",
  projectId: "sikola-6e3ec",
  storageBucket: "sikola-6e3ec.appspot.com",
  messagingSenderId: "196378007285",
  appId: "1:196378007285:web:1ba362b2ae5565d84717bc",
  measurementId: "G-PGH6DQHBB0"
};

// Initialize Firebase
const App = initializeApp(firebaseConfig);

export const auth = initializeAuth(App, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
})

export const db = getFirestore(App);
//export const auth = getAuth(App);