import actions from '.'
import { User, UserObject } from '../../models/user'
import { ThunkAppDispatch } from '../store'

export type UserActionType = {
  type: 'SET_AUTHENTICATED' | 'SET_UNAUTHENTICATED' | 'RESET_AUTH_CHECKED'
  payload?: UserObject
}

const users = {
  setAuthenticated:
    (payload: UserObject) =>
    (dispatch: ThunkAppDispatch): Promise<UserActionType> =>
      Promise.resolve(dispatch({ type: 'SET_AUTHENTICATED', payload })),

  setUnauthenticated:
    () =>
    (dispatch: ThunkAppDispatch): Promise<UserActionType> =>
      Promise.resolve(dispatch({ type: 'SET_UNAUTHENTICATED' })).then(action =>
        dispatch(actions.clearDays()).then(() => action)
      ),
  resetAuthChecked:
    () =>
    (dispatch: ThunkAppDispatch): Promise<UserActionType> =>
      Promise.resolve(dispatch({ type: 'RESET_AUTH_CHECKED' })),
}

export default users
