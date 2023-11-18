
const firebaseConfig = {
    apiKey: "AIzaSyB0CLDzjszZgzppgnMVbpiQ-AORyhhsci0",
    authDomain: "test123-326b8.firebaseapp.com",
    databaseURL: "https://test123-326b8-default-rtdb.firebaseio.com",
    projectId: "test123-326b8",
    storageBucket: "test123-326b8.appspot.com",
    messagingSenderId: "268644934542",
    appId: "1:268644934542:web:9996af49a8c45a19bb7adf",
    measurementId: "G-7XPMEPLHPY"
  };
  firebase.initializeApp(firebaseConfig);
  let auth = firebase.auth();
  const db = firebase.firestore();
  var storage = firebase.storage();
  