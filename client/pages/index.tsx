import type { NextPage } from 'next'
import { useDispatch, useSelector } from 'react-redux'
import { FlexboxGrid } from 'rsuite'
import apiHooks from '../api'
import actions from '../redux/actions'

const Home: NextPage = () => {
  const currentUser = useSelector((state) => state.user.currentUser)
  const { data, error, loading } = apiHooks.useFetchDays(
    { userId: currentUser && currentUser.id },
    currentUser
  )
  error && console.error(error)

  return (
    <FlexboxGrid justify="center" align="middle">
      <FlexboxGrid.Item colspan={100}>
        <p>{data && JSON.stringify(data)}</p>
      </FlexboxGrid.Item>
    </FlexboxGrid>
  )
}

export default Home
