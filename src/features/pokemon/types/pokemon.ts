export interface Pokemon {
  id: number
  name: string
  weight: string
  sprites: {
    front_default: string
  }
  stats: Array<{
    base_stat: number
    stat: { name: string }
  }>
  moves: Array<{
    move: {
      name: string
      url: string
    }
  }>
  // offeredMoves: Array<{
  //   move: {
  //     name: string
  //     url: string
  //   }
  // }>
}

export interface Move {
  name: string
  power: number
  accuracy: number
  pp: number
  type: {
    name: string
  }
}
