import React, { memo, useEffect, useState } from 'react'

interface Props {}

const Index: React.FC<Props> = memo(() => {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const pokemonImages = [
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png',
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png',
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/144.png',
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png',
  ]

  return (
    <div className="min-h-[200vh] relative overflow-hidden">
      <div className="fixed inset-0 opacity-80">
        {pokemonImages.map((src, index) => (
          <img
            key={index}
            src={src}
            alt="Pokemon"
            className="absolute w-96 h-96 object-contain"
            style={{
              left: `${index % 3 === 0 ? 5 : index % 3 === 1 ? 40 : 75}%`,
              top: `${Math.floor(index / 3) * 35 + 10}%`,
              transform: `translateY(${scrollY * (0.3 + index * 0.2)}px) rotate(${scrollY * 0.1}deg)`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <h1 className="text-8xl font-bold text-center bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent animate-pulse hover:scale-110 transition-transform duration-300 cursor-pointer select-none">
          Pokemon Battles
        </h1>
      </div>
    </div>
  )
})
Index.displayName = 'Index'

export default Index
