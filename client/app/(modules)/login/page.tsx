"use client"

import { useState } from "react"

interface Login {
	email: string,
	password: string,
	confirmPassword: string,
}

export default function Login() {
	const [login, setLogin] = useState<Login>({
		email: '',
		password: '',
		confirmPassword: '',
	});
	const [backendResponse, setBackendResponse] = useState('');

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();

		if (login.password !== login.confirmPassword) {
			alert('Passwords do not match!');
			return;
		}

		const { confirmPassword, ...loginData } = login;

		const response = await fetch('http://localhost:8000/users/login', {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(loginData),
		});

		const data = await response.json();
		setBackendResponse(data.message || 'Login complete');
	};

	return (
		<div>
			<form onSubmit={handleLogin}>
				<input
					placeholder="Email"
					onChange={e => setLogin({ ...login, email: e.target.value })}
				/>
				<input
					type="password"
					placeholder="Password"
					onChange={e => setLogin({ ...login, password: e.target.value })}
				/>
				<input
					type="password"
					placeholder="Confirm Password"
					onChange={e => setLogin({ ...login, confirmPassword: e.target.value })}
				/>

				<button type="submit">Login</button>
			</form>
			<text>{backendResponse}</text>
		</div>
	);
}
