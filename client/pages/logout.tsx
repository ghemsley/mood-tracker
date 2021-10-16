import type { NextPage } from 'next'
import { useDispatch, useSelector } from 'react-redux'
import { FlexboxGrid, Loader } from 'rsuite'
import apiHooks from '../api'
import actions from '../redux/actions'

const Logout: NextPage = () => {
  const user = useSelector((state) => state.user.currentUser)
  const dispatch = useDispatch()
  const { data, loading, error } = apiHooks.useLogoutUser(!!user)
  user && dispatch(actions.logoutUser())
  if (loading) {
    return <Loader size="lg" center content="loading..." />
  } else if (error) {
    return (
      <FlexboxGrid justify="center" align="middle">
        <FlexboxGrid.Item colspan={100}>
          <p>{JSON.stringify(error)}</p>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    )
  } else
    return (
      <FlexboxGrid justify="center" align="middle">
        <FlexboxGrid.Item colspan={100}>
          <p>Logged out</p>
          <p>{data && JSON.stringify(data)}</p>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    )
}

export default Logout
