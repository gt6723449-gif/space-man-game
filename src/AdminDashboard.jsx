import { useEffect, useRef, useState } from 'react'
import { supabase } from './supabaseClient'

const ADMIN_EMAIL = 'gt6723449@gmail.com'

export default function AdminDashboard() {
  const channelRef = useRef(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [liveCount, setLiveCount] = useState(0)
  const [message, setMessage] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  useEffect(() => {
    if (!user) return
    if (user.email !== ADMIN_EMAIL) return

    const channel = supabase.channel('space-game-room')

    channel.on('presence', {
      event: 'sync'
    }, () => {
      const state = channel.presenceState()
      const count = Object.keys(state).length
      setLiveCount(count)
    })

    channel.subscribe()

    channelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const login = async () => {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password
      })

    if (error) {
      alert(error.message)
      return
    }

    setUser(data.user)
  }

  const sendMessage = async () => {
    if (!message.trim()) return

    const channel = channelRef.current

    if (!channel) return

    await channel.send({
      type: 'broadcast',
      event: 'admin-message',
      payload: {
        message
      }
    })

    setMessage('')
  }

  if (!user) {
    return (
      <div style={pageStyle}>
        <h1>Admin Login</h1>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button onClick={login} style={buttonStyle}>
          Login
        </button>
      </div>
    )
  }

  if (user.email !== ADMIN_EMAIL) {
    return (
      <div style={pageStyle}>
        <h1>Access denied</h1>
      </div>
    )
  }

  return (
    <div style={pageStyle}>
      <h1>Game Dashboard</h1>

      <h2 style={{ color: '#4dff4d' }}>
        Live players: {liveCount}
      </h2>

      <textarea
        placeholder="Type message to players"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{
          ...inputStyle,
          height: '120px'
        }}
      />

      <button onClick={sendMessage} style={buttonStyle}>
        Send Message
      </button>
    </div>
  )
}

const pageStyle = {
  minHeight: '100vh',
  background: '#050505',
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '14px',
  fontFamily: 'Arial',
  padding: '20px'
}

const inputStyle = {
  width: '280px',
  maxWidth: '90vw',
  padding: '12px',
  borderRadius: '10px',
  border: '1px solid #4dff4d',
  background: '#111',
  color: 'white',
  fontSize: '16px'
}

const buttonStyle = {
  padding: '12px 24px',
  borderRadius: '10px',
  border: '1px solid #4dff4d',
  background: '#1a1a1a',
  color: 'white',
  fontWeight: 'bold',
  cursor: 'pointer'
}