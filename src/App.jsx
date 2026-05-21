import { Canvas } from '@react-three/fiber'
import Game from './Game'
import AdminDashboard from './AdminDashboard'
import './index.css'

export default function App() {
  const isAdminPage =
    window.location.pathname === '/admin'

  if (isAdminPage) {
    return <AdminDashboard />
  }

  return (
    <Canvas
      camera={{
        position: [0, 0, 8],
        fov: 50
      }}
    >
      <ambientLight intensity={2} />
      <Game />
    </Canvas>
  )
}