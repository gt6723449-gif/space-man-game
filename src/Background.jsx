import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
export default function Background({ started }) {
  const texture = useTexture('/images/space.png')
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(3, 1)
  useFrame(() => {
    if (!started) return
    texture.offset.x += 0.002
  })
  return (
    <mesh position={[0, 0, -5]}>
      <planeGeometry args={[30, 20]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  )
}