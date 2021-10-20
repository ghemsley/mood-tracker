import { FunctionComponent, memo, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'
import { Loader } from 'rsuite'
import apiHooks from '../api'
import { ThunkAppDispatch } from '../redux/store'
import actions from '../redux/actions'
import Redirect from './redirect'
import { isUserObject } from '../models/user.guard'
import { UserObject } from '../models/user'

const Auth: FunctionComponent = memo(({ children }) => {
  const [start, setStart] = useState(false)
  const [done, setDone] = useState(false)
  const currentUser = useSelector(state => state.user.currentUser)
  useEffect(() => {
    !currentUser && !start && !done && setStart(true)
  }, [currentUser, start, done])
  apiHooks.useCheckAuth(start && !done).then(data => {
    setStart(false)
    setDone(true)
  })
  return done ? (
    currentUser ? (
      <>{children}</>
    ) : (
      <Redirect to="/login" />
    )
  ) : (
    <Loader size="lg" center content="loading..." />
  )
})

Auth.displayName = 'Auth'

export default Auth
