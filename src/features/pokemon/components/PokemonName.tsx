interface PokemonNameProps {
  name: string;
}
export function PokemonName({ name }: PokemonNameProps) {
  return (
    <h2 className="text-xl capitalize text-center font-semibold text-gray-800">
      {name}
    </h2>
  );
}