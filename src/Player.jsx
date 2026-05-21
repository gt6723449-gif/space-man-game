import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { useTexture } from '@react-three/drei'
import { getDeviceType } from './device'

export default function Player({
  playerRef,
  started,
  gameOver
}) {
  const texture = useTexture('/images/spaceMan.png')

  const keys = useRef({
    up: false,
    down: false
  })

  const touch = useRef({
    active: false,
    lastY: 0,
    deltaY: 0
  })

  useEffect(() => {
    const keyDown = (e) => {
      if (e.key === 'ArrowUp') keys.current.up = true
      if (e.key === 'ArrowDown') keys.current.down = true
    }

    const keyUp = (e) => {
      if (e.key === 'ArrowUp') keys.current.up = false
      if (e.key === 'ArrowDown') keys.current.down = false
    }

    const getY = (clientY) => {
      const normalizedY = 1 - (clientY / window.innerHeight) * 2
      return normalizedY * 3.5
    }

    const pointerDown = (e) => {
      if (!started || gameOver) return
      if (e.target.closest('button')) return
      if (e.target.closest('input')) return

      touch.current.active = true
      touch.current.lastY = e.clientY
      touch.current.deltaY = 0
    }

    const pointerMove = (e) => {
      if (!started || gameOver) return
      if (!touch.current.active) return

      touch.current.deltaY =
        e.clientY - touch.current.lastY

      touch.current.lastY = e.clientY
    }

    const pointerUp = () => {
      touch.current.active = false
      touch.current.deltaY = 0
    }

    window.addEventListener('keydown', keyDown)
    window.addEventListener('keyup', keyUp)

    window.addEventListener('pointerdown', pointerDown)
    window.addEventListener('pointermove', pointerMove)
    window.addEventListener('pointerup', pointerUp)

    return () => {
      window.removeEventListener('keydown', keyDown)
      window.removeEventListener('keyup', keyUp)

      window.removeEventListener('pointerdown', pointerDown)
      window.removeEventListener('pointermove', pointerMove)
      window.removeEventListener('pointerup', pointerUp)
    }
  }, [started, gameOver])

  useFrame(() => {
    if (!started || gameOver) return

    const player = playerRef.current
    if (!player) return

    player.position.x = -2.5

    if (touch.current.active) {
      const isPhone = window.innerWidth <= 768

      const moveAmount =
        -touch.current.deltaY * (isPhone ? 0.014 : 0.012)

      player.position.y += moveAmount

      if (moveAmount > 0.01) {
        player.rotation.z = 0.5
      } else if (moveAmount < -0.01) {
        player.rotation.z = -0.5
      } else {
        player.rotation.z *= 0.9
      }

      touch.current.deltaY = 0
    } else if (keys.current.up) {
      player.position.y += 0.08
      player.rotation.z = 0.5
    } else if (keys.current.down) {
      player.position.y -= 0.08
      player.rotation.z = -0.5
    } else {
      player.rotation.z *= 0.9
    }

    if (player.position.y > 5) {
      player.position.y = 5
    }

    if (player.position.y < -5) {
      player.position.y = -5
    }
  })

  const device = getDeviceType()

  const playerWidth =
    device === 'phone' ? 1.5 :  1.75

  const playerHeight =
    device === 'phone' ? 1 :  1.25

  const playerPosition = 
    device === 'phone' ? -2.5 : -7.5

  return (
    <mesh ref={playerRef} position={[playerPosition, 0, 0]}>
      <planeGeometry args={[playerWidth, playerHeight]} />

      <meshBasicMaterial
        map={texture}
        transparent={true}
        alphaTest={0.5}
      />
    </mesh>
  )
}