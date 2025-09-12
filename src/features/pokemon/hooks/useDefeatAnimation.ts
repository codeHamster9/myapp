import { useState, useEffect } from 'react'

const defeatColors = [
  '#ff0000',
  '#00ff00',
  '#0000ff',
  '#ffff00',
  '#ff00ff',
  '#00ffff',
  '#ffa500',
]

export function useDefeatAnimation(isDefeated: boolean, clearDefeatState: (type: string) => void, type: string) {
  const [defeatColor, setDefeatColor] = useState('#ff0000')

  useEffect(() => {
    if (isDefeated) {
      let colorIndex = 0
      const colorInterval = setInterval(() => {
        setDefeatColor(defeatColors[colorIndex])
        colorIndex = (colorIndex + 1) % defeatColors.length
      }, 300)

      const clearTimer = setTimeout(() => {
        clearDefeatState(type)
      }, 5000)

      return () => {
        clearInterval(colorInterval)
        clearTimeout(clearTimer)
      }
    } else {
      setDefeatColor('#ff0000')
    }
  }, [isDefeated, type, clearDefeatState])

  return defeatColor
}