'use client'

import { useEffect, useState, useRef } from "react"
import io from 'socket.io-client'
import Cookies from "js-cookie"
import {jwtDecode} from "jwt-decode";
import { useRouter } from "next/navigation";

interface User { _id: string; username: string }
interface Friend { _id: string; username: string }
interface Pending { _id?: string; from?: { _id?: string; username?: string } }
interface Message { id?: string; text: string; senderId: string; receiverId: string; timestamp?: Date }
interface Profile {_id : string, username : string, email : string}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

* { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --bg-primary: #0b141a;
  --bg-secondary: #111b21;
  --bg-tertiary: #202c33;
  --bg-hover: #2a3942;
  --green-primary: #00a884;
  --green-hover: #06cf9c;
  --green-glow: rgba(0, 168, 132, 0.15);
  --text-primary: #e9edef;
  --text-secondary: #8696a0;
  --text-muted: #667781;
  --border: #313d45;
  --sent-msg: #005c4b;
  --received-msg: #202c33;
  --input-bg: #2a3942;
}

body {
  font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
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
  width: 400px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-header {
  background: var(--bg-tertiary);
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);
  min-height: 64px;
}

.user-greeting {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.greeting-line {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 400;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.username-line {
  font-size: 17px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.2px;
}

.header-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--green-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 0 0 2px rgba(0,168,132,0.3);
}

.header-settings-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
  flex-shrink: 0;
}
.header-settings-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}
.header-settings-btn svg {
  width: 22px;
  height: 22px;
}

.sidebar-tabs {
  display: flex;
  background: var(--bg-tertiary);
  border-bottom: 1px solid var(--border);
  padding: 0 8px;
  gap: 4px;
}

.tab {
  flex: 1;
  padding: 12px 8px;
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  font-family: 'DM Sans', sans-serif;
  letter-spacing: 0.3px;
}

.tab.active {
  color: var(--green-primary);
  border-bottom-color: var(--green-primary);
}

.tab:hover {
  color: var(--text-primary);
  background: rgba(255,255,255,0.03);
}

.search-container {
  padding: 10px 12px;
  background: var(--bg-secondary);
  border-bottom: 1px solid rgba(49,61,69,0.5);
}

.search-wrapper {
  position: relative;
}

.search-box {
  width: 100%;
  background: var(--input-bg);
  border: none;
  border-radius: 10px;
  padding: 10px 16px 10px 42px;
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
  font-family: 'DM Sans', sans-serif;
  transition: box-shadow 0.2s;
}

.search-box:focus {
  box-shadow: 0 0 0 1px var(--green-primary);
}

.search-box::placeholder {
  color: var(--text-muted);
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  width: 15px;
  height: 15px;
  pointer-events: none;
}

.chat-list {
  flex: 1;
  overflow-y: auto;
  background: var(--bg-secondary);
}

.chat-list::-webkit-scrollbar { width: 4px; }
.chat-list::-webkit-scrollbar-track { background: transparent; }
.chat-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

.chat-item {
  display: flex;
  align-items: center;
  padding: 13px 16px;
  cursor: pointer;
  border-bottom: 1px solid rgba(49,61,69,0.6);
  transition: background 0.15s;
  gap: 13px;
}

.chat-item:hover { background: rgba(42,57,66,0.6); }
.chat-item.active { background: var(--bg-hover); }

.avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: var(--green-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
}

.chat-info { flex: 1; min-width: 0; }

.chat-item-delete-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.2s, color 0.2s;
}
.chat-item-delete-btn:hover {
  background: rgba(239,83,80,0.2);
  color: #ef5350;
}
.chat-item-delete-btn svg {
  width: 18px;
  height: 18px;
}

/* ── CONFIRM REMOVE MODAL ── */
.confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 20px;
}
.confirm-modal {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
  max-width: 340px;
  width: 100%;
  box-shadow: 0 16px 48px rgba(0,0,0,0.4);
}
.confirm-modal-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}
.confirm-modal-text {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 24px;
  line-height: 1.45;
}
.confirm-modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
.confirm-modal-btn {
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  font-family: 'DM Sans', sans-serif;
  transition: background 0.2s, color 0.2s;
}
.confirm-modal-btn-cancel {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}
.confirm-modal-btn-cancel:hover {
  background: var(--bg-hover);
}
.confirm-modal-btn-delete {
  background: #d32f2f;
  color: white;
}
.confirm-modal-btn-delete:hover {
  background: #b71c1c;
}
.confirm-modal-btn-delete:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.chat-name {
  font-size: 15.5px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-preview {
  font-size: 13px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(49,61,69,0.6);
  gap: 13px;
  transition: background 0.15s;
}

.user-item:hover { background: rgba(42,57,66,0.4); }

.user-info { flex: 1; min-width: 0; }

.user-name {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
}

.user-sub {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 2px;
}

.user-action { display: flex; gap: 8px; align-items: center; }

.btn-small {
  padding: 7px 14px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'DM Sans', sans-serif;
}

.btn-add {
  background: var(--green-primary);
  color: white;
}

.btn-add:hover {
  background: var(--green-hover);
  box-shadow: 0 2px 8px rgba(0,168,132,0.3);
}

.btn-accept {
  background: var(--green-primary);
  color: white;
}

.btn-accept:hover {
  background: var(--green-hover);
  box-shadow: 0 2px 8px rgba(0,168,132,0.3);
}

.btn-decline {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border);
}

