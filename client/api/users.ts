import { request } from 'graphql-request'
import useSWR from 'swr'
import constants from '../constants'

const userHooks = {
  useFetchUserById: (id: number): { data: any; error: any; loading: boolean } => {
    const fetchUserById = (url: string) => {
      return request(
        url,
        `{
        user(id: ${id}) {
          id
          username
          admin
          createdAt
          updatedAt
        }
      }`
      )
    }
    const { data, error } = useSWR(constants.API, fetchUserById)
    return {
      data: data,
      error: error,
      loading: !error && !data,
    }
  },
  useFetchUserByUsername: (username: string): { data: any; error: any; loading: boolean } => {
    const fetchUserByUsername = (url: string) => {
      return request(
        url,
        `{
        user(id: ${username}) {
          id
          username
          admin
          createdAt
          updatedAt
        }
      }`
      )
    }
    const { data, error } = useSWR(constants.API, fetchUserByUsername)
    return {
      data: data,
      error: error,
      loading: !error && !data,
    }
  },
  useFetchUsers: (args?: {
    id?: number
    username?: string
    admin?: boolean
    createdAt?: number
    updatedAt?: number
  }): { data: any; error: any; loading: boolean } => {
    const stringifyArgs = () => {
      if (args) {
        const array = []
        for (const [key, value] of Object.entries(args)) {
          array.push(`${key}: ${typeof value === 'string' ? '"' + value + '"' : value}`)
        }
        return `(${array.join(', ')})`
      } else return ''
    }
    const fetchUsers = (url: string) => {
      return request(
        url,
        `{
        users${stringifyArgs()} {
          id
          username
          admin
          createdAt
          updatedAt
        }
      }`
      )
    }
    const { data, error } = useSWR(constants.API, fetchUsers)
    return {
      data: data,
      error: error,
      loading: !error && !data,
    }
  },
}

export default userHooks
