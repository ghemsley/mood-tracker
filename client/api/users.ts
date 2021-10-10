import { GraphQLClient, request, gql } from 'graphql-request'
import useSWR from 'swr'
import constants from '../constants'

const setToken = (token: string) => {
  localStorage.setItem('token', token)
}

const getToken = () => {
  return localStorage.getItem('token')
}

const userHooks = {
  useFetchUserById: (id: number, start: boolean): { data: any; error: any; loading: boolean } => {
    const token = getToken()
    const fetchUserById = (url: string) => {
      return request(
        url,
        gql`
          {
            user(id: ${id}) {
              id
              email
              admin
              createdAt
              updatedAt
            }
          }
        `,
        null,
        new Headers({ Authorization: `Bearer ${token}` })
      )
    }
    const { data, error } = useSWR(start ? constants.API + '/api' : null, fetchUserById)
    return {
      data: data,
      error: error,
      loading: !error && !data,
    }
  },
  useFetchUserByEmail: (
    email: string,
    start: boolean
  ): { data: any; error: any; loading: boolean } => {
    const fetchUserByEmail = (url: string) => {
      return request(
        url,
        `{
        user(email: "${email}") {
          id
          email
          admin
          createdAt
          updatedAt
        }
      }`
      )
    }
    const { data, error } = useSWR(start ? constants.API + '/api' : null, fetchUserByEmail)
    return {
      data: data,
      error: error,
      loading: !error && !data,
    }
  },
  useFetchUsers: (
    args?: {
      id?: number
      email?: string
      admin?: boolean
      createdAt?: number
      updatedAt?: number
    },
    start?: boolean
  ): { data: any; error: any; loading: boolean } => {
    const stringifyArgs = () => {
      if (args) {
        const array = []
        for (const [key, value] of Object.entries(args)) {
          array.push(`${key}: ${typeof value === 'string' ? '"' + value + '"' : value}`)
        }
        return `(${array.join(', ')})`
      } else return ''
    }
    const fetchUsers = (url: string) => {
      return request(
        url,
        `{
        users${stringifyArgs()} {
          id
          email
          admin
          createdAt
          updatedAt
        }
      }`
      )
    }
    const { data, error } = useSWR(start ? constants.API + '/api' : null, fetchUsers)
    return {
      data: data,
      error: error,
      loading: !error && !data,
    }
  },
  useLoginUser: (
    email: string,
    password: string,
    start: boolean
  ): { data: any; error: any; loading: boolean } => {
    const loginUser = (url: string) =>
      fetch(url, {
        method: 'POST',
        redirect: 'follow',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      }).then((response) => response.json())
    const { data, error } = useSWR(start ? constants.API + '/login' : null, loginUser)
    data && data.token && setToken(data.token)
    return {
      data: data,
      error: error,
      loading: !error && !data,
    }
  },
}

export default userHooks
