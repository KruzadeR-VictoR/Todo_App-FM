// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOR-6INsUwu9198bztTWPuiYRbj9-63R8",
  authDomain: "todonextapp-6df57.firebaseapp.com",
  projectId: "todonextapp-6df57",
  storageBucket: "todonextapp-6df57.appspot.com",
  messagingSenderId: "301502237924",
  appId: "1:301502237924:web:c0f5fa6c8c340df5b270f1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore(app)