import { useMemo, useRef, useState, useEffect } from 'react'
import { Text } from '@react-three/drei'

import Background from './Background'
import Player from './Player'
import Coin from './Coin'
import Meteor from './Meteor'
import UI from './UI'

function calculateMeteorCount(score) {
  let count = 4
  let required = 10
  let total = 0

  while (score >= total + required) {
    total += required
    count += 1
    required += 5
  }

  return count
}

export default function Game() {
  const playerRef = useRef()

  const [started, setStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [score, setScore] = useState(0)
  const [restartKey, setRestartKey] = useState(0)

  const meteorSpeedRef = useRef(0.08)

  const [meteors, setMeteors] = useState(
    Array.from({ length: 4 }).map((_, i) => ({
      id: i,
      x: Math.random() * 20 + 8,
      y: Math.random() * 9 - 4.5
    }))
  )

  const coins = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 18,
      y: Math.random() * 6 - 3
    }))
  }, [restartKey])

  useEffect(() => {
    if (score >= 100) {
      setWon(true)
      return
    }

    meteorSpeedRef.current =
      0.08 + Math.floor(score / 15) * 0.015

    const wantedMeteorCount = calculateMeteorCount(score)

    setMeteors((prev) => {
      if (prev.length >= wantedMeteorCount) return prev

      const newMeteors = Array.from({
        length: wantedMeteorCount - prev.length
      }).map((_, i) => ({
        id: prev.length + i,
        x: Math.random() * 20 + 8,
        y: Math.random() * 9 - 4.5
      }))

      return [...prev, ...newMeteors]
    })
  }, [score])

  const addScore = () => {
    setScore((prev) => {
      // first 10 coins
      if (prev < 1) {
        return +(prev + 0.1).toFixed(1)
      }

      // next 16 coins
      if (prev < 9) {
        return +(prev + 0.5).toFixed(1)
      }

      if (prev < 49) {
        return +(prev + 1).toFixed(1)
      }

      // after that
      return prev + 1
    })
  }

  const cashOut = () => {
    if (score <= 0) return
    setWon(true)
  }

  const playAgain = () => {
    setScore(0)
    setGameOver(false)
    setWon(false)
    setStarted(true)
    setRestartKey((prev) => prev + 1)

    meteorSpeedRef.current = 0.08

    setMeteors(
      Array.from({ length: 4 }).map((_, i) => ({
        id: i,
        x: Math.random() * 20 + 8,
        y: Math.random() * 9 - 4.5
      }))
    )

    if (playerRef.current) {
      playerRef.current.position.x = -2.5
      playerRef.current.position.y = 0
      playerRef.current.rotation.z = 0
    }
  }

  return (
    <>
      <Background started={started && !gameOver && !won} />

      {started && !gameOver && !won && (
        <Player
          playerRef={playerRef}
          started={started}
          gameOver={gameOver || won}
        />
      )}

      <Text
        position={[100, 100, 0]}
        fontSize={0.1}
        color="transparent"
      >
        +1$
      </Text>

      {started && !gameOver && !won && coins.map((coin) => (
        <Coin
          key={`${restartKey}-coin-${coin.id}`}
          position={[coin.x, coin.y, 0]}
          playerRef={playerRef}
          started={started}
          addScore={addScore}
          score={score}
        />
      ))}

      {started && !gameOver && !won && meteors.map((meteor) => (
        <Meteor
          key={`${restartKey}-meteor-${meteor.id}`}
          position={[meteor.x, meteor.y, 0]}
          playerRef={playerRef}
          started={started}
          gameOver={gameOver || won}
          speedRef={meteorSpeedRef}
          score={score}
          onCrash={() => setGameOver(true)}
        />
      ))}

      <UI
        started={started}
        setStarted={setStarted}
        gameOver={gameOver}
        won={won}
        restartGame={playAgain}
        score={score}
        cashOut={cashOut}
      />
    </>
  )
}