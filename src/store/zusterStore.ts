import { create } from 'zustand'

interface State {
  name: string
}

interface Actions {
  setName: (name: string) => void
}

export const useZusterStore = create<State & Actions>((set) => ({
  name: 'idan',
  setName: (name: string) => {
    set({ name })
  },
}))
