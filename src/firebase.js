import firebase from "firebase/compat/app";
// import App from "../App"

import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

let {object} = require("./Components/secret.js");

firebase.initializeApp(object);
// it is going to connect object you made and firebase each project has unique in the onnject 

const auth = firebase.auth();
const firestore=firebase.firestore();
// ismein jo collection usmien bhut saare honge right usko hm name se identify krenge we have differnt ids for different doc in a collection  in a particular collection doc mein you will lot of stuff if you want to have to data then you get data 
// you are getting refernce to the authenication service provided by firebase and the  methods of authentication can be called directly using this variable
export default auth;
export const database={
    users:firestore.collection("users"),
    posts:firestore.collection("posts"),
    getUserTimeStamp: firebase.firestore.FieldValue.serverTimestamp
}

export const storage=firebase.storage();