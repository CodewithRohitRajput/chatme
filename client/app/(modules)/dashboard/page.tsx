'use client'

import { useEffect, useState } from "react"

interface User {
    username : string
}

export default function Dashboard(){
    const[users, setUsers] = useState<User[]>([])
    useEffect(()=>{
        const getAllUsers = async () => {
            const res = await fetch('http://localhost:8000/friends/', {
                method : 'GET',
                credentials : "include"
            })
            const data = await res.json()
            setUsers(data)
        }
        getAllUsers();
    }, [])
    return(
        <div>
            All Users
            <div>
            {users.map((user,idx)=>(
                <div key={idx}>{user.username}</div>
            ))}
            </div>
        </div>
    )
}