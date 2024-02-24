import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
  getFirestore,
  setDoc,
  doc
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyCBo4rA22PLRpg6G2QG4APSmzgSWP5m5QY",
    authDomain: "askhubblog-saylani.firebaseapp.com",
    projectId: "askhubblog-saylani",
    storageBucket: "askhubblog-saylani.appspot.com",
    messagingSenderId: "105873177907",
    appId: "1:105873177907:web:37210867a40871b488d246",
    measurementId: "G-52BGZE05RF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

document.addEventListener("DOMContentLoaded", () => {
  const SignUp = document.getElementById("SignUp");

  const signUpUser = async () => {
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const pass = document.getElementById("pass").value;
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const user = userCredential.user; 
  
      if (user) {
        const userId = user.uid;
      
        updateProfile(auth.currentUser, {
          displayName: name,
          photoURL: `https://ui-avatars.com/api/?name=${name[0]}`
        }).then(() => {
          console.log("Profile updated successfully.");
        }).catch((error) => {
          console.error("Error updating profile:", error);
        });
  
       

        // console.log("User object after profile update:", user);
  
        window.location.href = "signIn.html";
      } else {
        console.error("User object is null after sign-up.");
      }
    } catch (error) {
      Toastify({
        text: error.message,
        duration: 3000,
        gravity: "top",
        className: "toastify",
        backgroundColor: "red"
    }).showToast();
    }
  };

  SignUp.addEventListener("click", signUpUser);
});
let currentPath = window.location.pathname.split("/").pop();

console.log(window.location.pathname.split("/"))
const load = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log(user)
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
