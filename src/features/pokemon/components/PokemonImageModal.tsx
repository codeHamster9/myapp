import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useMemo, useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface PokemonImageModalProps {
  sprites: any
  pokemonName: string
  children: React.ReactNode
}

export function PokemonImageModal({
  sprites,
  pokemonName,
  children,
}: PokemonImageModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const images = useMemo(() => {
    if (!sprites) return []
    return Object.entries(sprites)
      .filter(([_, url]) => url && typeof url === 'string')
      .map(([key, url]) => ({ key, url: url as string }))
  }, [sprites])

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="capitalize">
            {pokemonName} Sprites
          </DialogTitle>
        </DialogHeader>
        {images.length > 0 && (
          <div className="relative">
            <img
              src={images[currentIndex]?.url}
              alt={`${pokemonName} ${images[currentIndex]?.key}`}
              className="w-full h-64 object-contain"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="text-center mt-2 text-sm text-gray-600">
                  {currentIndex + 1} / {images.length} -{' '}
                  {images[currentIndex]?.key.replace('_', ' ')}
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
