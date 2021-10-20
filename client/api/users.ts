import { request, gql } from 'graphql-request'
import { useDispatch } from 'react-redux'
import useSWR from 'swr'
import constants from '../constants'
import actions from '../redux/actions'
import { ThunkAppDispatch } from '../redux/store'
import helpers from './helpers'
import type { UserObject } from '../models/user'
import { isUserObject } from '../models/user.guard'
import { useEffect, useMemo, useRef } from 'react'

type ErrorType = {
  errors: [{ message: string }]
}

type AuthenticationType = {
  user: UserObject
  token: string
}

const userHooks = {
  useCheckAuth: async (start: boolean): Promise<AuthenticationType | ErrorType | null> => {
    const dispatch: ThunkAppDispatch = useDispatch()
    const started = useRef(false)
    const result = useRef<AuthenticationType | ErrorType | null>({} as AuthenticationType)
    useEffect(() => {
      const run = async () => {
        if (start && !started.current) {
          started.current = true
          const authorize = (url: string): unknown => helpers.fetcher(url, 'GET', true)
          const data = (await authorize('/authorize')) as AuthenticationType
          if (typeof data?.token === 'string') {
            helpers.setToken(data.token)
          }
          if (isUserObject(data?.user)) {
            await dispatch(actions.setAuthenticated(data.user))
            result.current = data
          } else {
            result.current = data
            console.log('error', data)
          }
        } else result.current = null
      }
      run()
    }, [start, dispatch])
    return result.current as AuthenticationType | ErrorType
  },
  useSignupUser: async (
    email: string,
    password: string,
    confirmPassword: string,
    start: boolean
  ): Promise<AuthenticationType | ErrorType> => {
    const dispatch: ThunkAppDispatch = useDispatch()
    const started = useRef(false)
    const result = useRef<AuthenticationType | ErrorType | null>({} as AuthenticationType)
    useEffect(() => {
      const run = async () => {
        if (start && !started.current) {
          started.current = true
          const signupUser = (url: string): unknown =>
            helpers.fetcher(url, 'POST', false, { email, password, confirmPassword })
          const data = (await signupUser('/signup')) as AuthenticationType
          if (typeof data?.token === 'string') {
            helpers.setToken(data.token)
          }
          if (isUserObject(data?.user)) {
            await dispatch(actions.setAuthenticated(data.user))
            result.current = data
          } else {
            console.log('data', data)
            result.current = data
          }
        } else result.current = null
      }
      run()
    }, [start, email, password, confirmPassword, dispatch])
    return result.current as AuthenticationType | ErrorType
  },
  useLoginUser: async (
    email: string,
    password: string,
    start: boolean
  ): Promise<UserObject | Record<string, unknown> | null | undefined> => {
    const dispatch: ThunkAppDispatch = useDispatch()
    const started = useRef(false)
    const result = useRef<AuthenticationType | ErrorType | null>({} as AuthenticationType)
    useEffect(() => {
      const run = async () => {
        if (start && !started.current) {
          started.current = true
          const loginUser = (url: string) =>
            helpers.fetcher(url, 'POST', false, { email, password })
          const data = (await loginUser('/login')) as AuthenticationType
          if (typeof data?.token === 'string') {
            helpers.setToken(data.token)
          }
          if (isUserObject(data?.user)) {
            const action = await dispatch(actions.setAuthenticated(data.user))
            result.current = data
          } else {
            console.log('data', data)
            result.current = data
          }
        } else result.current = null
      }
      run()
    }, [start, email, password, dispatch])
    return result.current
  },
  useLogoutUser: async (start: boolean): Promise<{ token: string } | ErrorType | null> => {
    const dispatch: ThunkAppDispatch = useDispatch()
    const started = useRef(false)
    const result = useRef<{ token: string } | ErrorType | null>({} as { token: string })
    useEffect(() => {
      const run = async () => {
        if (start && !started.current) {
          started.current = true
          dispatch(actions.setUnauthenticated())
          const logoutUser = (url: string) => helpers.fetcher(url, 'GET', true)
          const data = (await logoutUser('/logout')) as { token: string } & ErrorType
          if (typeof data?.token === 'string') {
            result.current = data as { token: string }
          } else {
            console.log(data)
            result.current = data as ErrorType
          }
        } else result.current = null
      }
      run()
    }, [start, dispatch])
    return result.current
  },
  useFetchUserById: async (
    id: number,
    start: boolean
  ): Promise<{ data: UserObject | { errors: { message: string }[] } }> => {
    const dispatch: ThunkAppDispatch = useDispatch()
    const result = useMemo(async () => {
      if (start) {
        const data = await helpers.fetchGraphQL('user', undefined, { id })
        console.log('data', data)
        return data
      } else return null
    }, [id, start])
    return result
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
      fetchUserByEmail
    )
    return {
      data: data && JSON.parse(data),
      error,
      loading: isValidating,
    }
  },
  useFetchUsers: (
    args?: UserObject,
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
    const { data, error, isValidating } = useSWR(start ? constants.API + '/api' : null, fetchUsers)
    return {
      data: data && JSON.parse(data),
      error,
      loading: isValidating,
    }
  },
}

export default userHooks
