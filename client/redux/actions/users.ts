import actions from '.'
import { UserObject } from '../../models/user'
import { ThunkAppDispatch } from '../store'

type UserActionType = {
  type: 'SET_AUTHENTICATED' | 'SET_UNAUTHENTICATED' | 'UPDATE_USER'
  payload?: UserObject
}

const users = {
  setAuthenticated: (payload: UserObject) => (dispatch: ThunkAppDispatch) =>
    Promise.resolve(dispatch({ type: 'SET_AUTHENTICATED', payload })),
  setUnauthenticated: () => (dispatch: ThunkAppDispatch) =>
    Promise.resolve(dispatch({ type: 'SET_UNAUTHENTICATED' })).then(() =>
      dispatch(actions.clearDays())
    ),
}

export default users
