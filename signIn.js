import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    FacebookAuthProvider,
    signInWithEmailAndPassword
    
    
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCBo4rA22PLRpg6G2QG4APSmzgSWP5m5QY",
    authDomain: "askhubblog-saylani.firebaseapp.com",
    projectId: "askhubblog-saylani",
    storageBucket: "askhubblog-saylani.appspot.com",
    messagingSenderId: "105873177907",
    appId: "1:105873177907:web:37210867a40871b488d246",
    measurementId: "G-52BGZE05RF"
};

const app = initializeApp(firebaseConfig)

// const db = getFirestore(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const provider1 = new FacebookAuthProvider();


const  login = document.getElementById("login")
const facebook= document.getElementById("facebook")
const signIN= document.getElementById("signIN")


const loginUser = async () => {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("pass").value;

  try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      console.log("User logged in successfully:", userCredential);
      window.location.href = "index.html";
  } catch (error) {
      console.log("Error logging in:", error.message);
      Toastify({
          text: error.message,
          duration: 3000,
          gravity: "top",
          className: "toastify",
          backgroundColor: "red"
      }).showToast();
  }
};
  let currentPath = window.location.pathname.split("/").pop();

console.log(window.location.pathname.split("/"))
const load = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (currentPath !== "index.html" ) {
        window.location.href = "index.html";
      }
    } else {
      if (currentPath !== "signIn.html" && currentPath !== "signUp.html") {
        window.location.href = "signIn.html";
      }
    }
  });
};
load();


let signInWithGoogle = () => {
    // console.log("ok")
  
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result)
      }).catch((error) => {
        console.log(error)
  
      });
  
  
  }
  const withFacebook=()=>{
   
signInWithPopup(auth, provider1)
  .then((result) => {
    // The signed-in user info.
    const user = result.user;

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const accessToken = credential.accessToken;
window.location.href="index.html"
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = FacebookAuthProvider.credentialFromError(error);
    

    // ...
  });



  }

const signINDirect=()=>{
  window.location.href="signUp."
}

  signIN && signIN.addEventListener("click" ,signINDirect)
  facebook && facebook.addEventListener("click" ,withFacebook)
  login && login.addEventListener("click", loginUser)
  withGoogle && withGoogle.addEventListener("click", signInWithGoogle)