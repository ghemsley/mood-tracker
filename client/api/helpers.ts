import request, { gql } from 'graphql-request'

const helpers = {
  setToken: (token: string) => {
    localStorage.setItem('token', token)
  },

  getToken: () => {
    return localStorage.getItem('token')
  },
  deleteToken: () => {
    localStorage.removeItem('token')
  },
  stringifyArgs: (args: any) => {
    if (args) {
      const array = []
      for (const [key, value] of Object.entries(args)) {
        array.push(`${key}: ${typeof value === 'string' ? '"' + value + '"' : value}`)
      }
      return `(${array.join(', ')})`
    } else return ''
  },
  auth: () => new Headers({ Authorization: `Bearer ${helpers.getToken()}` }),
}

export default helpers
