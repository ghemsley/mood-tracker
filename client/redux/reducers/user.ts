import { getNamedType } from 'graphql'
import User from '../../models/user'

interface UserObject {
  id?: number
  email?: string
  password?: string
  admin?: boolean
  enabled?: string
  createdAt?: number
  updatedAt?: number
}
type Payload = User | UserObject

const user = (
  state: {
    authChecked: boolean
    loggedIn: boolean
    currentUser: UserObject | null
  } = {
    authChecked: false,
    loggedIn: false,
    currentUser: null,
  },
  action: {
    type: string
    payload?: Payload
  }
) => {
  switch (action.type) {
    case 'CREATE_USER':
      return {
        authChecked: true,
        loggedIn: true,
        currentUser: action.payload instanceof User ? action.payload.toObject() : null,
      }
    case 'UPDATE_USER':
      return {
        ...state,
        currentUser:
          !(action.payload instanceof User) && action.payload && state.currentUser
            ? new User(state.currentUser).updateFromObject(action.payload).toObject()
            : state.currentUser,
      }
    case 'LOGIN_USER':
      return action.payload instanceof User
        ? {
            authChecked: true,
            loggedIn: true,
            currentUser: action.payload.toObject(),
          }
        : state
    case 'LOGOUT_USER':
      return {
        authChecked: false,
        loggedIn: false,
        currentUser: null,
      }

    default:
      return state
  }
}

export default user
