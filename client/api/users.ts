import { request, gql } from 'graphql-request'
import useSWR from 'swr'
import constants from '../constants'
import helpers from './helpers'

const swrConfig = {
  revalidateIfStale: false,
  revalidateOnMount: true,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  shouldRetryOnError: false,
}

const userHooks = {
  useCheckAuth: (start: boolean) => {
    const authorize = async (url: string) => helpers.fetcher(url, 'GET')
    const { data, error, isValidating } = useSWR(
      start ? constants.API + '/authorize' : null,
      authorize,
      swrConfig
    )
    data?.token && helpers.setToken(data.token)
    return {
      data,
      error,
      loading: isValidating,
    }
  },
  useSignupUser: (
    email: string,
    password: string,
    confirmPassword: string,
    start: boolean
  ): { data: any; error: any; loading: boolean } => {
    const loginUser = async (url: string) =>
      helpers.fetcher(url, 'POST', { email, password, confirmPassword })
    const { data, error, isValidating } = useSWR(
      start ? constants.API + '/signup' : null,
      loginUser,
      swrConfig
    )
    data?.token && helpers.setToken(data.token)
    return {
      data,
      error,
      loading: isValidating,
    }
  },
  useLoginUser: (
    email: string,
    password: string,
    start: boolean
  ): { data: any; error: any; loading: boolean } => {
    const loginUser = async (url: string) => helpers.fetcher(url, 'POST', { email, password })
    const { data, error, isValidating } = useSWR(
      start ? constants.API + '/login' : null,
      loginUser,
      swrConfig
    )
    data?.token && helpers.setToken(data.token)
    return {
      data,
      error,
      loading: isValidating,
    }
  },
  useLogoutUser: (start: boolean): { data: any; error: any; loading: boolean } => {
    const logoutUser = async (url: string) => helpers.fetcher(url, 'GET')
    const { data, error, isValidating } = useSWR(
      start && helpers.getToken() ? constants.API + '/logout' : null,
      logoutUser,
      swrConfig
    )
    return {
      data,
      error,
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
      error,
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
      error,
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
      error,
      loading: isValidating,
    }
  },
}

export default userHooks
