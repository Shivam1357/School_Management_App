import { initializeApp} from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';


// Optionally import the services that you want to use
//import {...} from "firebase/auth";
//import {...} from "firebase/database";
//import {...} from "firebase/firestore";
//import {...} from "firebase/functions";
//import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA8taAI0gvQyuwniwk07kbO6jnPxn-BldI",
    authDomain: "lfsharraiyabasti.firebaseapp.com",
    projectId: "lfsharraiyabasti",
    storageBucket: "lfsharraiyabasti.appspot.com",
    messagingSenderId: "1031819568389",
    appId: "1:1031819568389:web:11dff5316569c9f408836c",
    measurementId: "G-7EPKX9YHHH"
};

initializeApp(firebaseConfig);
const firestore = getFirestore();
const auth = getAuth();


export {firestore,auth}