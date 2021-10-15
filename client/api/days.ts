import { DayObject } from './../models/day'
import { request, gql } from 'graphql-request'
import useSWR from 'swr'
import constants from '../constants'
import helpers from './helpers'

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
  useFetchDays: (
    args?: DayObject,
    start?: boolean
  ): { data: { days: DayObject[] } | undefined; error: any; loading: boolean } => {
    const fetchDays = async (url: string) =>
      request(
        url,
        gql`{
        days${helpers.stringifyArgs(args)} {
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
      }`,
        null,
        helpers.auth()
      )
    const { data, error, isValidating } = useSWR(start ? constants.API + '/api' : null, fetchDays)
    return {
      data: data && JSON.parse(data),
      error: error,
      loading: isValidating,
    }
  },
}

export default dayHooks
