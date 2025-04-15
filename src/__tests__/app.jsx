import React from 'react'
import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app'
import {server} from '../../tests/server'
import {rest} from 'msw'

beforeEach(() => {
  server.use(
    rest.post('/form', (req, res, ctx) => {
      if (!req.body.food || !req.body.drink) {
        return res(
          ctx.status(400),
          ctx.json({
            message: 'les champs food et drink sont obligatoires',
          }),
        )
      }
      return res(ctx.status(200), ctx.json({data: req.body}))
    }),
  )
})

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

  expect(screen.getByText(/Go Back/i)).toBeInTheDocument()
  const confirmButton = screen.getByRole('button', {name: 'Confirm'})
  expect(confirmButton).toBeInTheDocument()

  userEvent.click(confirmButton)

  await waitFor(() => {
    expect(screen.getByText(/Congrats. You did it./i)).toBeInTheDocument()
  })

  expect(screen.getByText(/Go home/i)).toBeInTheDocument()
  userEvent.click(screen.getByText(/Go home/i))

  await waitFor(() => {
    expect(screen.getByText(/Welcome home/i)).toBeInTheDocument()
  })
})

test('Second scénario : cas non passant', async () => {
  render(<App />)
  expect(screen.getByText(/Welcome home/i)).toBeInTheDocument()
  expect(screen.getByText(/Fill out the form/i)).toBeInTheDocument()

  userEvent.click(screen.getByText(/Fill out the form/i))

  await waitFor(() => {
    expect(screen.getByText(/Page 1/i)).toBeInTheDocument()
  })

  expect(screen.getByText(/Go Home/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/Favorite Food/i)).toBeInTheDocument()

  userEvent.type(screen.getByLabelText(/Favorite Food/i), '')

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

  expect(screen.getByLabelText('Favorite Food')).toHaveTextContent('')
  expect(screen.getByLabelText('Favorite Drink')).toHaveTextContent('Bière')

  expect(screen.getByText(/Go Back/i)).toBeInTheDocument()
  const confirmButton = screen.getByRole('button', {name: 'Confirm'})
  expect(confirmButton).toBeInTheDocument()

  userEvent.click(confirmButton)

  await waitFor(() => {
    expect(screen.getByText(/Oh no. There was an error./i)).toBeInTheDocument()
  })

  expect(
    screen.getByText(/les champs food et drink sont obligatoires/i),
  ).toBeInTheDocument()

  expect(screen.getByText(/Go Home/i)).toBeInTheDocument()
  expect(screen.getByText(/Try again/i)).toBeInTheDocument()
})
