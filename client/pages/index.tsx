import type { NextPage } from 'next'
import { useDispatch, useSelector } from 'react-redux'
import apiHooks from '../api'
import actions from '../redux/actions'

const Home: NextPage = () => {
  const currentUser = useSelector((state) => state.user.currentUser)
  const { data, error, loading } = apiHooks.useFetchDays({ userId: currentUser.id }, true)
  error && console.error(error)

  return <div>{JSON.stringify(data)}</div>
}

export default Home
