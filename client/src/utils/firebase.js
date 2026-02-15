// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "examnotesai-7df05.firebaseapp.com",
  projectId: "examnotesai-7df05",
  storageBucket: "examnotesai-7df05.firebasestorage.app",
  messagingSenderId: "6889578664",
  appId: "1:6889578664:web:84576e24a1f70ad0e3e29d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };