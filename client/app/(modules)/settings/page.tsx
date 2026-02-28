'use client'

import { useEffect, useState } from "react"
import Link from "next/link"

interface Me {
  username: string
  email: string
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

* { margin: 0; padding: 0; box-sizing: border-box; }

.settings-root {
  --bg-primary: #0b141a;
  --bg-secondary: #111b21;
  --bg-tertiary: #202c33;
  --bg-hover: #2a3942;
  --green-primary: #00a884;
  --green-hover: #06cf9c;
  --text-primary: #e9edef;
  --text-secondary: #8696a0;
  --text-muted: #667781;
  --border: #313d45;
  font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
}

.settings-header {
  background: var(--bg-tertiary);
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 20px;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 10;
}

.settings-back {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  text-decoration: none;
}
.settings-back:hover {
  background: var(--bg-hover);
}
.settings-back svg {
  width: 24px;
  height: 24px;
}

.settings-header-title {
  font-size: 19px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.2px;
}

.settings-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px 16px;
}

.settings-profile-card {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 20px;
}

.settings-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 0 0 2px rgba(0,168,132,0.3);
}

.settings-profile-info {
  flex: 1;
  min-width: 0;
}

.settings-profile-name {
  font-size: 22px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
  letter-spacing: -0.3px;
}

.settings-profile-email {
  font-size: 14px;
  color: var(--text-secondary);
}

.settings-section {
  margin-bottom: 28px;
}

.settings-section-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  padding: 0 4px;
}

.settings-list {
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border);
  overflow: hidden;
}

.settings-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  transition: background 0.15s;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
}
.settings-item:last-child {
  border-bottom: none;
}
.settings-item:hover {
  background: var(--bg-hover);
}

.settings-item-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
  color: var(--text-secondary);
}
.settings-item-icon svg {
  width: 20px;
  height: 20px;
}

.settings-item-text {
  flex: 1;
}
.settings-item-label {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}
.settings-item-desc {
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 2px;
}

.settings-item-arrow {
  color: var(--text-muted);
  flex-shrink: 0;
}
.settings-item-arrow svg {
  width: 20px;
  height: 20px;
}

.settings-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  color: var(--text-muted);
  font-size: 15px;
}
`

export default function Settings() {
  const [me, setMe] = useState<Me | null>(null)

  useEffect(() => {
    const getMyInfo = async () => {
      try {
        const res = await fetch("http://localhost:8000/users/me", {
          method: "GET",
          credentials: "include",
        })
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)
        const data = (await res.json()) as Me
        setMe(data)
      } catch (err) {
        console.error(err)
      }
    }
    getMyInfo()
  }, [])

  if (!me) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="settings-root">
          <div className="settings-loading">Loading…</div>
        </div>
      </>
    )
  }

  const displayName = me.username || "User"
  const avatarColor = `hsl(${displayName.charCodeAt(0) * 137.5 % 360}, 65%, 45%)`

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="settings-root">
        <header className="settings-header">
          <Link href="/dashboard" className="settings-back" aria-label="Back to dashboard">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="settings-header-title">Settings</h1>
        </header>

        <main className="settings-content">
          <div className="settings-profile-card">
            <div
              className="settings-avatar"
              style={{ background: avatarColor }}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="settings-profile-info">
              <div className="settings-profile-name">{me.username}</div>
              <div className="settings-profile-email">{me.email}</div>
            </div>
          </div>

          <section className="settings-section">
            <h2 className="settings-section-title">Account</h2>
            <div className="settings-list">
              <a className="settings-item" href="#">
                <div className="settings-item-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className="settings-item-text">
                  <div className="settings-item-label">Profile</div>
                  <div className="settings-item-desc">Name, photo, about</div>
                </div>
                <span className="settings-item-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </span>
              </a>
              <a className="settings-item" href="#">
                <div className="settings-item-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div className="settings-item-text">
                  <div className="settings-item-label">Email</div>
                  <div className="settings-item-desc">{me.email}</div>
                </div>
                <span className="settings-item-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </span>
              </a>
            </div>
          </section>

          <section className="settings-section">
            <h2 className="settings-section-title">Privacy & security</h2>
            <div className="settings-list">
              <a className="settings-item" href="#">
                <div className="settings-item-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div className="settings-item-text">
                  <div className="settings-item-label">Privacy</div>
                  <div className="settings-item-desc">Last seen, profile photo, about</div>
                </div>
                <span className="settings-item-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </span>
              </a>
              <a className="settings-item" href="#">
                <div className="settings-item-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                </div>
                <div className="settings-item-text">
                  <div className="settings-item-label">Security</div>
                  <div className="settings-item-desc">Two-step verification, passcode</div>
                </div>
                <span className="settings-item-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </span>
              </a>
            </div>
          </section>

          <section className="settings-section">
            <h2 className="settings-section-title">Chat</h2>
            <div className="settings-list">
              <a className="settings-item" href="#">
                <div className="settings-item-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div className="settings-item-text">
                  <div className="settings-item-label">Chat history</div>
                  <div className="settings-item-desc">Backup, archive, delete</div>
                </div>
                <span className="settings-item-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </span>
              </a>
              <a className="settings-item" href="#">
                <div className="settings-item-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>
                <div className="settings-item-text">
                  <div className="settings-item-label">Notifications</div>
                  <div className="settings-item-desc">Messages, sounds, previews</div>
                </div>
                <span className="settings-item-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </span>
              </a>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
