// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import firebase from 'firebase/app';

// Add the Firebase services that you want to use
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage'; 

const firebaseConfig = {
	apiKey: "AIzaSyBp-cfICZsCY5cMWvKsR5tV_6kx2K_h7hI",
	authDomain: "jin-mountain-sn.firebaseapp.com",
	databaseURL: "https://jin-mountain-sn.firebaseio.com",
	projectId: "jin-mountain-sn",
	storageBucket: "jin-mountain-sn.appspot.com",
	messagingSenderId: "1050344909517",
	appId: "1:1050344909517:web:42078b65b268a9c2bb5784"
};

const Firebase = firebase.initializeApp(firebaseConfig);

export default Firebase;