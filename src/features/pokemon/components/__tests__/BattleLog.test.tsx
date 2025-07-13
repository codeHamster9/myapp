import { render, screen } from '@testing-library/react'
import { Provider, createStore } from 'jotai'
import { describe, it, expect } from 'vitest'

import { gameLogAtom } from '../../../../store/battleAtoms'
import BattleLog from '../BattleLog'

describe('BattleLog', () => {
  it('renders battle logs', () => {
    const mockLogs = ['Player 1 used tackle', 'Player 2 wins!']
    const store = createStore()
    store.set(gameLogAtom, mockLogs)

    render(
      <Provider store={store}>
        <BattleLog />
      </Provider>,
    )

    expect(screen.getByText('Battle Log')).toBeInTheDocument()
    expect(screen.getByText('Player 1 used tackle')).toBeInTheDocument()
    expect(screen.getByText('Player 2 wins!')).toHaveClass('text-green-600')
  })

  it('renders empty log', () => {
    const store = createStore()
    store.set(gameLogAtom, [])

    render(
      <Provider store={store}>
        <BattleLog />
      </Provider>,
    )

    expect(screen.getByText('Battle Log')).toBeInTheDocument()
  })
})
