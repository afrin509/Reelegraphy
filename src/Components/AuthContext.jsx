// rfce

// import { children } from 'cheerio/lib/api/traversing';
// import react, {  useState,useEffect } from 'react'
// import auth from "../component/firebase";
// export const AuthContext=react.createContext();

// function AuthProvider({children}) {
//     const [CurrentUser,setUser]=useState(null);
//     const [loading,setLoader]=useState(false);
//     async function login(email,password)
//     {
//         let res= await auth.signInWithEmailAndPassword(email,password);
//         console.log("res",res)
//         return res;
//     }
//     async function signout()
//     {
//        return await auth.signOut();
//     }
//     useEffect(() => {
//         auth.onAuthStateChanged(user=>{
//            setUser(user);
//            console.log("useeffect",CurrentUser)
//       })
       
//     }, [CurrentUser])
//     const value={
//         login,signout,CurrentUser
//     }
//     return (
//             <AuthContext.Provider value={value} 
//             >
//                 {!loading&&children}
//             </AuthContext.Provider>
//         )
// }

// export default AuthProvider
import React, { useState, useEffect,useContext } from 'react';
import auth from "./firebase";

export const AuthContext = React.createContext();
export default function AuthProvider({ children }) {
    const [currentUser, setUser] = useState();
    const [loading, setLoading] = useState(false);
    async function login(email, password) {
        // firebase
        let res= await auth.signInWithEmailAndPassword(email, password);
        console.log("login loki vachanu",res)

         return res;

    }
    async function signup(email, password) {
        // firebase
        await auth.createUserWithEmailAndPassword(email, password)
//   this will allow user detila to go to authentication from the frontend
    }
    async function signOut() {
        // firebase signup\
        return await auth.signOut();
    }
    useEffect(() => {
        // eventListener
    
        console.log("added event Listener")
        let cleanUp = auth.onAuthStateChanged(user => {
            console.log("cleanup",user)
            setUser(user);
            console.log("usereffect", currentUser);
        //    return "string"
            // setLoading(false)
        })
        console.log("cleanup = ", cleanUp);
        return cleanUp;
    }, [currentUser]);
    const value = {
        login,
        signOut, currentUser,signup
    }
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>

    )
}