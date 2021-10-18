import { Day, DayObject } from '../../models/day'

const days = {
  createDay: (payload: DayObject) => (dispatch: any) =>
    Promise.resolve(dispatch({ type: 'CREATE_DAY', payload })),
  createDays: (payload: DayObject[]) => (dispatch: any) =>
    Promise.resolve(dispatch({ type: 'CREATE_DAYS', payload })),

  clearDays: () => (dispatch: any) => Promise.resolve(dispatch({ type: 'CLEAR_DAYS' })),
}

export default days
