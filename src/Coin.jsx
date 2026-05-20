import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { Text, useTexture } from '@react-three/drei'
import { getDeviceType } from './device'

export default function Coin({
  position,
  playerRef,
  started,
  addScore,
  score
}) {
  const ref = useRef()

  const texture = useTexture('/images/coin.png')

  const [collected, setCollected] = useState(false)

  const device = getDeviceType()

  useFrame(() => {
    if (!started) return

    const coin = ref.current
    const player = playerRef.current

    if (!coin || !player) return

    // NORMAL MOVEMENT
    if (!collected) {
      coin.position.x -= 0.07

      if (coin.position.x < -10) {
        coin.position.x = 10
        coin.position.y =
          Math.random() * 9 - 4.5

        coin.visible = true
        setCollected(false)
      }

      if (!coin.visible) return

      const dx = Math.abs(
        coin.position.x - player.position.x
      )

      const dy = Math.abs(
        coin.position.y - player.position.y
      )

      if (dx < 0.5 && dy < 0.5) {
        addScore()
        setCollected(true)
      }
    }

    // +1 FLY TO BAR
    else {
      coin.position.x +=
        device === 'phone' ? (1 - coin.position.x) * 0.08
          : (8 - coin.position.x) * 0.08

      coin.position.y +=
        device === 'phone' ? (5 - coin.position.y) * 0.08
          : (3.75 - coin.position.y) * 0.08

      coin.scale.x *= 0.97
      coin.scale.y *= 0.97

      const dx =
        device === 'phone' ? Math.abs(coin.position.x - 1)
          : Math.abs(coin.position.x - 8)

      const dy =
        device === 'phone' ? Math.abs(coin.position.y - 5)
          : Math.abs(coin.position.y - 3.75)

      if (dx < 0.6 && dy < 0.25) {

        coin.position.x = 10
        coin.position.y =
          Math.random() * 9 - 4.5

        coin.scale.set(1, 1, 1)

        setCollected(false)
      }
    }
  })

  const coinWidth =
    device === 'phone' ? 0.4 : 0.6

  const coinHeight =
    device === 'phone' ? 0.55 : 0.75

  let coinText = '+2$'

  if (score < 1) {
    coinText = '+0.1$'
  } else if (score < 9) {
    coinText = '+0.5$'
  } else if (score <49) {
    coinText = '+1$'
  }

  return (
    <group ref={ref} position={position}>

      {!collected && (
        <mesh>
          <planeGeometry args={[coinWidth, coinHeight]} />

          <meshBasicMaterial
            map={texture}
            transparent={true}
          />
        </mesh>
      )}

      {collected && (
        <Text
          fontSize={0.4}
          color="lime"
          anchorX="center"
          anchorY="middle"
        >
          {coinText}
        </Text>
      )}

    </group>
  )
}