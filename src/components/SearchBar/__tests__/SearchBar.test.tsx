import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'jotai'
import { describe, it, expect } from 'vitest'

import SearchBar from '..'

describe('SearchBar', () => {
  it('renders with placeholder text', () => {
    render(
      <Provider>
        <SearchBar placeholder="Search experiences..." />
      </Provider>,
    )
    expect(
      screen.getByPlaceholderText('Search experiences...'),
    ).toBeInTheDocument()
  })

  it('updates search value on input', () => {
    render(
      <Provider>
        <SearchBar placeholder="Search experiences..." />
      </Provider>,
    )
    const input = screen.getByPlaceholderText('Search experiences...')

    fireEvent.change(input, { target: { value: 'new search' } })
    expect(input).toHaveValue('new search')
  })

  it('renders search icon', () => {
    render(
      <Provider>
        <SearchBar />
      </Provider>,
    )
    expect(screen.getByTestId('search')).toBeInTheDocument()
  })
})
