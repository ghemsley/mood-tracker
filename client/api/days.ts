import { useCallback, useState } from 'react'
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
  ): [DaysType['days'] | null, ErrorType['errors'] | null | undefined] => {
    const [errors, setErrors] = useState<{ message: string }[] | null | undefined>(null)
    const [days, setDays] = useState<DaysType['days'] | null>(null)
    const dispatch: ThunkAppDispatch = useDispatch()
    const mounted = usePromise()
    const isMounted = useMountedState()
    const run = useCallback(async () => {
      const data = (await mounted(helpers.fetchGraphQL('days', fields, args))) as
        | (DaysType & ErrorType)
        | null
      if (data?.days) {
        if (isMounted()) {
          setDays(data.days)
          await mounted(dispatch(actions.createDays(data.days)))
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
    return [days, errors]
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
        helpers.fetchGraphQL('days', fields, { ...args, userId: user?.id })
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
      const data = (await mounted(helpers.fetchGraphQL('days', fields, args))) as
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
}

export default dayHooks
