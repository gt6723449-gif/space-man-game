import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { useTexture } from '@react-three/drei'
import { getDeviceType } from './device'

export default function Meteor({
  position,
  playerRef,
  started,
  gameOver,
  onCrash,
  speedRef,
  score
}) {
  const ref = useRef()
  const texture = useTexture('/images/meteor.png')

  const spinSpeed = useRef(Math.random() * 0.08 + 0.04)

  const size = useRef(1.2)

  useFrame(() => {
    if (!started || gameOver) return

    const meteor = ref.current
    const player = playerRef.current

    if (!meteor || !player) return

    meteor.position.x -= speedRef.current
    meteor.rotation.z += spinSpeed.current

    if (score >= 30) {
      meteor.scale.set(size.current, size.current, 1)
    }

    if (meteor.position.x < -10) {
      meteor.position.x = Math.random() * 8 + 10
      meteor.position.y = Math.random() * 9 - 4.5

      spinSpeed.current = Math.random() * 0.08 + 0.04

      if (score >= 30) {
        size.current = Math.random() * 0.7 + 0.8
        meteor.scale.set(size.current, size.current, 1)
      }

      meteor.visible = true
    }

    const dx = Math.abs(meteor.position.x - player.position.x)
    const dy = Math.abs(meteor.position.y - player.position.y)

    if (dx < 0.35 * size.current && dy < 0.5 * size.current) {
      onCrash()
    }
  })

  const device = getDeviceType()
  
    const meteorWidth =
      device === 'phone' ? 0.4 : 0.6
  
    const meteorHeight =
      device === 'phone' ? 0.4 :  0.6

  return (
    <mesh ref={ref} position={position}>
      <planeGeometry args={[meteorWidth, meteorHeight]} />

      <meshBasicMaterial
        map={texture}
        transparent={true}
        alphaTest={0.5}
      />
    </mesh>
  )
}