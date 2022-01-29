import days, { DayActionType } from './days'
import users, { UserActionType } from './users'

const actions = { ...days, ...users }

export type ActionType = DayActionType | UserActionType

export default actions
