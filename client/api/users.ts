import { request, gql } from 'graphql-request'
import useSWR from 'swr'
import constants from '../constants'
import helpers from './helpers'

const userHooks = {
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
    data && data.token && helpers.setToken(data.token)
    return {
      data: data,
      error: error,
      loading: !error && !data,
    }
  },
  useLogoutUser: (start: boolean): { data: any; error: any; loading: boolean } => {
    const logoutUser = (url: string) =>
      fetch(url, {
        method: 'GET',
        redirect: 'follow',
        mode: 'cors',
      })
        .then((response) => {
          helpers.deleteToken()
          return response
        })
        .then((response) => response.json())
    const { data, error } = useSWR(start ? constants.API + '/logout' : null, logoutUser)

    return {
      data: data,
      error: error,
      loading: !error && !data,
    }
  },
  useFetchUserById: (id: number, start: boolean): { data: any; error: any; loading: boolean } => {
    const token = helpers.getToken()
    const fetchUserById = (url: string) =>
      request(
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
        helpers.auth()
      )

    const { data, error } = useSWR(start ? constants.API + '/api' : null, fetchUserById)
    return {
      data: data && JSON.parse(data),
      error: error,
      loading: !error && !data,
    }
  },
  useFetchUserByEmail: (
    email: string,
    start: boolean
  ): { data: any; error: any; loading: boolean } => {
    const fetchUserByEmail = (url: string) =>
      request(
        url,
        gql`{
        user(email: "${email}") {
          id
          email
          admin
          createdAt
          updatedAt
        }
      }`,
        null,
        helpers.auth()
      )
    const { data, error } = useSWR(start ? constants.API + '/api' : null, fetchUserByEmail)
    return {
      data: data && JSON.parse(data),
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
    const fetchUsers = (url: string) =>
      request(
        url,
        gql`{
        users${helpers.stringifyArgs(args)} {
          id
          email
          admin
          createdAt
          updatedAt
        }
      }`,
        null,
        helpers.auth()
      )
    const { data, error } = useSWR(start ? constants.API + '/api' : null, fetchUsers)
    return {
      data: data && JSON.parse(data),
      error: error,
      loading: !error && !data,
    }
  },
}

export default userHooks
