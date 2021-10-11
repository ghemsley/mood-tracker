import dayHooks from './days'
import userHooks from './users'

const apiHooks = { ...userHooks, ...dayHooks }

export default apiHooks
