import { request, gql } from 'graphql-request'
import useSWR, { SWRConfig } from 'swr'
import constants from '../constants'
import helpers from './helpers'

const swrConfig = {
  revalidateIfStale: false,
  revalidateOnMount: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  shouldRetryOnError: false,
}

const userHooks = {
  useLoginUser: (
    email: string,
    password: string,
    start: boolean
  ): { data: any; error: any; loading: boolean } => {
    const loginUser = async (url: string) =>
      fetch(url, {
        method: 'POST',
        redirect: 'follow',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      }).then((response) => response.json())
    const { data, error, isValidating } = useSWR(
      start ? constants.API + '/login' : null,
      loginUser,
      swrConfig
    )
    data && data.token && helpers.setToken(data.token)
    return {
      data: data,
      error: error,
      loading: isValidating,
    }
  },
  useLogoutUser: (start: boolean): { data: any; error: any; loading: boolean } => {
    const logoutUser = async (url: string) =>
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
    const { data, error, isValidating } = useSWR(
      start ? constants.API + '/logout' : null,
      logoutUser,
      swrConfig
    )
    return {
      data: data,
      error: error,
      loading: isValidating,
    }
  },
  useFetchUserById: (id: number, start: boolean): { data: any; error: any; loading: boolean } => {
    const fetchUserById = async (url: string) =>
      request(
        url,
        gql`
          {
            user(id: ${id}) {
              id
              email
              admin
              enabled
              createdAt
              updatedAt
            }
          }
        `,
        null,
        helpers.auth()
      )
    const { data, error, isValidating } = useSWR(
      start ? constants.API + '/api' : null,
      fetchUserById,
      swrConfig
    )
    return {
      data: data && JSON.parse(data),
      error: error,
      loading: isValidating,
    }
  },
  useFetchUserByEmail: (
    email: string,
    start: boolean
  ): { data: any; error: any; loading: boolean } => {
    const fetchUserByEmail = async (url: string) =>
      request(
        url,
        gql`{
        user(email: "${email}") {
          id
          email
          admin
          enabled
          createdAt
          updatedAt
        }
      }`,
        null,
        helpers.auth()
      )
    const { data, error, isValidating } = useSWR(
      start ? constants.API + '/api' : null,
      fetchUserByEmail,
      swrConfig
    )
    return {
      data: data && JSON.parse(data),
      error: error,
      loading: isValidating,
    }
  },
  useFetchUsers: (
    args?: {
      id?: number
      email?: string
      admin?: boolean
      enabled?: string
      createdAt?: number
      updatedAt?: number
    },
    start?: boolean
  ): { data: any; error: any; loading: boolean } => {
    const fetchUsers = async (url: string) =>
      request(
        url,
        gql`{
        users${helpers.stringifyArgs(args)} {
          id
          email
          admin
          enabled
          createdAt
          updatedAt
        }
      }`,
        null,
        helpers.auth()
      )
    const { data, error, isValidating } = useSWR(
      start ? constants.API + '/api' : null,
      fetchUsers,
      swrConfig
    )
    return {
      data: data && JSON.parse(data),
      error: error,
      loading: isValidating,
    }
  },
}

export default userHooks
