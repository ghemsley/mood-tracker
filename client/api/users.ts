import { request, gql } from 'graphql-request'
import { useDispatch } from 'react-redux'
import useSWR from 'swr'
import constants from '../constants'
import actions from '../redux/actions'
import { ThunkAppDispatch } from '../redux/store'
import helpers from './helpers'
import type { UserObject } from '../models/user'
import { isUserObject } from '../models/user.guard'
import { MutableRefObject, useCallback, useEffect, useMemo, useRef } from 'react'

export type ErrorType = {
  errors: [{ message: string }]
}

export type AuthenticationType = {
  user: UserObject
  token: string
}

const userHooks = {
  useCheckAuth: async (
    start: boolean,
    unmounting: MutableRefObject<boolean>
  ): Promise<AuthenticationType | ErrorType | null> => {
    const dispatch: ThunkAppDispatch = useDispatch()
    const started = useRef(false)
    const result = useRef<AuthenticationType | ErrorType | null>({} as AuthenticationType)
    const run = useCallback(async () => {
      if (start && !started.current && !unmounting.current) {
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
    }, [start, dispatch, unmounting])
    useEffect(() => {
      if (!started.current && !unmounting.current) run()
      return () => {
        unmounting.current = true
      }
    }, [run, unmounting])
    return result.current as AuthenticationType | ErrorType
  },
  useSignupUser: async (
    email: string,
    password: string,
    confirmPassword: string,
    start: boolean,
    done: boolean,
    errorsCallback: any
  ): Promise<any> => {
    const dispatch: ThunkAppDispatch = useDispatch()
    // const started = useRef(false)
    const result = useRef<any>(null)
    const run = useCallback(async () => {
      if (start && done) {
        // started.current = true
        const signupUser = (url: string) =>
          helpers.fetcher(url, 'POST', false, { email, password, confirmPassword })
        const data = await signupUser('/signup')
        if (typeof data?.token === 'string') {
          helpers.setToken(data.token)
        }
        if (isUserObject(data?.user)) {
          await dispatch(actions.setAuthenticated(data.user))
        } else {
          console.log('error', data)
          errorsCallback(data?.errors)
        }
        return data
      } else return null
    }, [start, done, email, password, confirmPassword, dispatch, errorsCallback])
    useEffect(() => {
      result.current = run()
    }, [run])
    return result.current
  },
  useLoginUser: async (
    email: string,
    password: string,
    start: boolean,
    done: boolean,
    errorsCallback: any
  ): Promise<any> => {
    const dispatch: ThunkAppDispatch = useDispatch()
    // const started = useRef(false)
    const result = useRef<any>(null)
    const run = useCallback(async () => {
      if (start && done) {
        // started.current = true
        const loginUser = (url: string) => helpers.fetcher(url, 'POST', false, { email, password })
        const data = await loginUser('/login')
        if (typeof data?.token === 'string') {
          helpers.setToken(data.token)
        }
        if (isUserObject(data?.user)) {
          await dispatch(actions.setAuthenticated(data.user))
          // result.current = data
        } else {
          console.log('error', data)
          errorsCallback(data?.errors)
          // result.current = data
        }
        return data
      } else {
        // result.current = null
        return null
      }
    }, [start, done, email, password, dispatch, errorsCallback])
    useEffect(() => {
      result.current = run()
    }, [run])
    return result.current
  },
  useLogoutUser: async (start: boolean): Promise<{ token: string } | ErrorType | null> => {
    const dispatch: ThunkAppDispatch = useDispatch()
    const started = useRef(false)
    const result = useRef<{ token: string } | ErrorType | null>({} as { token: string })
    const run = useCallback(async () => {
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
    }, [start, dispatch])
    useEffect(() => {
      !started.current && run()
    }, [run])
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
