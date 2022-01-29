import { Dispatch, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useMountedState, usePromise } from 'react-use'
import { isUserObject } from '../models/user.guard'
import actions from '../redux/actions'
import { ThunkAppDispatch } from '../redux/store'
import helpers, { AuthenticationType, ErrorType } from './helpers'

export type HookReturnType = [(AuthenticationType & ErrorType) | null, ErrorType['errors'] | null]

const userHooks = {
  useCheckAuth: (protectedRoute: boolean): HookReturnType => {
    const authChecked = useSelector(state => state.user.authChecked)
    const user = useSelector(state => state.user.currentUser)
    const [data, setData] = useState<(AuthenticationType & ErrorType) | null>(null)
    const [errors, setErrors] = useState<ErrorType['errors'] | null>(null)
    const dispatch: ThunkAppDispatch = useDispatch()
    const mounted = usePromise()
    const isMounted = useMountedState()
    const authorize = useCallback((url: string) => helpers.fetcher(url, 'GET', true), [])
    const run = useCallback(async () => {
      const data = (await mounted(authorize('/authorize'))) as AuthenticationType & ErrorType
      if (typeof data?.token === 'string') {
        helpers.setToken(data.token)
      }
      if (isUserObject(data?.user)) {
        if (!user && isMounted()) await mounted(dispatch(actions.setAuthenticated(data.user)))
        if (isMounted()) setData(data)
      } else {
        if (protectedRoute) console.error('error', data)
        helpers.deleteToken()
        if (isMounted()) await mounted(dispatch(actions.setUnauthenticated()))
        if (isMounted()) setErrors(data?.errors ? data.errors : null)
      }
    }, [protectedRoute, user, isMounted, dispatch, mounted, authorize])
    useEffect(() => {
      if (isMounted()) mounted(run())
    }, [])
    return [data, errors]
  },
  useSignupUser: async (
    email: string,
    password: string,
    confirmPassword: string,
    start: boolean,
    setErrors: Dispatch<ErrorType['errors'] | null>
  ): Promise<HookReturnType> => {
    const [data, setData] = useState<(AuthenticationType & ErrorType) | null>(null)
    const dispatch: ThunkAppDispatch = useDispatch()
    const mounted = usePromise()
    const isMounted = useMountedState()
    const signupUser = useCallback(
      (url: string) => helpers.fetcher(url, 'POST', false, { email, password, confirmPassword }),
      [confirmPassword, email, password]
    )
    const run = useCallback(async (): Promise<
      [(AuthenticationType & ErrorType) | null, ErrorType['errors'] | null]
    > => {
      const data = (await mounted(signupUser('/signup'))) as AuthenticationType & ErrorType
      if (typeof data?.token === 'string') {
        helpers.setToken(data.token)
      }
      if (isUserObject(data?.user)) {
        if (isMounted()) await mounted(dispatch(actions.setAuthenticated(data.user)))
      } else {
        console.error('error', data)
      }
      return [data, data?.errors ? data.errors : null]
    }, [isMounted, mounted, dispatch, signupUser])
    useEffect(() => {
      if (start && isMounted())
        mounted(
          run().then(([data, errors]) => {
            if (isMounted()) setData(data)
            if (isMounted()) setErrors(errors)
          })
        )
    }, [start, isMounted, mounted, run, setErrors])
    return [data, data?.errors ? data.errors : null]
  },
  useLoginUser: async (
    email: string,
    password: string,
    start: boolean,
    setErrors: Dispatch<ErrorType['errors'] | null>
  ): Promise<HookReturnType> => {
    const [data, setData] = useState<(AuthenticationType & ErrorType) | null>(null)
    const dispatch: ThunkAppDispatch = useDispatch()
    const mounted = usePromise()
    const isMounted = useMountedState()
    const loginUser = useCallback(
      (url: string) => helpers.fetcher(url, 'POST', false, { email, password }),
      [email, password]
    )
    const run = useCallback(async (): Promise<
      [(AuthenticationType & ErrorType) | null, ErrorType['errors'] | null]
    > => {
      const data = (await mounted(loginUser('/login'))) as AuthenticationType & ErrorType
      if (typeof data?.token === 'string') {
        helpers.setToken(data.token)
      }
      if (isUserObject(data?.user)) {
        if (isMounted()) await mounted(dispatch(actions.setAuthenticated(data.user)))
      } else {
        console.error('error', data)
      }
      return [data, data?.errors ? data.errors : null]
    }, [dispatch, isMounted, mounted, loginUser])
    useEffect(() => {
      if (start && isMounted())
        mounted(
          run().then(([data, errors]) => {
            if (isMounted()) {
              setErrors(errors)
              setData(data)
            }
          })
        )
    }, [start, isMounted, mounted, run, setErrors])
    return [data, data?.errors ? data.errors : null]
  },
  useLogoutUser: (): [{ token: string } | ErrorType | null, ErrorType['errors'] | null] => {
    const dispatch: ThunkAppDispatch = useDispatch()
    const mounted = usePromise()
    const isMounted = useMountedState()
    const [data, setData] = useState<{ token: string } | ErrorType | null>(null)
    const [errors, setErrors] = useState<ErrorType['errors'] | null>(null)
    const logoutUser = useCallback((url: string) => helpers.fetcher(url, 'GET', true), [])
    const run = useCallback(async () => {
      const data = (await mounted(logoutUser('/logout'))) as { token: string } & ErrorType
      helpers.deleteToken()
      if (isMounted()) await mounted(dispatch(actions.setUnauthenticated()))
      if (typeof data?.token === 'string') {
        console.log('token', data.token)
        if (isMounted()) setData(data)
      } else {
        console.error('error', data)
        if (isMounted()) setErrors(data?.errors ? data.errors : null)
      }
    }, [isMounted, mounted, dispatch, logoutUser])
    useEffect(() => {
      if (isMounted()) mounted(run())
    }, [])
    return [data, errors]
  },
}

export default userHooks
