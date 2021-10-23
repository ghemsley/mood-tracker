import { request, gql } from 'graphql-request'
import { useDispatch } from 'react-redux'
import useSWR from 'swr'
import constants from '../constants'
import actions from '../redux/actions'
import { ThunkAppDispatch } from '../redux/store'
import helpers from './helpers'
import type { UserObject } from '../models/user'
import { isUserObject } from '../models/user.guard'
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react'

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
    started: MutableRefObject<boolean>,
    unmounting: MutableRefObject<boolean>
  ): Promise<(AuthenticationType & ErrorType) | null> => {
    const dispatch: ThunkAppDispatch = useDispatch()
    const run = useCallback(async () => {
      if (start && !started.current && !unmounting.current) {
        started.current = true
        const authorize = (url: string) =>
          helpers.fetcher(url, 'GET', true) as Promise<AuthenticationType & ErrorType>
        const data = await authorize('/authorize')
        if (typeof data?.token === 'string') {
          helpers.setToken(data.token)
        }
        if (isUserObject(data?.user)) {
          await dispatch(actions.setAuthenticated(data.user))
        } else {
          console.log('error', data)
        }
        return data
      } else return null
    }, [start, started, dispatch, unmounting])
    return start && !started.current && !unmounting.current ? await run() : null
  },
  useSignupUser: async (
    email: string,
    password: string,
    confirmPassword: string,
    start: boolean,
    done: boolean,
    started: MutableRefObject<boolean>,
    unmounting: MutableRefObject<boolean>,
    errorsCallback: Dispatch<SetStateAction<{ message: string }[]>>
  ): Promise<(AuthenticationType & ErrorType) | null> => {
    const dispatch: ThunkAppDispatch = useDispatch()
    const run = useCallback(async () => {
      if (start && !done && !started.current && !unmounting.current) {
        started.current = true
        const signupUser = (url: string) =>
          helpers.fetcher(url, 'POST', false, { email, password, confirmPassword })
        const data = (await signupUser('/signup')) as AuthenticationType & ErrorType
        if (typeof data?.token === 'string') {
          helpers.setToken(data.token)
        }
        if (isUserObject(data?.user) && !unmounting.current) {
          await dispatch(actions.setAuthenticated(data.user))
        } else {
          console.log('error', data)
          if (!unmounting.current) errorsCallback(data?.errors)
        }
        return data
      } else return null
    }, [
      start,
      done,
      started,
      email,
      password,
      confirmPassword,
      unmounting,
      dispatch,
      errorsCallback,
    ])
    return start && !done && !started.current && !unmounting.current ? await run() : null
  },
  useLoginUser: async (
    email: string,
    password: string,
    start: boolean,
    started: MutableRefObject<boolean>,
    unmounting: MutableRefObject<boolean>,
    errorsCallback: Dispatch<SetStateAction<{ message: string }[]>>
  ): Promise<(AuthenticationType & ErrorType) | null> => {
    const dispatch: ThunkAppDispatch = useDispatch()
    const run = useCallback(async () => {
      if (start && !started.current && !unmounting.current) {
        started.current = true
        console.log('running')
        const loginUser = (url: string) => helpers.fetcher(url, 'POST', false, { email, password })
        const data = (await loginUser('/login')) as AuthenticationType & ErrorType
        if (typeof data?.token === 'string') {
          helpers.setToken(data.token)
        }
        if (isUserObject(data?.user) && !unmounting.current) {
          await dispatch(actions.setAuthenticated(data.user))
        } else {
          console.log('error', data)
          if (!unmounting.current) errorsCallback(data?.errors)
        }
        return data
      } else {
        return null
      }
    }, [start, started, email, password, unmounting, dispatch, errorsCallback])
    return start && !started.current && !unmounting.current ? await run() : null
  },
  useLogoutUser: async (
    start: boolean,
    started: MutableRefObject<boolean>,
    unmounting: MutableRefObject<boolean>
  ): Promise<{ token: string } | ErrorType | null> => {
    const dispatch: ThunkAppDispatch = useDispatch()
    const run = useCallback(async () => {
      if (start && !started.current && !unmounting.current) {
        started.current = true
        const logoutUser = (url: string) => helpers.fetcher(url, 'GET', true)
        const data = (await logoutUser('/logout')) as { token: string } & ErrorType
        if (typeof data?.token === 'string') {
          console.log('token', data.token)
        } else {
          console.log(data)
        }
        await dispatch(actions.setUnauthenticated())
        return data
      } else return null
    }, [start, started, unmounting, dispatch])
    return start && !started.current && !unmounting.current ? await run() : null
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
