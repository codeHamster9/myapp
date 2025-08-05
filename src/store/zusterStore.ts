import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export type Person = {
  name: {
    firstName: string
    lastName: string
  }
  age: number
}

interface State {
  person: Person
}

interface Actions {
  updatePerson: (p: Person) => void
}

export const useZusterStore = create<State & Actions>()(
  persist(
    immer((set) => ({
      person: {
        name: {
          firstName: 'drone',
          lastName: 'clone',
        },
        age: 230,
      },
      updatePerson: (person: Person) => {
        set({ person })
      },
    })),
    {
      name: 'person-storage', // unique name for localStorage key
    },
  ),
)
