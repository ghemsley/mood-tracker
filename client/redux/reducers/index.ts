import { combineReducers } from 'redux'
import days from './days'
import user from './user'

const reducers = combineReducers({ days, user })

export default reducers
