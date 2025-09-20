import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface ConfettiEffectProps {
  isVisible: boolean
  onComplete?: () => void
}

interface ConfettiPiece {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
  color: string
  size: number
  emoji?: string
}

const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8']
const emojis = ['🎉', '✨', '🌟', '💫', '🎊', '🥳']

export default function ConfettiEffect({ isVisible, onComplete }: ConfettiEffectProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    if (!isVisible) {
      setPieces([])
      return
    }

    // Create confetti pieces
    const newPieces: ConfettiPiece[] = []
    for (let i = 0; i < 50; i++) {
      newPieces.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -10,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        emoji: Math.random() < 0.3 ? emojis[Math.floor(Math.random() * emojis.length)] : undefined
      })
    }
    setPieces(newPieces)

    // Animation loop
    const animate = () => {
      setPieces(currentPieces =>
        currentPieces.map(piece => ({
          ...piece,
          x: piece.x + piece.vx,
          y: piece.y + piece.vy,
          rotation: piece.rotation + piece.rotationSpeed,
          vy: piece.vy + 0.1 // gravity
        })).filter(piece => piece.y < window.innerHeight + 50)
      )
    }

    const interval = setInterval(animate, 16) // ~60fps

    // Auto-complete after 3 seconds
    const timeout = setTimeout(() => {
      onComplete?.()
    }, 3000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [isVisible, onComplete])

  if (!isVisible || pieces.length === 0) return null

  return createPortal(
    <div className="fixed inset-0 pointer-events-none z-[10000] overflow-hidden">
      {pieces.map(piece => (
        <div
          key={piece.id}
          className="absolute"
          style={{
            left: piece.x,
            top: piece.y,
            transform: `rotate(${piece.rotation}deg)`,
            fontSize: piece.emoji ? `${piece.size * 2}px` : undefined
          }}
        >
          {piece.emoji ? (
            piece.emoji
          ) : (
            <div
              className="rounded-sm"
              style={{
                width: piece.size,
                height: piece.size,
                backgroundColor: piece.color
              }}
            />
          )}
        </div>
      ))}
    </div>,
    document.body
  )
}