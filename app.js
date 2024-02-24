// alert("hello world")

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
    getFirestore,
    doc,
    setDoc,
    query,
    onSnapshot,
    collection


} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import {
    onAuthStateChanged,
    getAuth,
    signOut
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

const db = getFirestore(app);
const auth = getAuth();


let addBlogsBtn = document.getElementById("addBlogsBtn")
let addPost = document.getElementById("addPost")
let login = document.getElementById("login")
let logOut = document.getElementById("logOut")
let move = document.getElementById("move")
let searchInp = document.getElementById("searchInp")



const print = async () => {
    const q = query(collection(db, "posts"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let list = ""
        querySnapshot.forEach((doc) => {
            const val = doc.data();
            list += `
        <div class="w-8/12 border mt-10 flex items-center justify-around border-orange-200 rounded-lg p-3">
        <div class=" w-[78%]">
            <div class=" w-full h text-2xl bg-slate-50 rounded-lg flex justify-between p-1">
                <h3 id="titleTxt">${val.blogInp}</h3>
                <h5 id="titleTxt" class="text-amber-600	text-lg">${val.checkedRadio}</h5>
                
            </div>
            <div class=" my-1 w-[90%]">
                <p id="descTxt" class=" w-[100%] p-2 overflow-auto ">${val.txtArea}</p>
                ${auth.currentUser ? `<a href="userPost.html?id=${doc.id}" id="move">See more</a>` : `<a href="signIn.html" id="move">See more</a>`}

                
            </div>
            <div class=" flex justify-between">
                <div class="flex items-center p-1  justify-center bg-slate-50 rounded-xl"><i class="fa-solid fa-user mr-3"></i> <p>${val.userName}</p></div>
                <div class=" w-[20%] flex items-center justify-center bg-slate-50 rounded-xl"><p>${val.postDate}</p></div>
            </div>
        </div>
        <div class=" w-[18%]  flex items-center">
            <h1 class="border w-[190%] rounded-lg">
                <img src=${val.downloadURL} class="w-[100%] h-[170px] rounded-lg" alt="">
            </h1>
        </div>
    </div>
        `;
        });
        addPost.innerHTML = list;
    });




};
print();
const searchPosts = async (searchQuery) => {
    console.log(searchQuery)
    const q = query(collection(db, "posts"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let list = "";
        querySnapshot.forEach((doc) => {
            const val = doc.data();
            if (val.blogInp.toLowerCase().includes(searchQuery.toLowerCase()) || val.txtArea.toLowerCase().includes(searchQuery.toLowerCase()) || val.userName.toLowerCase().includes(searchQuery.toLowerCase())) {
                list += `
                    <div class="w-8/12 h-[200px] border mt-10 flex items-center justify-around border-orange-200 rounded-lg">
                        <div class=" w-[78%] h-[180px] ">
                            <div class=" w-full h-[40px] text-2xl bg-slate-50 rounded-lg flex justify-between p-1">
                                <h3 id="titleTxt">${val.blogInp}</h3>
                                <h5 id="titleTxt" class="text-amber-600	text-lg">${val.checkedRadio}</h5>
                            </div>
                            <div class=" h-[100px] my-1 w-[90%]">
                                <p id="descTxt" class=" w-[100%] p-2 overflow-auto ">${val.txtArea}</p>
                                ${auth.currentUser ? `<a href="userPost.html?id=${doc.id}" id="move">See more</a>` : `<a href="signIn.html" id="move">See more</a>`}
                            </div>
                            <div class=" flex justify-between">
                                <div class="flex items-center p-1 h-[30px] justify-center bg-slate-50 rounded-xl"><i class="fa-solid fa-user mr-3"></i> <p>${val.userName}</p></div>
                                <div class=" w-[20%] flex items-center justify-center bg-slate-50 rounded-xl"><p>${val.postDate}</p></div>
                            </div>
                        </div>
                        <div class=" w-[18%] h-[180px] flex items-center">
                            <h1 class="border w-[190%] h-[170px] rounded-lg">
                                <img src=${val.downloadURL} class="w-[100%] h-[170px] rounded-lg" alt="">
                            </h1>
                        </div>
                    </div>
                `;
            }
            else {
                list = `
               
               
         <div class="w-8/12 h-[200px] mt-10 flex items-center justify-around ">
               <div class=" w-[78%] h-[180px] ">
                   <div class=" w-full h-[40px] text-2xl bg-slate-50 rounded-lg flex justify-between p-1">
                       <h3 id="titleTxt" class="text-[red]">Not Found</h3>
                       <h5 id="titleTxt" class="text-amber-600	text-lg"></h5>
                   </div>
                   
               </div>
               
            </div>
               
               
               `
            }
        });
        addPost.innerHTML = list;
    });
};

searchInp && searchInp.addEventListener('input', (e) => {
    console.log(e)
    const searchQuery = e.target.value.trim();
    if (searchQuery.length > 0) {
        searchPosts(searchQuery);
    } else {
        print();
    }
});




// console.log(window.location.pathname.split("/"))
const load = () => {
    onAuthStateChanged(auth, (user) => {



        if (user) {
            addBlogsBtn.style.display = "block"
            logOut.style.display = "block"
            login.style.display = "none"


        } else {
            logOut.style.display = "none"

            addBlogsBtn.style.display = "none"


        }

        //   if (user) {

        //     addBlogsBtn.style.display="block"
        //   } else {
        //     addBlogsBtn.style.display="none"

        //   }
    });
};
load();



const addBlogsFunc = () => {
    window.location.href = "addBlog.html"

}
const logIn = () => {
    window.location.href = "signIn.html"
}
const logOutBtn = () => {
    // console.log("okkkkk")
    signOut(auth)
        .then(() => {
            console.log("User signed out");
            window.location.reload();
        })
        .catch((error) => {
            console.error("Sign out error:", error);
        });

}
const moveToPost = () => {
    // window.location.href="userPost"
    console.log(user)

}

// addPost.addEventListener("click" ,moveToPost)
login && login.addEventListener("click", logIn)
addBlogsBtn && addBlogsBtn.addEventListener("click", addBlogsFunc)
logOut && logOut.addEventListener("click", logOutBtn)
