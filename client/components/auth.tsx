import { FunctionComponent, memo, useEffect, useRef, useState } from 'react'
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
  const unmounting = useRef(false)
  const user = useSelector(state => state.user.currentUser)
  useEffect(() => {
    if (!unmounting && !user && !start && !done) {
      setStart(true)
    }
    return () => {
      unmounting.current = true
    }
  }, [user, start, done, unmounting])
  apiHooks.useCheckAuth(start && !done, unmounting).then(data => {
    if (!unmounting.current) {
      start && setStart(false)
      !done && setDone(true)
    }
  })
  return done ? (
    user ? (
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
