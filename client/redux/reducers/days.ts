import { DayObject } from '../../models/day'

const days = (
  state: DayObject[] = [],
  action: {
    type: 'CREATE_DAY' | 'CREATE_DAYS' | 'UPDATE_DAY' | 'DELETE_DAY' | 'CLEAR_DAYS'
    payload?: DayObject | DayObject[]
  }
) => {
  switch (action.type) {
    case 'CREATE_DAY':
      return action.payload ? [...state, action.payload as DayObject] : state
    case 'CREATE_DAYS':
      return action.payload ? [...state, ...(action.payload as DayObject[])] : state
    case 'UPDATE_DAY':
      return (() => {
        const day = action.payload as DayObject
        return day ? [...state.filter((existing) => existing.id !== day.id), day] : state
      })()
    case 'DELETE_DAY':
      return (() => {
        const { id } = action?.payload as DayObject
        return id ? state.filter((day) => day.id !== id) : state
      })()
    case 'CLEAR_DAYS':
      return []

    default:
      return state
  }
}

export default days
