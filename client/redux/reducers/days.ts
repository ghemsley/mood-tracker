import Day from '../../models/day'

const days = (
  state: {
    id?: number
    userId?: number
    rating?: number
    mood?: string
    meals?: number
    water?: number
    people?: number
    activities?: number
    meds?: boolean
    exercise?: boolean
    journal?: string
    updatedAt?: number
  }[] = [],
  action: {
    type: string
    payload?: Day
  }
) => {
  switch (action.type) {
    case 'CREATE_DAY':
      return action.payload ? [...state, action.payload.toObject()] : state
    case 'UPDATE_DAY':
      return (() => {
        const id = action.payload && action.payload.id
        const day = action.payload && action.payload.toObject()
        return day ? [...state.filter((existing) => existing.id !== id), day] : state
      })()
    case 'DELETE_DAY':
      return (() => {
        const id = action.payload && action.payload.id
        return id ? state.filter((day) => day.id !== id) : state
      })()
    case 'CLEAR_DAYS':
      return []

    default:
      return state
  }
}

export default days
