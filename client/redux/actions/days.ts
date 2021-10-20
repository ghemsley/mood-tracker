import { DayObject } from '../../models/day'
import { ThunkAppDispatch } from '../store'

export type DayActionType = {
  type: 'CREATE_DAY' | 'CREATE_DAYS' | 'CLEAR_DAYS'
  payload?: DayObject | DayObject[]
}

const days = {
  createDay:
    (payload: DayObject) =>
    (dispatch: ThunkAppDispatch): Promise<DayActionType> =>
      Promise.resolve(dispatch({ type: 'CREATE_DAY', payload })),

  createDays:
    (payload: DayObject[]) =>
    (dispatch: ThunkAppDispatch): Promise<DayActionType> =>
      Promise.resolve(dispatch({ type: 'CREATE_DAYS', payload })),

  clearDays:
    () =>
    (dispatch: ThunkAppDispatch): Promise<DayActionType> =>
      Promise.resolve(dispatch({ type: 'CLEAR_DAYS' })),
}

export default days
