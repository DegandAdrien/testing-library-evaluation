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

  expect(screen.getByText(/Next/i)).toBeInTheDocument()
  userEvent.click(screen.getByText(/Next/i))

  await waitFor(() => {
    expect(screen.getByText(/Page 2/i)).toBeInTheDocument()
  })

  expect(screen.getByText(/Go Back/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/Favorite Drink/i)).toBeInTheDocument()

  userEvent.type(screen.getByLabelText(/Favorite Drink/i), 'Bière')

  expect(screen.getByText(/Review/i)).toBeInTheDocument()
  userEvent.click(screen.getByText(/Review/i))

  await waitFor(() => {
    expect(screen.getByRole('heading', {name: 'Confirm'})).toBeInTheDocument()
  })

  expect(screen.getByText(/Please confirm your choices/i)).toBeInTheDocument()

  expect(screen.getByLabelText('Favorite Food')).toHaveTextContent('Les pâtes')
  expect(screen.getByLabelText('Favorite Drink')).toHaveTextContent('Bière')
})
