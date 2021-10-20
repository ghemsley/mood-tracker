import { DayObject } from './../models/day'
import { request, gql } from 'graphql-request'
import useSWR from 'swr'
import constants from '../constants'
import helpers from './helpers'
import { useDispatch } from 'react-redux'
import { useEffect, useRef } from 'react'
import { isDayObject } from '../models/day.guard'
import actions from '../redux/actions'
import { ThunkAppDispatch } from '../redux/store'

const dayHooks = {
  useFetchDayById: (
    id: number,
    start: boolean
  ): { data: { day: DayObject } | undefined; error: any; loading: boolean } => {
    const fetchDayById = async (url: string) =>
      request(
        url,
        gql`
          {
            day(id: ${id}) {
              id
              userId
              rating
              mood
              meals
              water
              people
              activities
              exercise
              meds
              journal
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
      fetchDayById
    )
    return {
      data: data && JSON.parse(data),
      error: error,
      loading: isValidating,
    }
  },
  useFetchDaysByUserId: (
    userId: number,
    start: boolean
  ): { data: { days: DayObject[] } | undefined; error: any; loading: boolean } => {
    const fetchDayById = async (url: string) =>
      request(
        url,
        gql`
          {
            days(userId: ${userId}) {
              id
              userId
              rating
              mood
              meals
              water
              people
              activities
              exercise
              meds
              journal
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
      fetchDayById
    )
    return {
      data: data && JSON.parse(data),
      error: error,
      loading: isValidating,
    }
  },
  useFetchDays: async (fields?: string[], args?: DayObject, start?: boolean): Promise<any> => {
    const dispatch: ThunkAppDispatch = useDispatch()
    const started = useRef(false)
    const result = useRef<{ days?: DayObject[] } | { errors?: [{ message: string }] } | null>({})
    useEffect(() => {
      const run = async () => {
        if (start && !started.current) {
          started.current = true
          const data = await JSON.parse(await helpers.fetchGraphQL('days', fields, args))
          if (data?.days && data.days.length > 0 && isDayObject(data.days[0])) {
            await dispatch(actions.createDays(data.days))
            result.current = data
          } else {
            console.log('error', data)
            result.current = data
          }
        } else result.current = null
      }
      run()
    }, [start, args, fields, dispatch])
    return result.current
  },
}

export default dayHooks
