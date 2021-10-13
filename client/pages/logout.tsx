import type { NextPage } from 'next'
import { useDispatch, useSelector } from 'react-redux'
import { Loader } from 'rsuite'
import apiHooks from '../api'
import actions from '../redux/actions'

const Logout: NextPage = () => {
  const user = useSelector((state) => state.user.currentUser)
  const dispatch = useDispatch()
  const { data, loading, error } = apiHooks.useLogoutUser(true)
  user && dispatch(actions.logoutUser())
  if (loading) {
    return <Loader size="lg" center content="loading..." />
  } else if (error) {
    return <p>Error</p>
  } else return <p>Logged out</p>
}

export default Logout
