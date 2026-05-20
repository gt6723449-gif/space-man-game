import { Canvas } from '@react-three/fiber'
import Game from './Game'
import './index.css'

export default function App() {
  return (
    <>
      {/* <div className="rotate-warning">
        Please rotate your phone back to portrait mode.
      </div> */}

      <Canvas
        orthographic
        camera={{
          zoom: 70,
          position: [0, 0, 10]
        }}
      >
        <ambientLight intensity={2} />
        <Game />
      </Canvas>
    </>
  )
}