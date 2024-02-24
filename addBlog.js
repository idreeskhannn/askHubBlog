import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  query,
  collection,
  updateDoc,
  getDoc

} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import {
  onAuthStateChanged,
  getAuth,
  signOut
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL
}
  from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";


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

const db = getFirestore(app);
const auth = getAuth();
const storage = getStorage(app);



// console.log(db)

let addBlog = document.getElementById("addBlog")
let logOut = document.getElementById("logOut")
let home = document.getElementById("home")



const adBlog = async () => {
  addBlog.disabled = true;
  let checkedRadio = document.querySelector('input[name="radio-10"]:checked');
  let checkedRadio2 = document.querySelector('input[name="radio-1"]:checked');
  let blogInp = document.getElementById("blogInp").value.trim();
  let selectInp = document.getElementById("selectInp").value.trim();
  let txtArea = document.getElementById("txtArea").value.trim();
  let img = document.getElementById("img")
  // let imgUrl=""
  const user = auth.currentUser;

  const id = user.uid

  let emptyFields = [];
  if (!checkedRadio) emptyFields.push("Radio Option 1");
  if (!checkedRadio2) emptyFields.push("Radio Option 2");
  if (!blogInp) emptyFields.push("Blog Title");
  if (selectInp === "Select Category") emptyFields.push("Select Option");
  if (!txtArea) emptyFields.push("Text Area");
  if (!img.value) emptyFields.push("Image");

  if (emptyFields.length > 0) {
    const message = `Please fill in the following fields: ${emptyFields.join(", ")}`;
    Toastify({
      text: message,
      duration: 3000,
      gravity: "top",
      close: true
    }).showToast();
    addBlog.disabled = false;

    return;
  }
  const uploadBlog = () => {
    const fileValue = img.files[0]
    if (fileValue) {
      uploadImage()
    } else {

    }
  }
  const uploadMsgDB = () => {

  }


  const fileValue = img.files[0]

  console.log(fileValue, "fileValue")


  const metadata = {
    contentType: fileValue.type,
    name: fileValue.name,
    size: fileValue.size
  };

  const storageRef = ref(storage, `images/${fileValue.name}_${Date.now()}`);
  const uploadTask = uploadBytesResumable(storageRef, fileValue, metadata);

  uploadTask.on('state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
      }
    },
    (error) => {
      switch (error.code) {
        case 'storage/unauthorized':
          break;
        case 'storage/canceled':
          break;

        // ...

        case 'storage/unknown':
          break;
      }
    },
    async () => {
      try {

        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log("Download URL:", downloadURL);
        const timestamp = new Date().getTime();
       const postDate = new Date().toString().slice(4, 15);
        
        

        const payload = {
          userName: user.displayName,
          id: user.uid,
          postDate,
          checkedRadio: checkedRadio.value,
          checkedRadio2: checkedRadio2.value,
          blogInp,
          selectInp,
          txtArea,
          downloadURL: downloadURL
        };

        try {
          await setDoc(doc(db, "posts", `${timestamp}`), payload);
          document.getElementById("blogInp").value = "";
          document.getElementById("selectInp").value = "";
          document.getElementById("txtArea").value = "";
          document.querySelectorAll('input[name="radio-10"]').forEach(radio => radio.checked = false);
          document.querySelectorAll('input[name="radio-1"]').forEach(radio => radio.checked = false);
          document.getElementById("img").value = "";

          Toastify({
            text: "Post uploaded",
            duration: 3000,
            gravity: "center",
            close: true,
          }).showToast();
          addBlog.disabled = false;
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      } catch (error) {
        console.error("Error getting download URL: ", error);
      }
    }

  );

  // try {
  //     // Reference the document in the "users" collection using the user's ID
  //     const userRef = doc(db, "users", userId);
  //     // Update the document with the payload data
  //     await setDoc(userRef, payload, { merge: true }); // Use merge: true to merge new data with existing data
  //     console.log("Document updated successfully.");
  // } catch (e) {
  //     console.error("Error updating document: ", e);
  // }
  // try {
  //     // Check if a user is currently authenticated
  //     const user = auth.currentUser;
  //     if (user) {
  //         const userId = user.uid; // Get the current user's ID
  //         const timestamp = new Date().getTime();
  //         const payload = {
  //             id: timestamp,
  //             checkedRadio,
  //             checkedRadio2,
  //             blogInp,
  //             selectInp,
  //             txtArea,
  //         };

  //         // Reference the document in the "users" collection using the user's ID
  //         const userRef = doc(db, "users", userId);
  //         // Update the document with the payload data
  //         await setDoc(userRef, payload, { merge: true }); // Use merge: true to merge new data with existing data
  //         console.log("Document updated successfully.");
  //     } else {
  //         console.error("No user is currently authenticated.");
  //     }
  // } catch (e) {
  //     console.error("Error updating document: ", e);
  // }


  // console.log(txtArea)
}
let currentPath = window.location.pathname.split("/").pop();

const load = () => {

  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (currentPath !== "addBlog.html") {
        window.location.href = "addBlog.html";
      }
    } else {
      if (currentPath !== "index.html" && currentPath !== "index.html") {
        window.location.href = "index.html";
      }
    }
  });
};
load();
const logOutBtn = () => {
  // console.log("okkkkk")
  signOut(auth)
      .then(() => {
          console.log("User signed out");
          window.location.reload();
          alert("user logOut")
          
      })
      .catch((error) => {
          console.error("Sign out error:", error);
      });

}
const homeRed=()=>{
  window.location.href="index.html"
  console.log("pk")
}
home && home.addEventListener("click", homeRed)
logOut && logOut.addEventListener("click", logOutBtn)

addBlog.addEventListener("click", adBlog)