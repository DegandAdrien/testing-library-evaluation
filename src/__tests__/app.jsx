import React from 'react'
import {render, screen} from '@testing-library/react'
import App from '../app'

test('Premier scénario : cas passant', () => {
  render(<App />)
  expect(screen.getByText(/Welcome home/i)).toBeInTheDocument()
  expect(screen.getByText(/Fill out the form/i)).toBeInTheDocument()
})
