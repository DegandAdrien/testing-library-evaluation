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
  // 1 - 2 - 3
  render(<App />)
  expect(screen.getByText(/Welcome home/i)).toBeInTheDocument()
  expect(screen.getByText(/Fill out the form/i)).toBeInTheDocument()

  // 4
  userEvent.click(screen.getByText(/Fill out the form/i))

  // 5 - 6
  await waitFor(() => {
    expect(screen.getByText(/Page 1/i)).toBeInTheDocument()
  })

  // 7 - 8
  expect(screen.getByText(/Go Home/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/Favorite Food/i)).toBeInTheDocument()

  // 9
  userEvent.type(screen.getByLabelText(/Favorite Food/i), 'Les pâtes')

  // 10 - 11
  expect(screen.getByText(/Next/i)).toBeInTheDocument()
  userEvent.click(screen.getByText(/Next/i))

  // 12 - 13
  await waitFor(() => {
    expect(screen.getByText(/Page 2/i)).toBeInTheDocument()
  })

  // 14 - 15
  expect(screen.getByText(/Go Back/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/Favorite Drink/i)).toBeInTheDocument()

  // 16
  userEvent.type(screen.getByLabelText(/Favorite Drink/i), 'Bière')

  // 17 - 18
  expect(screen.getByText(/Review/i)).toBeInTheDocument()
  userEvent.click(screen.getByText(/Review/i))

  // 19 - 20
  await waitFor(() => {
    expect(screen.getByRole('heading', {name: 'Confirm'})).toBeInTheDocument()
  })

  // 21
  expect(screen.getByText(/Please confirm your choices/i)).toBeInTheDocument()

  // 22 - 23
  expect(screen.getByLabelText('Favorite Food')).toHaveTextContent('Les pâtes')
  expect(screen.getByLabelText('Favorite Drink')).toHaveTextContent('Bière')

  // 24 - 25
  expect(screen.getByText(/Go Back/i)).toBeInTheDocument()
  const confirmButton = screen.getByRole('button', {name: 'Confirm'})
  expect(confirmButton).toBeInTheDocument()

  // 26
  userEvent.click(confirmButton)

  // 27 - 28
  await waitFor(() => {
    expect(screen.getByText(/Congrats. You did it./i)).toBeInTheDocument()
  })

  // 29 - 30
  expect(screen.getByText(/Go home/i)).toBeInTheDocument()
  userEvent.click(screen.getByText(/Go home/i))

  // 31 - 32
  await waitFor(() => {
    expect(screen.getByText(/Welcome home/i)).toBeInTheDocument()
  })
})

test('Second scénario : cas non passant', async () => {
  // 1 - 2 - 3
  render(<App />)
  expect(screen.getByText(/Welcome home/i)).toBeInTheDocument()
  expect(screen.getByText(/Fill out the form/i)).toBeInTheDocument()

  // 4
  userEvent.click(screen.getByText(/Fill out the form/i))

  // 5 - 6
  await waitFor(() => {
    expect(screen.getByText(/Page 1/i)).toBeInTheDocument()
  })

  // 7 - 8
  expect(screen.getByText(/Go Home/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/Favorite Food/i)).toBeInTheDocument()

  // 9 modifié
  userEvent.type(screen.getByLabelText(/Favorite Food/i), '')

  // 10 - 11
  expect(screen.getByText(/Next/i)).toBeInTheDocument()
  userEvent.click(screen.getByText(/Next/i))

  // 12 - 13
  await waitFor(() => {
    expect(screen.getByText(/Page 2/i)).toBeInTheDocument()
  })

  // 14 - 15
  expect(screen.getByText(/Go Back/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/Favorite Drink/i)).toBeInTheDocument()

  // 16
  userEvent.type(screen.getByLabelText(/Favorite Drink/i), 'Bière')

  // 17 - 18
  expect(screen.getByText(/Review/i)).toBeInTheDocument()
  userEvent.click(screen.getByText(/Review/i))

  // 19 - 20
  await waitFor(() => {
    expect(screen.getByRole('heading', {name: 'Confirm'})).toBeInTheDocument()
  })

  // 21
  expect(screen.getByText(/Please confirm your choices/i)).toBeInTheDocument()

  // 22 - 23
  expect(screen.getByLabelText('Favorite Food')).toHaveTextContent('')
  expect(screen.getByLabelText('Favorite Drink')).toHaveTextContent('Bière')

  // 24 - 25
  expect(screen.getByText(/Go Back/i)).toBeInTheDocument()
  const confirmButton = screen.getByRole('button', {name: 'Confirm'})
  expect(confirmButton).toBeInTheDocument()

  // 26
  userEvent.click(confirmButton)

  // 27 - 28
  await waitFor(() => {
    expect(screen.getByText(/Oh no. There was an error./i)).toBeInTheDocument()
  })

  // 29
  expect(
    screen.getByText(/les champs food et drink sont obligatoires/i),
  ).toBeInTheDocument()

  // 30 - 31
  expect(screen.getByText(/Go Home/i)).toBeInTheDocument()
  expect(screen.getByText(/Try again/i)).toBeInTheDocument()

  // 32
  userEvent.click(screen.getByText(/Try again/i))

  // 33 - 34
  await waitFor(() => {
    expect(screen.getByText(/Page 1/i)).toBeInTheDocument()
  })
})
