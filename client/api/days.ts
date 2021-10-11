import { request, gql } from 'graphql-request'
import useSWR from 'swr'
import constants from '../constants'
import helpers from './helpers'

const dayHooks = {
  useFetchDayById: (id: number, start: boolean): { data: any; error: any; loading: boolean } => {
    const fetchDayById = (url: string) => {
      return request(
        url,
        gql`
          {
            day(id: ${id}) {
              id
              userId
              rating
              mood
              meals
              exercise
              meds
              createdAt
              updatedAt
            }
          }
        `,
        null,
        helpers.auth()
      )
    }
    const { data, error } = useSWR(start ? constants.API + '/api' : null, fetchDayById)
    return {
      data: data && JSON.parse(data),
      error: error,
      loading: !error && !data,
    }
  },
  useFetchDaysByUserId: (
    userId: number,
    start: boolean
  ): { data: any; error: any; loading: boolean } => {
    const fetchDayById = (url: string) => {
      return request(
        url,
        gql`
          {
            days(userId: ${userId}) {
              id
              userId
              rating
              mood
              meals
              exercise
              meds
              createdAt
              updatedAt
            }
          }
        `,
        null,
        helpers.auth()
      )
    }
    const { data, error } = useSWR(start ? constants.API + '/api' : null, fetchDayById)
    return {
      data: data && JSON.parse(data),
      error: error,
      loading: !error && !data,
    }
  },
  useFetchDays: (
    args?: {
      id?: number
      userId?: number
      rating?: number
      mood?: string
      meals?: number
      exercise?: boolean
      meds?: boolean
      createdAt?: number
      updatedAt?: number
    },
    start?: boolean
  ): { data: any; error: any; loading: boolean } => {
    const fetchDays = (url: string) => {
      return request(
        url,
        gql`{
        days${helpers.stringifyArgs(args)} {
          id
          userId
          rating
          mood
          meals
          exercise
          meds
          createdAt
          updatedAt
        }
      }`,
        null,
        helpers.auth()
      )
    }
    const { data, error } = useSWR(start ? constants.API + '/api' : null, fetchDays)
    return {
      data: data && JSON.parse(data),
      error: error,
      loading: !error && !data,
    }
  },
}

export default dayHooks
