"use client"

import React, {useEffect, useState} from 'react'
import globals from "@/styles/globals.module.css"
import {FaArchive} from "react-icons/fa"
import {useAtom} from "jotai"
import {currentUserID} from "@/states/userState.js"
import {useRouter} from "next/navigation.js"
import {SkeletonTasks} from "@/components/ui/Skeleton.jsx"
import {EmptyResult} from "@/components/ui/EmptyResult.jsx"
import ArchivedTasks from "@/components/pages/archived/ArchivedTasks.jsx"
import PageTransition from "@/app/layouts/PageTransition.jsx";

export default function ArchivedPage() {

    const router = useRouter()

    const [isTasks, setIsTasks] = useState(true)

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


    const [tasks, setTasks] = useState([])

    useEffect(() => {
            const fetchArchivedTasks = async () => {

                const request = {
                    user_id: currentLoggedInUserID,
                    archived: true,
                }

                const response = await fetch(`/api/post/archived/fetchArchived`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(request),
                })

                const data = await response.json()

                if (data.status) {
                    setTasks(data.result)
                    setTimeout(() => setIsTasks(false), 2000)
                } else {
                    alert("Failed to fetch the tasks")
                }

            }
            fetchArchivedTasks().then(r => console.log(r))

        }, [currentLoggedInUserID]
    )

    return (
        <PageTransition>
            <div className={globals.Container}>
                <h1 className={globals.PageHeader}><FaArchive/> Archived</h1>
                {isTasks ? <SkeletonTasks/> : (
                    tasks.length === 0 ? <EmptyResult isHome={false}/> : (
                        tasks.map((task) => (
                            <div key={task.id}>
                                <ArchivedTasks tasks={task}/>
                            </div>
                        ))
                    )
                )}
            </div>
        </PageTransition>
    )
}