import User from '../../models/user'

const reducer = {
  user: (
    state: { authChecked: boolean; loggedIn: boolean; currentUser: User | null } = {
      authChecked: false,
      loggedIn: false,
      currentUser: null,
    },
    action: {
      type: string
      payload: any
    }
  ) => {
    switch (action.type) {
      case 'CREATE_USER':
        return {
          authChecked: true,
          loggedIn: true,
          currentUser: new User(action.payload).toObject(),
        }
      case 'UPDATE_USER':
        return {
          ...state,
          currentUser:
            action.payload.user instanceof User &&
            action.payload.user.updateFromObject(action.payload.update).toObject(),
        }
      case 'LOGIN_USER':
        return {
          authChecked: true,
          loggedIn: true,
          currentUser: new User(action.payload).toObject(),
        }
      case 'LOGOUT_USER':
        return {
          authChecked: true,
          loggedIn: true,
          currentUser: null,
        }

      default:
        return state
    }
  },
}

export default reducer