.btn-decline:hover { background: var(--bg-hover); color: var(--text-primary); }

.empty-state {
  padding: 60px 20px;
  text-align: center;
  color: var(--text-muted);
}

.empty-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 12px;
  opacity: 0.3;
}

.empty-text { font-size: 14px; }
.empty-sub { font-size: 12px; margin-top: 4px; color: var(--text-muted); opacity: 0.7; }

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
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  border-bottom: 1px solid var(--border);
  min-height: 64px;
}

.chat-header-info { flex: 1; }

.chat-header-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.chat-header-status {
  font-size: 12.5px;
  color: var(--green-primary);
  display: flex;
  align-items: center;
  gap: 5px;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--green-primary);
  box-shadow: 0 0 4px var(--green-primary);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.015'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.chat-messages::-webkit-scrollbar { width: 4px; }
.chat-messages::-webkit-scrollbar-track { background: transparent; }
.chat-messages::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

.message {
  display: flex;
  margin-bottom: 1px;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.message.sent { justify-content: flex-end; }
.message.received { justify-content: flex-start; }

.message-bubble {
  max-width: 62%;
  padding: 8px 12px 6px;
  border-radius: 10px;
  word-wrap: break-word;
  position: relative;
  box-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

.message.sent .message-bubble {
  background: var(--sent-msg);
  color: var(--text-primary);
  border-bottom-right-radius: 3px;
}

.message.received .message-bubble {
  background: var(--received-msg);
  color: var(--text-primary);
  border-bottom-left-radius: 3px;
}

.message-text {
  font-size: 14.2px;
  line-height: 20px;
  margin-bottom: 3px;
}

.message-meta {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
}

.message-time {
  font-size: 11px;
  color: var(--text-secondary);
  opacity: 0.7;
}

.message.received .message-meta { justify-content: flex-start; }

/* ── INPUT AREA ── */
.chat-input-container {
  background: var(--bg-tertiary);
  padding: 10px 16px;
  border-top: 1px solid var(--border);
}

.chat-input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  background: var(--input-bg);
  border-radius: 14px;
  padding: 8px 8px 8px 16px;
  transition: box-shadow 0.2s;
  border: 1px solid transparent;
}

.chat-input-wrapper:focus-within {
  border-color: rgba(0,168,132,0.3);
  box-shadow: 0 0 0 3px rgba(0,168,132,0.07);
}

.chat-input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 15px;
  outline: none;
  resize: none;
  max-height: 120px;
  min-height: 24px;
  font-family: 'DM Sans', sans-serif;
  line-height: 22px;
  padding: 1px 0;
  align-self: center;
}

.chat-input::placeholder { color: var(--text-muted); }

.send-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--green-primary);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0,168,132,0.25);
}

.send-btn:hover:not(:disabled) {
  background: var(--green-hover);
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0,168,132,0.4);
}

.send-btn:active:not(:disabled) {
  transform: scale(0.96);
}

.send-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  box-shadow: none;
}

.send-icon { width: 17px; height: 17px; }

/* ── NO CHAT STATE ── */
.no-chat {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: var(--text-muted);
  gap: 16px;
}

.no-chat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px 48px;
  background: rgba(32,44,51,0.5);
  border: 1px solid var(--border);
  border-radius: 20px;
}

.no-chat-icon {
  width: 64px;
  height: 64px;
  opacity: 0.2;
}

.no-chat-title {
  font-size: 18px;
  font-weight: 500;
  color: var(--text-secondary);
  letter-spacing: -0.2px;
}

.no-chat-sub {
  font-size: 13px;
  color: var(--text-muted);
  text-align: center;
}

/* ── TOAST ── */
.toast {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg-hover);
  color: var(--text-primary);
  padding: 11px 22px;
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 500;
  border: 1px solid var(--border);
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  z-index: 1000;
  animation: toastSlide 0.25s ease;
  letter-spacing: 0.1px;
}

