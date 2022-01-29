import { DayObject } from '../../models/day'
import { isDayObject } from '../../models/day.guard'

type DaysStateType = {
  days: DayObject[] | null
}
const days = (
  state: DaysStateType = { days: null },
  action: {
    type: 'CREATE_DAY' | 'CREATE_DAYS' | 'UPDATE_DAY' | 'DELETE_DAY' | 'CLEAR_DAYS'
    payload?: DayObject | DayObject[]
  }
): DaysStateType => {
  switch (action.type) {
    case 'CREATE_DAY':
      if (isDayObject(action.payload))
        return state.days
          ? {
              days: [
                ...state.days.filter(day => day.id !== (action.payload as DayObject).id),
                action.payload,
              ],
            }
          : { days: [action.payload] }
      else return state
    case 'CREATE_DAYS':
      return (() => {
        const idSet = new Set((action.payload as DayObject[]).map(day => day.id))
        return state.days
          ? {
              days: [
                ...state.days.filter(day => !idSet.has(day.id)),
                ...(action.payload as DayObject[]),
              ],
            }
          : { days: action.payload as DayObject[] }
      })()
    case 'UPDATE_DAY':
      return (() => {
        return state.days && action.payload
          ? {
              days: [
                ...state.days.filter(day => day.id !== (action.payload as DayObject).id),
                action.payload as DayObject,
              ],
            }
          : state
      })()
    case 'DELETE_DAY':
      return (() => {
        const id = isDayObject(action.payload) && (action.payload as DayObject).id
        return id && state.days ? { days: state.days.filter(day => day.id !== id) } : state
      })()
    case 'CLEAR_DAYS':
      return { days: null }

    default:
      return state
  }
}

export default days
