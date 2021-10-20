import { User, UserObject } from '../../models/user'

type UserStateType = {
  authChecked: boolean
  loggedIn: boolean
  currentUser: UserObject | null | undefined
}

const user = (
  state: UserStateType = {
    authChecked: false,
    loggedIn: false,
    currentUser: null,
  },
  action: {
    type: 'SET_AUTHENTICATED' | 'SET_UNAUTHENTICATED' | 'UPDATE_USER'
    payload?: UserObject
  }
): UserStateType => {
  switch (action.type) {
    case 'SET_AUTHENTICATED':
      return {
        authChecked: true,
        loggedIn: true,
        currentUser: action.payload,
      }
    case 'SET_UNAUTHENTICATED':
      return {
        authChecked: true,
        loggedIn: false,
        currentUser: null,
      }
    case 'UPDATE_USER':
      return {
        ...state,
        currentUser:
          action.payload && state.currentUser
            ? new User(state.currentUser).updateFromObject(action.payload).toObject()
            : state.currentUser,
      }

    default:
      return state
  }
}

export default user
