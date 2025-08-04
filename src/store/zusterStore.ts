import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Person = {
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
    (set) => ({
      person: {
        name: {
          firstName: '',
          lastName: '',
        },
        age: 0,
      },
      updatePerson: (person: Person) => {
        set({ person })
      },
    }),
    {
      name: 'person-storage', // unique name for localStorage key
    },
  ),
)
