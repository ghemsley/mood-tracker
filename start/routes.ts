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
import axios from 'axios'
import { request as graphql } from 'graphql-request'

ApolloServer.applyMiddleware()

Route.post('/login', async ({ auth, request }) => {
  const email = request.input('email')
  const password = request.input('password')

  const result = await auth.use('api').attempt(email, password)
  const { user, token } = result
  return JSON.stringify({
    user,
    token,
  })
})

Route.get('/logout', async ({ auth, request }) => {
  const result = await auth.use('api').authenticate()
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
  } else return { error: 'something went wrong' }
})
