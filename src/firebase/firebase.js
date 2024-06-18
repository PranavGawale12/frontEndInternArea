// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth,GoogleAuthProvider,PhoneAuthProvider} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD8QRRdp4yZxlHAApmDgCVCWLe9xqjrmQc",
  authDomain: "interarea-44930.firebaseapp.com",
  projectId: "interarea-44930",
  storageBucket: "interarea-44930.appspot.com",
  messagingSenderId: "1093588106203",
  appId: "1:1093588106203:web:138792bcc698f31c0385fe",
  measurementId: "G-C88LRP1J1L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app);
const provider=new GoogleAuthProvider();
const phoneProvider=new PhoneAuthProvider();
export {auth,provider,phoneProvider}