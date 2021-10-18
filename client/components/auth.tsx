import { FunctionComponent, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'
import { Loader } from 'rsuite'
import apiHooks from '../api'
import { ThunkAppDispatch } from '../redux/store'
import actions from '../redux/actions'
import Redirect from './redirect'

const Auth: FunctionComponent = ({ children }) => {
  const currentUser = useSelector((state) => state.user.currentUser)
  const [startFetch, setStartFetch] = useState(false)
  const { data, error, loading } = apiHooks.useCheckAuth(startFetch)
  const dispatch: ThunkAppDispatch = useDispatch()
  if (!currentUser && !startFetch) {
    setStartFetch(true)
  }
  if (!currentUser && data?.user) {
    dispatch(actions.setAuthenticated(data.user)).then(() => {
      setStartFetch(false)
    })
  }
  return loading ? (
    <Loader size="lg" center content="loading..." />
  ) : currentUser ? (
    <>{children}</>
  ) : (
    <Redirect to="/login" />
  )
}

export default Auth
