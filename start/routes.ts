/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import ApolloServer from '@ioc:Zakodium/Apollo/Server'
import { request as graphql } from 'graphql-request'
import User from '../app/Models/User'

ApolloServer.applyMiddleware()

Route.get('/authorize', async ({ auth }) => {
  const user = await auth.use('api').authenticate()
  return JSON.stringify({
    user,
  })
})

Route.post('/signup', async ({ auth, request }) => {
  const email = request.input('email')
  const password = request.input('password')
  const confirmPassword = request.input('confirmPassword')
  if (password === confirmPassword) {
    if (!(await User.findBy('email', email))) {
      const user = await User.create({ email, password })
      const { token } = await auth.use('api').generate(user, { expiresIn: '1day' })
      const userWithAllData = await User.find(user.id)
      return JSON.stringify({
        user: userWithAllData,
        token,
      })
    } else return { errors: [{ message: 'Email is taken' }] }
  } else return { errors: [{ message: 'Passwords do not match' }] }
})

Route.post('/login', async ({ auth, request }) => {
  const email = request.input('email')
  const password = request.input('password')
  const result = await auth.use('api').attempt(email, password, { expiresIn: '1day' })
  const { user, token } = result
  if (user && token) {
    return JSON.stringify({
      user,
      token,
    })
  } else return { errors: [{ message: 'Invalid credentials' }] }
})

Route.get('/logout', async ({ auth }) => {
  const result = await auth.use('api').authenticate()
  if (typeof result?.id === 'number') {
    await auth.use('api').revoke()
    return JSON.stringify({
      token: 'revoked',
    })
  } else return { errors: [{ message: 'Failed to authenticate' }] }
})

Route.post('/api', async ({ auth, request }) => {
  const result = await auth.use('api').authenticate()
  const token = auth.use('api').token
  if (token && request.hasBody()) {
    const { query, variables } = request.body()
    const response = await graphql('http://localhost:3333/graphql', query, null, {
      Authorization: `Bearer ${token.tokenHash} ${token.userId}`,
    })
    return { data: JSON.stringify(response) }
  } else return { errors: [{ message: 'Failed to authenticate' }] }
})
