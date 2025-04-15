import React from 'react'
import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app'

test('Premier scénario : cas passant', async () => {
  render(<App />)
  expect(screen.getByText(/Welcome home/i)).toBeInTheDocument()
  expect(screen.getByText(/Fill out the form/i)).toBeInTheDocument()

  userEvent.click(screen.getByText(/Fill out the form/i))

  await waitFor(() => {
    expect(screen.getByText(/Page 1/i)).toBeInTheDocument()
  })

  expect(screen.getByText(/Go Home/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/Favorite Food/i)).toBeInTheDocument()

  userEvent.type(screen.getByLabelText(/Favorite Food/i), 'Les pâtes')
})
