import User from '../../models/user'

interface UserObject {
  id?: number
  email?: string
  password?: string
  admin?: boolean
  enabled?: string
  createdAt?: number
  updatedAt?: number
}
type Payload = User | UserObject

const users = {
  createUser: (payload: Payload) => ({ type: 'CREATE_USER', payload }),
  logoutUser: () => ({ type: 'LOGOUT_USER' }),
}

export default users
