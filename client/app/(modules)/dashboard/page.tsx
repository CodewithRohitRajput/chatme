'use client'

import { useEffect, useState, useRef } from "react"

// @ts-ignore
import io from 'socket.io-client'

interface User { _id: string; username: string }
interface Friend { _id: string; username: string }
interface Pending { _id?: string; from?: { _id?: string; username?: string } }
interface Message { id?: string; text: string; senderId: string; receiverId: string; timestamp?: Date }

const CSS = `
* { margin: 0; padding: 0; box-sizing: border-box; }

:root {
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
  --sent-msg: #005c4b;
  --received-msg: #202c33;
  --input-bg: #2a3942;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  height: 100vh;
  overflow: hidden;
}

.app-container {
  display: flex;
  height: 100vh;
  width: 100vw;
}

/* ── SIDEBAR ── */
.sidebar {
  width: 420px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-header {
  background: var(--bg-tertiary);
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);
}

.sidebar-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

.sidebar-tabs {
  display: flex;
  background: var(--bg-tertiary);
  border-bottom: 1px solid var(--border);
  padding: 0 8px;
}

.tab {
  flex: 1;
  padding: 12px 16px;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab.active {
  color: var(--green-primary);
  border-bottom-color: var(--green-primary);
}

.tab:hover {
  background: var(--bg-hover);
}

.search-container {
  padding: 8px 12px;
  background: var(--bg-secondary);
}

.search-box {
  width: 100%;
  background: var(--input-bg);
  border: none;
  border-radius: 8px;
  padding: 9px 16px 9px 40px;
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
}

.search-box::placeholder {
  color: var(--text-muted);
}

.search-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  width: 16px;
  height: 16px;
}

.chat-list {
  flex: 1;
  overflow-y: auto;
  background: var(--bg-secondary);
}

.chat-list::-webkit-scrollbar {
  width: 6px;
}

.chat-list::-webkit-scrollbar-track {
  background: transparent;
}

.chat-list::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 3px;
}

.chat-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid var(--border);
  transition: background 0.15s;
  gap: 12px;
}

.chat-item:hover {
  background: var(--bg-hover);
}

.chat-item.active {
  background: var(--bg-hover);
}

.avatar {
  width: 49px;
  height: 49px;
  border-radius: 50%;
  background: var(--green-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 500;
  color: white;
  flex-shrink: 0;
}

.chat-info {
  flex: 1;
  min-width: 0;
}

.chat-name {
  font-size: 17px;
  font-weight: 400;
  color: var(--text-primary);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-preview {
  font-size: 14px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-status {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 2px;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  gap: 12px;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 17px;
  font-weight: 400;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.user-action {
  display: flex;
  gap: 8px;
}

.btn-small {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add {
  background: var(--green-primary);
  color: white;
}

.btn-add:hover {
  background: var(--green-hover);
}

.btn-accept {
  background: var(--green-primary);
  color: white;
  padding: 6px 16px;
}

.btn-accept:hover {
  background: var(--green-hover);
}

.btn-decline {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border);
  padding: 6px 16px;
}

.btn-decline:hover {
  background: var(--bg-hover);
}

.empty-state {
  padding: 60px 20px;
  text-align: center;
  color: var(--text-muted);
}

.empty-text {
  font-size: 14px;
  margin-top: 12px;
}

/* ── CHAT AREA ── */
.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  position: relative;
}

.chat-header {
  background: var(--bg-tertiary);
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--border);
}

.chat-header-info {
  flex: 1;
}

.chat-header-name {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.chat-header-status {
  font-size: 13px;
  color: var(--text-secondary);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 3px;
}

.message {
  display: flex;
  margin-bottom: 2px;
  animation: fadeIn 0.2s;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.message.sent {
  justify-content: flex-end;
}

.message.received {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 65%;
  padding: 6px 12px 8px;
  border-radius: 7.5px;
  word-wrap: break-word;
  position: relative;
}

.message.sent .message-bubble {
  background: var(--sent-msg);
  color: var(--text-primary);
  border-bottom-right-radius: 2px;
}

.message.received .message-bubble {
  background: var(--received-msg);
  color: var(--text-primary);
  border-bottom-left-radius: 2px;
}

.message-text {
  font-size: 14.2px;
  line-height: 19px;
  margin-bottom: 2px;
}

.message-time {
  font-size: 11.5px;
  color: var(--text-secondary);
  text-align: right;
  margin-top: 2px;
  opacity: 0.8;
}

.message.received .message-time {
  text-align: left;
}

.chat-input-container {
  background: var(--bg-tertiary);
  padding: 8px 12px;
  border-top: 1px solid var(--border);
}

.chat-input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  background: var(--input-bg);
  border-radius: 24px;
  padding: 9px 12px;
}

.chat-input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 15px;
  outline: none;
  resize: none;
  max-height: 100px;
  font-family: inherit;
  line-height: 20px;
}

.chat-input::placeholder {
  color: var(--text-muted);
}

.send-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--green-primary);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.2s;
}

.send-btn:hover {
  background: var(--green-hover);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-icon {
  width: 18px;
  height: 18px;
}

.no-chat {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: var(--text-muted);
}

.no-chat-icon {
  width: 120px;
  height: 120px;
  opacity: 0.3;
  margin-bottom: 24px;
}

.no-chat-text {
  font-size: 14px;
}

.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg-tertiary);
  color: var(--text-primary);
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  z-index: 1000;
  animation: toastSlide 0.3s;
}

@keyframes toastSlide {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
`

