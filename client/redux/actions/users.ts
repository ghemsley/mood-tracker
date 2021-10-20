import actions from '.'
import { UserObject } from '../../models/user'
import { ThunkAppDispatch } from '../store'

export type UserActionType = {
  type: 'SET_AUTHENTICATED' | 'SET_UNAUTHENTICATED' | 'UPDATE_USER'
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
}

export default users
