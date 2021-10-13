const users = {
  createUser: (payload: any) => ({ type: 'CREATE_USER', payload }),
  logoutUser: () => ({ type: 'LOGOUT_USER' }),
}

export default users
