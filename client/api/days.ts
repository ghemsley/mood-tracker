import { Dispatch, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useMount, useMountedState, usePromise } from 'react-use'
import { isDayObject } from '../models/day.guard'
import { UserObject } from '../models/user'
import actions from '../redux/actions'
import { ThunkAppDispatch } from '../redux/store'
import { DayObject } from './../models/day'
import helpers, { DaysType, ErrorType } from './helpers'

const dayHooks = {
  useFetchDay: (
    fields?: string[],
    args?: DayObject
  ): [DaysType['day'] | null, ErrorType['errors'] | null | undefined] => {
    const [errors, setErrors] = useState<{ message: string }[] | null | undefined>(null)
    const [day, setDay] = useState<DaysType['day'] | null>(null)
    const dispatch: ThunkAppDispatch = useDispatch()
    const mounted = usePromise()
    const isMounted = useMountedState()
    const run = useCallback(async () => {
      const data = (await mounted(helpers.queryGraphQL('days', fields, args))) as
        | (DaysType & ErrorType)
        | null
      if (data?.days) {
        if (isMounted()) {
          setDay(data.day)
          if (data.day) await mounted(dispatch(actions.createDay(data.day)))
        }
      } else {
        console.log('error', data)
        if (isMounted()) setErrors(data?.errors)
      }
      return data
    }, [args, fields, isMounted, dispatch, mounted])
    useMount(() => {
      if (isMounted()) mounted(run())
    })
    return [day, errors]
  },
  useFetchDaysByUser: (
    fields?: string[],
    args?: DayObject
  ): [DaysType['days'] | null, ErrorType['errors'] | null | undefined] => {
    const user = useSelector(state => state.user.currentUser) as UserObject | null
    const [errors, setErrors] = useState<{ message: string }[] | null | undefined>(null)
    const [days, setDays] = useState<DaysType['days'] | null>(null)
    const dispatch: ThunkAppDispatch = useDispatch()
    const mounted = usePromise()
    const isMounted = useMountedState()
    const run = useCallback(async () => {
      const data = (await mounted(
        helpers.queryGraphQL('days', fields, { ...args, userId: user?.id })
      )) as (DaysType & ErrorType) | null
      if (data?.days && isMounted()) {
        setDays(data.days)
        await mounted(dispatch(actions.createDays(data.days)))
      } else {
        console.log('error', data)
        if (isMounted()) setErrors(data?.errors)
      }
      return data
    }, [args, fields, user?.id, isMounted, dispatch, mounted])
    useMount(() => {
      if (user && isMounted()) mounted(run())
    })
    return [days, errors]
  },
  useFetchDays: (
    fields?: string[],
    args?: DayObject
  ): [DaysType['days'] | null, ErrorType['errors'] | null | undefined] => {
    const [errors, setErrors] = useState<{ message: string }[] | null | undefined>(null)
    const [days, setDays] = useState<DaysType['days'] | null>(null)
    const dispatch: ThunkAppDispatch = useDispatch()
    const mounted = usePromise()
    const isMounted = useMountedState()
    const run = useCallback(async () => {
      const data = (await mounted(helpers.queryGraphQL('days', fields, args))) as
        | (DaysType & ErrorType)
        | null
      if (data?.days && isMounted()) {
        setDays(data.days)
        await dispatch(actions.createDays(data.days))
      } else {
        console.log('error', data)
        if (isMounted()) setErrors(data?.errors)
      }
      return data
    }, [args, fields, isMounted, dispatch, mounted])
    useMount(() => {
      if (isMounted()) mounted(run())
    })
    return [days, errors]
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
  useCreateDay: async (
    args: DayObject,
    start: boolean,
    setErrors: Dispatch<ErrorType['errors'] | null>
  ): Promise<[DaysType['day'] | null, ErrorType['errors'] | null | undefined]> => {
    const user = useSelector(state => state.user.currentUser) as UserObject | null
    const [data, setData] = useState<(DaysType & ErrorType) | null>(null)
    const dispatch: ThunkAppDispatch = useDispatch()
    const mounted = usePromise()
    const isMounted = useMountedState()
    const run = useCallback(async () => {
      const data = await mounted(helpers.mutateGraphQL('addDay', { ...args, userId: user?.id }))
      if (data?.addDay && isMounted()) {
        await mounted(dispatch(actions.createDay(data.addDay)))
      } else {
        console.error('error', data)
      }
      return [data, data?.errors ? data.errors : null]
    }, [args, user?.id, isMounted, dispatch, mounted])
    useEffect(() => {
      if (start && user && isMounted())
        mounted(
          run().then(([data, errors]) => {
            if (isMounted()) setData(data)
            if (isMounted()) setErrors(errors)
          })
        )
    }, [start, user, isMounted, mounted, run, setErrors])
    return [data?.day, data?.errors]
  },
}

export default dayHooks
