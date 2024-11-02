import firebase from 'firebase/app'; // doing import firebase from 'firebase' or import * as firebase from firebase is not good practice. 
import 'firebase/auth';
import 'firebase/firestore';

// Initialize Firebase
let config = {
    apiKey: "AIzaSyA8taAI0gvQyuwniwk07kbO6jnPxn-BldI",
    authDomain: "lfsharraiyabasti.firebaseapp.com",
    projectId: "lfsharraiyabasti",
    storageBucket: "lfsharraiyabasti.appspot.com",
    messagingSenderId: "1031819568389",
    appId: "1:1031819568389:web:fe3eaa464072c1d408836c",
    measurementId: "G-28DYYTQJ1B"
};
firebase.initializeApp(config);

const auth = firebase.auth();
const db = firebase.firestore();


export { auth, firebase, db };