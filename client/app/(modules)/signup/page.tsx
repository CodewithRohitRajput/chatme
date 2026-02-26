'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

* { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --bg-primary: #0b141a;
  --bg-secondary: #111b21;
  --bg-tertiary: #202c33;
  --green-primary: #00a884;
  --green-hover: #06cf9c;
  --text-primary: #e9edef;
  --text-secondary: #8696a0;
  --text-muted: #667781;
  --border: #313d45;
  --input-bg: #2a3942;
  --error: #f15c6d;
}

body {
  font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
}

.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(135deg, #0b141a 0%, #111b21 100%);
  position: relative;
  overflow: hidden;
}

.auth-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(0,168,132,0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(0,168,132,0.08) 0%, transparent 50%);
  pointer-events: none;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 48px 40px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  position: relative;
  z-index: 1;
  animation: slideUp 0.4s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-header {
  text-align: center;
  margin-bottom: 36px;
}

.auth-logo {
  width: 64px;
  height: 64px;
  background: var(--green-primary);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 8px 24px rgba(0,168,132,0.3);
}

.auth-logo svg {
  width: 36px;
  height: 36px;
  color: white;
}

.auth-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.auth-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 400;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  letter-spacing: 0.3px;
}

.form-input {
  width: 100%;
  background: var(--input-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px 16px;
  color: var(--text-primary);
  font-size: 15px;
  font-family: 'DM Sans', sans-serif;
  outline: none;
  transition: all 0.2s;
}

.form-input:focus {
  border-color: var(--green-primary);
  box-shadow: 0 0 0 3px rgba(0,168,132,0.1);
  background: rgba(42,57,66,0.8);
}

.form-input::placeholder {
  color: var(--text-muted);
}

.error-message {
  font-size: 13px;
  color: var(--error);
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.success-message {
  font-size: 13px;
  color: var(--green-primary);
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.submit-btn {
  width: 100%;
  background: var(--green-primary);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-size: 15px;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 8px;
  box-shadow: 0 4px 12px rgba(0,168,132,0.3);
}

.submit-btn:hover:not(:disabled) {
  background: var(--green-hover);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0,168,132,0.4);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.auth-footer {
  text-align: center;
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}

.auth-link {
  color: var(--green-primary);
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  transition: color 0.2s;
}

.auth-link:hover {
  color: var(--green-hover);
}

.auth-link-text {
  color: var(--text-secondary);
  font-size: 14px;
  margin-right: 6px;
}
`

export default function Signup() {
  const [signup, setSignup] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (signup.password !== signup.confirmPassword) {
      setError('Passwords do not match!')
      return
    }

    if (signup.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const { confirmPassword, ...signupData } = signup
      const response = await fetch('http://localhost:8000/users/signup', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData)
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message || 'Account created successfully!')
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      } else {
        setError(data.message || 'Signup failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/>
                <line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
            </div>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join ChatMe and start connecting</p>
          </div>

          <form className="auth-form" onSubmit={handleSignup}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-input"
                placeholder="Choose a username"
                value={signup.username}
                onChange={(e) => setSignup({ ...signup, username: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="Enter your email"
                value={signup.email}
                onChange={(e) => setSignup({ ...signup, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Create a password"
                value={signup.password}
                onChange={(e) => setSignup({ ...signup, password: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Confirm your password"
                value={signup.confirmPassword}
                onChange={(e) => setSignup({ ...signup, confirmPassword: e.target.value })}
                required
              />
            </div>

            {error && (
              <div className="error-message">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            {success && (
              <div className="success-message">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                {success}
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            <span className="auth-link-text">Already have an account?</span>
            <a href="/login" className="auth-link">Sign in</a>
          </div>
        </div>
      </div>
    </>
  )
}
