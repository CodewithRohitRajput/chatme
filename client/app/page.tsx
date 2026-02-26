'use client'

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
}

body {
  font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
  overflow-x: hidden;
}

.home-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  background: linear-gradient(135deg, #0b141a 0%, #111b21 100%);
  overflow: hidden;
}

.home-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(0,168,132,0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(0,168,132,0.1) 0%, transparent 50%);
  pointer-events: none;
}

.navbar {
  position: relative;
  z-index: 10;
  padding: 20px 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(49,61,69,0.5);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  text-decoration: none;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: var(--green-primary);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,168,132,0.3);
}

.logo-icon svg {
  width: 24px;
  height: 24px;
  color: white;
}

.nav-links {
  display: flex;
  gap: 24px;
  align-items: center;
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover {
  color: var(--text-primary);
}

.btn-primary {
  background: var(--green-primary);
  color: white;
  padding: 10px 24px;
  border-radius: 10px;
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(0,168,132,0.3);
}

.btn-primary:hover {
  background: var(--green-hover);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0,168,132,0.4);
}

.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  padding: 10px 24px;
  border: 1px solid var(--border);
  border-radius: 10px;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: var(--bg-tertiary);
  border-color: var(--green-primary);
}

.hero {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 48px;
  position: relative;
  z-index: 1;
}

.hero-content {
  max-width: 800px;
  text-align: center;
  animation: fadeIn 0.6s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-title {
  font-size: 64px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 24px;
  line-height: 1.1;
  letter-spacing: -1px;
}

.hero-title .highlight {
  color: var(--green-primary);
}

.hero-description {
  font-size: 20px;
  color: var(--text-secondary);
  margin-bottom: 40px;
  line-height: 1.6;
  font-weight: 400;
}

.hero-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.features {
  padding: 80px 48px;
  position: relative;
  z-index: 1;
  border-top: 1px solid rgba(49,61,69,0.5);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 32px;
  transition: all 0.3s;
}

.feature-card:hover {
  transform: translateY(-4px);
  border-color: var(--green-primary);
  box-shadow: 0 8px 24px rgba(0,168,132,0.2);
}

.feature-icon {
  width: 56px;
  height: 56px;
  background: rgba(0,168,132,0.1);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.feature-icon svg {
  width: 28px;
  height: 28px;
  color: var(--green-primary);
}

.feature-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.feature-description {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.footer {
  padding: 40px 48px;
  text-align: center;
  border-top: 1px solid rgba(49,61,69,0.5);
  position: relative;
  z-index: 1;
}

.footer-text {
  color: var(--text-muted);
  font-size: 14px;
}

@media (max-width: 768px) {
  .navbar {
    padding: 16px 24px;
  }

  .nav-links {
    gap: 16px;
  }

  .hero-title {
    font-size: 42px;
  }

  .hero-description {
    font-size: 18px;
  }

  .hero-buttons {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    text-align: center;
  }

  .features {
    padding: 60px 24px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
`

export default function Home() {
  const router = useRouter()

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="home-container">
        <nav className="navbar">
          <div className="logo">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <span>ChatMe</span>
          </div>
          <div className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="/login" className="btn-secondary">Sign In</a>
            <a href="/signup" className="btn-primary">Get Started</a>
          </div>
        </nav>

        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title">
              Connect with <span className="highlight">Everyone</span>
              <br />
              Instantly
            </h1>
            <p className="hero-description">
              Experience real-time messaging with a beautiful, modern interface.
              Chat with friends, make new connections, and stay connected.
            </p>
            <div className="hero-buttons">
              <a href="/signup" className="btn-primary">Get Started</a>
              <a href="/login" className="btn-secondary">Sign In</a>
            </div>
          </div>
        </section>

        <section className="features" id="features">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <h3 className="feature-title">Real-time Messaging</h3>
              <p className="feature-description">
                Send and receive messages instantly with our real-time chat system powered by WebSocket technology.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3 className="feature-title">Connect with Friends</h3>
              <p className="feature-description">
                Discover new people, send friend requests, and build your network. Stay connected with the people who matter.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <h3 className="feature-title">Secure & Private</h3>
              <p className="feature-description">
                Your conversations are secure and private. We use modern encryption to protect your data.
              </p>
            </div>
          </div>
        </section>

        <footer className="footer">
          <p className="footer-text">© 2024 ChatMe. Built with ❤️ for seamless communication.</p>
        </footer>
      </div>
    </>
  )
}
