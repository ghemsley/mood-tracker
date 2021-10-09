import { combineReducers } from 'redux'
import days from './days'
import users from './user'

const reducers = combineReducers({ ...days, ...users })

export default reducers