function getUserIdFromCookie(): string | null {
  if (typeof document === 'undefined') return null
  const cookies = document.cookie.split(';')
  const tokenCookie = cookies.find(c => c.trim().startsWith('token='))
  if (!tokenCookie) return null
  const token = tokenCookie.split('=')[1]
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.userId || null
  } catch {
    return null
  }
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'chats' | 'requests' | 'discover'>('chats')
  const [users, setUsers] = useState<User[]>([])
  const [pending, setPending] = useState<Pending[]>([])
  const [friends, setFriends] = useState<Friend[]>([])
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageText, setMessageText] = useState('')
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [socket, setSocket] = useState<any>(null)
  const [userId, setUserId] = useState<string | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const id = getUserIdFromCookie()
    setUserId(id)
    
    if (id) {
      const sock = io('http://localhost:8000', {
        transports: ['websocket'],
        withCredentials: true
      })
      
      sock.on('connect', () => {
        sock.emit('join', id)
      })
      
      sock.on('receiveMsg', (text: string) => {
        const newMsg: Message = {
          text,
          senderId: activeChat || '',
          receiverId: id || '',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, newMsg])
      })
      
      setSocket(sock)
      
      return () => {
        sock.disconnect()
      }
    }
  }, [])

  useEffect(() => {
  
      fetch('http://localhost:8000/friends/', { credentials: 'include' })
        .then(r => r.json()).then(setUsers).catch(() => {})
      fetch('http://localhost:8000/friends/requests/incoming', { credentials: 'include' })
        .then(r => r.json()).then(setPending).catch(() => {})
      fetch('http://localhost:8000/friends/allFriends', { credentials: 'include' })
        .then(r => r.json()).then(setFriends).catch(() => {})
    
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const showToastMsg = (msg: string) => {
    setToast(msg)
    setShowToast(true)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setShowToast(false), 3000)
  }

  const sendRequest = async (id: string) => {
    try {
      const r = await fetch(`http://localhost:8000/friends/request/${id}`, {
        method: 'POST',
        credentials: 'include'
      })
      const d = await r.json()
      showToastMsg(d.message || 'Request sent')
    } catch (e) {
      showToastMsg('Failed to send request')
    }
  }

  const handleRequest = async (reqId: string | undefined, status: 'Accepted' | 'Rejected') => {
    if (!reqId) return
    try {
      const r = await fetch(`http://localhost:8000/friends/requests/${reqId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      const d = await r.json()
      showToastMsg(d.message || `Request ${status.toLowerCase()}`)
      setPending(prev => prev.filter(p => p._id !== reqId))
      if (status === 'Accepted') {
        const matched = pending.find(p => p._id === reqId)
        if (matched?.from) {
          setFriends(prev => [...prev, {
            _id: matched.from!._id || '',
            username: matched.from!.username || ''
          }])
        }
      }
    } catch (e) {
      showToastMsg('Failed to process request')
    }
  }

  const openChat = (friendId: string) => {
    setActiveChat(friendId)
    setMessages([])
  }

  const sendMessage = () => {
    if (!messageText.trim() || !activeChat || !socket || !userId) return
    
    const newMsg: Message = {
      text: messageText,
      senderId: userId,
      receiverId: activeChat,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, newMsg])
    socket.emit('sendMessage', {
      receiverId: activeChat,
      senderId: userId,
      text: messageText
    })
    
    setMessageText('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase())
  )

  const filteredFriends = friends.filter(f =>
    f.username.toLowerCase().includes(search.toLowerCase())
  )

  const activeFriend = friends.find(f => f._id === activeChat)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="app-container">
        {/* ── SIDEBAR ── */}
        <div className="sidebar">
          <div className="sidebar-header">
            <div className="sidebar-title">ChatMe</div>
          </div>

          <div className="sidebar-tabs">
            <button
              className={`tab ${activeTab === 'chats' ? 'active' : ''}`}
              onClick={() => setActiveTab('chats')}
            >
              Chats
            </button>
            <button
              className={`tab ${activeTab === 'requests' ? 'active' : ''}`}
              onClick={() => setActiveTab('requests')}
            >
              Requests
            </button>
            <button
              className={`tab ${activeTab === 'discover' ? 'active' : ''}`}
              onClick={() => setActiveTab('discover')}
            >
              Discover
            </button>
          </div>

          <div className="search-container">
            <div className="search-wrapper">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                className="search-box"
                placeholder="Search or start new chat"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="chat-list">
            {activeTab === 'chats' && (
              <>
                {filteredFriends.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-text">No chats yet</div>
                    <div className="empty-text" style={{ fontSize: '13px', marginTop: '4px' }}>
                      Start a conversation from Discover
                    </div>
                  </div>
                ) : (
                  filteredFriends.map((f) => (
                    <div
                      key={f._id}
                      className={`chat-item ${activeChat === f._id ? 'active' : ''}`}
                      onClick={() => openChat(f._id)}
                    >
                      <div className="avatar" style={{ background: `hsl(${f._id.charCodeAt(0) * 137.5 % 360}, 70%, 50%)` }}>
                        {f.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="chat-info">
                        <div className="chat-name">{f.username}</div>
                        <div className="chat-status">Tap to open chat</div>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

            {activeTab === 'requests' && (
              <>
                {pending.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-text">No pending requests</div>
                  </div>
                ) : (
                  pending.map((p) => (
                    <div key={p._id} className="user-item">
                      <div className="avatar" style={{ background: `hsl(${(p.from?.username || '?').charCodeAt(0) * 137.5 % 360}, 70%, 50%)` }}>
                        {(p.from?.username || '?').charAt(0).toUpperCase()}
                      </div>
                      <div className="user-info">
                        <div className="user-name">{p.from?.username || 'Unknown'}</div>
                      </div>
                      <div className="user-action">
                        <button
                          className="btn-small btn-accept"
                          onClick={() => handleRequest(p._id, 'Accepted')}
                        >
                          Accept
                        </button>
                        <button
                          className="btn-small btn-decline"
                          onClick={() => handleRequest(p._id, 'Rejected')}
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

            {activeTab === 'discover' && (
              <>
                {filteredUsers.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-text">No users found</div>
                  </div>
                ) : (
                  filteredUsers.map((u) => (
                    <div key={u._id} className="user-item">
                      <div className="avatar" style={{ background: `hsl(${u._id.charCodeAt(0) * 137.5 % 360}, 70%, 50%)` }}>
                        {u.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="user-info">
                        <div className="user-name">{u.username}</div>
                      </div>
                      <button
                        className="btn-small btn-add"
                        onClick={() => sendRequest(u._id)}
                      >
                        Add
                      </button>
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        </div>

        {/* ── CHAT AREA ── */}
        <div className="chat-area">
          {activeChat && activeFriend ? (
            <>
              <div className="chat-header">
                <div className="avatar" style={{ background: `hsl(${activeFriend._id.charCodeAt(0) * 137.5 % 360}, 70%, 50%)` }}>
                  {activeFriend.username.charAt(0).toUpperCase()}
                </div>
                <div className="chat-header-info">
                  <div className="chat-header-name">{activeFriend.username}</div>
                  <div className="chat-header-status">online</div>
                </div>
              </div>

              <div className="chat-messages">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`message ${msg.senderId === userId ? 'sent' : 'received'}`}
                  >
                    <div className="message-bubble">
                      <div className="message-text">{msg.text}</div>
                      <div className="message-time">
                        {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        }).toLowerCase() : 'now'}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="chat-input-container">
                <div className="chat-input-wrapper">
                  <textarea
                    className="chat-input"
                    placeholder="Type a message"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    rows={1}
                  />
                  <button
                    className="send-btn"
                    onClick={sendMessage}
                    disabled={!messageText.trim()}
                  >
                    <svg className="send-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="no-chat">
              <svg className="no-chat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <div className="no-chat-text">Select a chat to start messaging</div>
            </div>
          )}
        </div>
      </div>

      {showToast && (
        <div className="toast">{toast}</div>
      )}
    </>
  )
}
