'use client'

import { useState } from "react"

interface Signup {
username : string,
email : string,
password : string,
confirmPassword : string
}

export default function Signup (){
    const [signup, setSignup] = useState<Signup>({
        username : '',
        email : '',
        password : '',
        confirmPassword : ''
    });
    const [backendResponse, setBackendResponse] = useState('');

    const handleSignup = async (e : React.FormEvent) =>{
        e.preventDefault();

        if (signup.password !== signup.confirmPassword){
            alert("Passwords do not match!")
            return;
        }

        const {confirmPassword, ...signupData} = signup

        const response = await fetch(`http://localhost:8000/users/signup`, {
            method : 'POST',
            credentials : 'include',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(signupData)
        })
        const data = await response.json();
        setBackendResponse(data.message || 'Signup complete')
    }

return(
    <div>

      <form onSubmit={handleSignup}>
      <input placeholder="Username" onChange={e => setSignup({...signup, username: e.target.value})}/>
      <input placeholder="Email" onChange={e => setSignup({...signup, email: e.target.value})}/>
      <input type="password" placeholder="Password" onChange={e => setSignup({...signup, password: e.target.value})}/>
      <input type="password" placeholder="Confirm Password" onChange={e => setSignup({...signup, confirmPassword: e.target.value})}/>

      <button type="submit">Signup</button>
      
    </form>
    <text>{backendResponse}</text>
    </div>
)

}