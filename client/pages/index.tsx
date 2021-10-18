import type { NextPage } from 'next'
import { useDispatch, useSelector } from 'react-redux'
import { FlexboxGrid } from 'rsuite'
import apiHooks from '../api'
import actions from '../redux/actions'

const Home: NextPage = () => {
  const currentUser = useSelector((state) => state.user.currentUser)

  return (
    <FlexboxGrid justify="center" align="middle">
      <FlexboxGrid.Item colspan={100}>
        <p>{currentUser && JSON.stringify(currentUser)}</p>
      </FlexboxGrid.Item>
    </FlexboxGrid>
  )
}

export default Home
