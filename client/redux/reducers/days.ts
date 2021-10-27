import { StateFromReducersMapObject } from 'redux'
import { DayObject } from '../../models/day'

type DaysStateType = {
  days: DayObject[] | null
}
const days = (
  state: DaysStateType = { days: null },
  action: {
    type: 'CREATE_DAY' | 'CREATE_DAYS' | 'UPDATE_DAY' | 'DELETE_DAY' | 'CLEAR_DAYS'
    payload?: DayObject[]
  }
): DaysStateType => {
  switch (action.type) {
    case 'CREATE_DAYS':
      return state.days && action.payload
        ? { days: [...state.days, ...action.payload] }
        : { days: action?.payload ? action.payload : null }
    case 'UPDATE_DAY':
      return (() => {
        const day = action?.payload && action.payload[0]
        return day && state.days
          ? { days: [...state.days.filter(existing => existing.id !== day.id), day] }
          : state
      })()
    case 'DELETE_DAY':
      return (() => {
        const id = action?.payload && action.payload[0].id
        return id && state.days ? { days: state.days.filter(day => day.id !== id) } : state
      })()
    case 'CLEAR_DAYS':
      return { days: null }

    default:
      return state
  }
}

export default days
