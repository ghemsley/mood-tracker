import request, { gql } from 'graphql-request'
import constants from '../constants'
import { Day, DayObject } from '../models/day'
import { User, UserObject } from '../models/user'

export type ErrorType = {
  errors: { message: string }[]
}

export type DaysType = {
  day?: DayObject
  days?: DayObject[]
}

export type AuthenticationType = {
  user: UserObject
  token: string
}

const helpers = {
  setToken: (token: string): void => {
    console.log('setting new token', token)
    localStorage.setItem('token', token)
  },

  getToken: (): string | null => {
    return localStorage.getItem('token')
  },
  deleteToken: (): void => {
    localStorage.removeItem('token')
  },
  auth: (): Headers => new Headers({ Authorization: `Bearer ${helpers.getToken()}` }),
  fetcher: (
    url: string,
    method: 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE',
    auth: boolean,
    body?: Record<string, any> | undefined
  ): Promise<any> => {
    const token = auth ? helpers.getToken() : null
    return fetch(constants.API + url, {
      method,
      mode: 'cors',
      headers:
        auth && token
          ? new Headers({
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            })
          : new Headers({
              'Content-Type': 'application/json',
            }),
      body: body ? JSON.stringify(body) : undefined,
    })
      .then(response => response.json())
      .catch(error => error)
  },
  queryGraphQL: (
    queryType: 'day' | 'days' | 'user' | 'users',
    fields?: string[],
    args?: DayObject | UserObject
  ): Promise<any> => {
    const stringifyArgs = () => {
      if (args) {
        const array = []
        for (const [key, value] of Object.entries(args)) {
          array.push(`${key}: ${typeof value === 'string' ? '"' + value + '"' : value}`)
        }
        return `(${array.join(', ')})`
      } else return ''
    }

    const generateQueryFields = () =>
      fields
        ? fields.join('\n')
        : `${Object.entries(
            queryType === 'day' || queryType === 'days' ? new Day({}) : new User({})
          )
            .map(([key, value]) => (typeof value !== 'function' ? key : null))
            .filter(element => element !== null)
            .join('\n')}`

    const query = gql`
      query {
        ${queryType}${stringifyArgs()} {
          ${generateQueryFields()}
        }
      }`

    return request(constants.API + '/api', query, undefined, helpers.auth())
      .then(response => JSON.parse(response))
      .catch(error => error)
  },
  mutateGraphQL: (
    mutationType: 'addDay' | 'addUser',
    args: DayObject | UserObject
  ): Promise<any> => {
    const stringifyArgs = () => {
      if (args) {
        const array = []
        for (const [key, value] of Object.entries(args)) {
          array.push(`${key}: ${typeof value === 'string' ? '"' + value + '"' : value}`)
        }
        return `(${array.join(', ')})`
      } else return ''
    }

    const argsToMutationFields = () => {
      return Object.keys(args).join('\n')
    }

    const mutation = gql`
      mutation {
        ${mutationType}${stringifyArgs()} {
          ${argsToMutationFields()}
        }
      }`

    return request(constants.API + '/api', mutation, undefined, helpers.auth())
      .then(response => JSON.parse(response))
      .catch(error => error)
  },
}

export default helpers
