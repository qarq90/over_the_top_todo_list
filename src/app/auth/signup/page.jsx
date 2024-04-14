"use client"

import React, {useEffect} from 'react'
import globals from "@/styles/globals.module.css"
import SignUp from "@/components/auth/signup/Signup.jsx"
import {FaUserPlus} from "react-icons/fa"
import {useAtom} from "jotai";
import {currentUserID} from "@/states/userState.js";
import {router} from "next/navigation.js";

export default function ProfilePage() {

    const [currentLoggedInUserID, setCurrentLoggedInUserID] = useAtom(currentUserID)

    useEffect(() => {
        try {
            setTimeout(() => {
                if (typeof window !== 'undefined' && window.localStorage) {
                    let storageUserID = window.localStorage.getItem("storageUserID") || "";

                    if (storageUserID === "") {
                        router.push("/auth/login");
                    } else {
                        setCurrentLoggedInUserID(storageUserID);
                    }
                }
            }, 1500); // 1500 milliseconds
        } catch (error) {
            console.log(error);
        }
    }, []);


    return (
        <>
            <div className={globals.Container}>
                <h1 className={globals.PageHeader}><FaUserPlus/>SignUp</h1>
                <SignUp/>
            </div>
        </>
    )
}