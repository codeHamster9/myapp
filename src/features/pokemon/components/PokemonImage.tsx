interface PokemonImageProps {
  src: string
  alt: string
}
export function PokemonImage({ src, alt }: PokemonImageProps) {
  return <img src={src} alt={alt} className="w-32 h-32 mx-auto" />
}
