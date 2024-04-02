import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


// const firebaseConfig = {
//     apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//     authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//     projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//     storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.REACT_APP_FIREBASE_APP_ID,
//     measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
// }
const firebaseConfig = {
    apiKey: "AIzaSyDF7j4koXxsKHKyUvur6_ejNeSctsppoeo",
    authDomain: "standom-dev-110d8.firebaseapp.com",
    projectId: "standom-dev-110d8",
    storageBucket: "standom-dev-110d8.appspot.com",
    messagingSenderId: "701751326319",
    appId: "1:701751326319:web:f9f9157d3067da89873f9a",
    measurementId: "G-W4YX6SG63X"
  };

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export default firebaseApp;

//web dev simplified does the auth export this way (in case this doesn't work)
// export const auth = app.auth();

