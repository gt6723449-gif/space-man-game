import { Html } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import { supabase } from './supabaseClient'

export default function GameRealtime({ started }) {
  const channelRef = useRef(null)
  const [popupMessage, setPopupMessage] = useState('')

  useEffect(() => {
    if (!started) return

    let sessionId = localStorage.getItem('gameSessionId')

    if (!sessionId) {
      sessionId =
        Date.now().toString() +
        '-' +
        Math.random().toString(36).substring(2)

      localStorage.setItem('gameSessionId', sessionId)
    }

    const channel = supabase.channel('space-game-room', {
      config: {
        presence: {
          key: sessionId
        }
      }
    })

    channel.on(
      'broadcast',
      { event: 'admin-message' },
      (payload) => {
        setPopupMessage(payload.payload.message)
      }
    )

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          sessionId,
          onlineAt: new Date().toISOString()
        })
      }
    })

    channelRef.current = channel

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [started])

  if (!popupMessage) return null

  return (
    <Html fullscreen>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'rgba(0,0,0,0.65)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
          pointerEvents: 'auto'
        }}
      >
        <div
          style={{
            background: '#111',
            color: 'white',
            border: '2px solid #4dff4d',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '320px',
            textAlign: 'center',
            fontFamily: 'Arial'
          }}
        >
          <h2 style={{ color: '#4dff4d' }}>
            Message
          </h2>

          <p>{popupMessage}</p>

          <button
            onClick={() => setPopupMessage('')}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: '1px solid #4dff4d',
              background: '#1a1a1a',
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            OK
          </button>
        </div>
      </div>
    </Html>
  )
}