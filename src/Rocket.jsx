import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { useTexture } from '@react-three/drei'

export default function Rocket({
  playerRef,
  started,
  gameOver,
  onCrash,
  speedRef
}) {
  const texture = useTexture('/images/rocket.png')
  const ref = useRef()

  const active = useRef(false)
  const timer = useRef(Math.random() * 2 + 2)

  const targetY = useRef(Math.random() * 6 - 3)

  const smoothness = useRef(Math.random() * 0.025 + 0.02)
  const nextChangeTimer = useRef(Math.random() * 1.5 + 0.5)
  const rotationPower = useRef(Math.random() * 0.12 + 0.1)

  function spawnRocket() {
    const rocket = ref.current

    rocket.position.x = 10 + Math.random() * 4
    rocket.position.y = Math.random() * 6 - 3
    rocket.visible = true

    targetY.current = Math.random() * 6 - 3
    smoothness.current = Math.random() * 0.025 + 0.02
    rotationPower.current = Math.random() * 0.12 + 0.1
    nextChangeTimer.current = Math.random() * 1.5 + 0.5

    active.current = true
  }

  useFrame((state, delta) => {
    if (!started || gameOver) return

    const rocket = ref.current
    const player = playerRef.current

    if (!rocket || !player) return

    if (!active.current) {
      rocket.visible = false
      timer.current -= delta

      if (timer.current <= 0) {
        spawnRocket()
      }

      return
    }

    rocket.position.x -= speedRef.current

    nextChangeTimer.current -= delta

    if (nextChangeTimer.current <= 0) {
      targetY.current = Math.random() * 6 - 3
      nextChangeTimer.current = Math.random() * 1.5 + 0.5
    }

    rocket.position.y +=
      (targetY.current - rocket.position.y) * smoothness.current

    const direction = targetY.current - rocket.position.y

    rocket.rotation.z = direction * -rotationPower.current

    if (rocket.position.y > 3.5) {
      rocket.position.y = 3.5
      targetY.current = Math.random() * 2 - 3
    }

    if (rocket.position.y < -3.5) {
      rocket.position.y = -3.5
      targetY.current = Math.random() * 2 + 1
    }

    if (rocket.position.x < -10) {
      active.current = false
      rocket.visible = false
      timer.current = Math.random() * 2 + 2
    }

    const dx = Math.abs(rocket.position.x - player.position.x)
    const dy = Math.abs(rocket.position.y - player.position.y)

    if (dx < 0.6 && dy < 0.55) {
      onCrash()
    }
  })

  return (
    <mesh ref={ref} position={[10, 0, 0]} visible={false}>
      <planeGeometry args={[1.2, 0.9]} />

      <meshBasicMaterial
        map={texture}
        transparent={true}
        alphaTest={0.5}
      />
    </mesh>
  )
}