@keyframes toastSlide {
  from { opacity: 0; transform: translateX(-50%) translateY(16px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}
`

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard() {
  const router = useRouter()
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
  const [userProfile, setUserProfile] = useState<Profile | null>(null)
  const [removeConfirmFriend, setRemoveConfirmFriend] = useState<Friend | null>(null)
  const [removingFriendId, setRemovingFriendId] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  interface TokenPayload { userId: string }

  useEffect(() => {
    const token = Cookies.get("token")
    const id = token ? jwtDecode<TokenPayload>(token).userId : null
    setUserId(id)

    if (id) {
      const sock = io('http://localhost:8000', {
        transports: ['websocket'],
        withCredentials: true
      })

      sock.on('connect', () => { sock.emit('join', id) })

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
      return () => { sock.disconnect() }
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

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }, [messageText])

  const showToastMsg = (msg: string) => {
    setToast(msg)
    setShowToast(true)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setShowToast(false), 3000)
  }

  const sendRequest = async (id: string) => {
    try {
      const r = await fetch(`http://localhost:8000/friends/request/${id}`, {
        method: 'POST', credentials: 'include'
      })
      const d = await r.json()
      showToastMsg(d.message || 'Request sent')
    } catch {
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
          setFriends(prev => [...prev, { _id: matched.from!._id || '', username: matched.from!.username || '' }])
        }
      }
    } catch {
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
    socket.emit('sendMessage', { receiverId: activeChat, senderId: userId, text: messageText })
    setMessageText('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const filteredUsers = users.filter(u => u.username.toLowerCase().includes(search.toLowerCase()))
  const filteredFriends = friends.filter(f => f.username.toLowerCase().includes(search.toLowerCase()))
  const activeFriend = friends.find(f => f._id === activeChat)

  useEffect(() => {
    const getProfile = async () => {
      const res = await fetch(`http://localhost:8000/users/me`, { method: 'GET', credentials: 'include' })
      const data = await res.json()
      setUserProfile(data)
    }
    getProfile()
  }, [])

  const displayName = userProfile?.username || 'User'

  const handleRemoveFrnd = async (friendId: string) => {
    setRemovingFriendId(friendId)
    try {
      const res = await fetch(`http://localhost:8000/friends/remove`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friendId }),
      })
      const data = await res.json()
      if (res.ok) {
        setFriends((prev) => prev.filter((f) => f._id !== friendId))
        if (activeChat === friendId) setActiveChat(null)
        setRemoveConfirmFriend(null)
        showToastMsg(data.message || 'Friend removed successfully')
      } else {
        showToastMsg(data.message || 'Failed to remove friend')
      }
    } catch {
      showToastMsg('Failed to remove friend')
    } finally {
      setRemovingFriendId(null)
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      {removeConfirmFriend && (
        <div className="confirm-overlay" onClick={() => !removingFriendId && setRemoveConfirmFriend(null)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal-title">Remove friend</div>
            <div className="confirm-modal-text">
              Do you want to remove <strong>{removeConfirmFriend.username}</strong> from your friends?
            </div>
            <div className="confirm-modal-actions">
              <button
                type="button"
                className="confirm-modal-btn confirm-modal-btn-cancel"
                onClick={() => setRemoveConfirmFriend(null)}
                disabled={!!removingFriendId}
              >
                Cancel
              </button>
              <button
                type="button"
                className="confirm-modal-btn confirm-modal-btn-delete"
                onClick={() => handleRemoveFrnd(removeConfirmFriend._id)}
                disabled={!!removingFriendId}
              >
                {removingFriendId === removeConfirmFriend._id ? 'Removing…' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="app-container">

        {/* ── SIDEBAR ── */}
        <div className="sidebar">
          <div className="sidebar-header">
            <div className="user-greeting">
              <span className="greeting-line">{getGreeting()}</span>
              <span className="username-line">{displayName} 👋</span>
            </div>
            {/* <div
              className="header-avatar"
              style={{ background: `hsl(${displayName.charCodeAt(0) * 137.5 % 360}, 65%, 45%)` }}
            >
              {displayName.charAt(0).toUpperCase()}
            </div> */}

            <button
              className="header-settings-btn"
              onClick={() => router.push('/settings')}
              title="Settings"
              aria-label="Settings"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </button>
          </div>

          <div className="sidebar-tabs">
            {(['chats', 'requests', 'discover'] as const).map(tab => (
              <button
                key={tab}
                className={`tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'requests' && pending.length > 0 && (
                  <span style={{
                    marginLeft: 6,
                    background: 'var(--green-primary)',
                    color: 'white',
                    borderRadius: 10,
                    padding: '1px 6px',
                    fontSize: 11,
                    fontWeight: 600
                  }}>{pending.length}</span>
                )}
              </button>
            ))}
          </div>

          <div className="search-container">
            <div className="search-wrapper">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                className="search-box"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="chat-list">
            {activeTab === 'chats' && (
              filteredFriends.length === 0 ? (
                <div className="empty-state">
                  <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  <div className="empty-text">No chats yet</div>
                  <div className="empty-sub">Discover people to start chatting</div>
                </div>
              ) : (
                filteredFriends.map((f) => (
                  <div
                    key={f._id}
                    className={`chat-item ${activeChat === f._id ? 'active' : ''}`}
                    onClick={() => openChat(f._id)}
                  >
                    <div className="avatar" style={{ background: `hsl(${f._id.charCodeAt(0) * 137.5 % 360}, 65%, 45%)` }}>
                      {f.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="chat-info">
                      <div className="chat-name">{f.username}</div>
                      <div className="chat-preview">Tap to chat</div>
                    </div>
                    <button
                      type="button"
                      className="chat-item-delete-btn"
                      onClick={(e) => { e.stopPropagation(); setRemoveConfirmFriend(f) }}
                      title="Remove friend"
                      aria-label="Remove friend"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </button>
                  </div>
                ))
              )
            )}

            {activeTab === 'requests' && (
              pending.length === 0 ? (
                <div className="empty-state">
                  <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  <div className="empty-text">No pending requests</div>
                </div>
              ) : (
                pending.map((p) => (
                  <div key={p._id} className="user-item">
                    <div className="avatar" style={{ background: `hsl(${(p.from?.username || '?').charCodeAt(0) * 137.5 % 360}, 65%, 45%)` }}>
                      {(p.from?.username || '?').charAt(0).toUpperCase()}
                    </div>
                    <div className="user-info">
                      <div className="user-name">{p.from?.username || 'Unknown'}</div>
                      <div className="user-sub">Wants to connect</div>
                    </div>
                    <div className="user-action">
                      <button className="btn-small btn-accept" onClick={() => handleRequest(p._id, 'Accepted')}>Accept</button>
                      <button className="btn-small btn-decline" onClick={() => handleRequest(p._id, 'Rejected')}>Decline</button>
                    </div>
                  </div>
                ))
              )
            )}

            {activeTab === 'discover' && (
              filteredUsers.length === 0 ? (
                <div className="empty-state">
                  <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                  <div className="empty-text">No users found</div>
                </div>
              ) : (
                filteredUsers.map((u) => (
                  <div key={u._id} className="user-item">
                    <div className="avatar" style={{ background: `hsl(${u._id.charCodeAt(0) * 137.5 % 360}, 65%, 45%)` }}>
                      {u.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-info">
                      <div className="user-name">{u.username}</div>
                      <div className="user-sub">ChatMe user</div>
                    </div>
                    <button className="btn-small btn-add" onClick={() => sendRequest(u._id)}>Add</button>
                  </div>
                ))
              )
            )}
          </div>
        </div>

        {/* ── CHAT AREA ── */}
        <div className="chat-area">
          {activeChat && activeFriend ? (
            <>
              <div className="chat-header">
                <div className="avatar" style={{ background: `hsl(${activeFriend._id.charCodeAt(0) * 137.5 % 360}, 65%, 45%)` }}>
                  {activeFriend.username.charAt(0).toUpperCase()}
                </div>
                <div className="chat-header-info">
                  <div className="chat-header-name">{activeFriend.username}</div>
                  <div className="chat-header-status">
                    <span className="status-dot" />
                    online
                  </div>
                </div>
              </div>

              <div className="chat-messages">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`message ${msg.senderId === userId ? 'sent' : 'received'}`}>
                    <div className="message-bubble">
                      <div className="message-text">{msg.text}</div>
                      <div className="message-meta">
                        <span className="message-time">
                          {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString('en-US', {
                            hour: 'numeric', minute: '2-digit', hour12: true
                          }).toLowerCase() : 'now'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="chat-input-container">
                <div className="chat-input-wrapper">
                  <textarea
                    ref={textareaRef}
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
                    <svg className="send-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405Z" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="no-chat">
              <div className="no-chat-card">
                <svg className="no-chat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <div className="no-chat-title">Your messages</div>
                <div className="no-chat-sub">Select a conversation to start chatting</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showToast && <div className="toast">{toast}</div>}
    </>
  )
}