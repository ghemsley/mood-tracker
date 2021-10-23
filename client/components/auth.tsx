import { FunctionComponent, memo, useLayoutEffect, useRef, useState } from 'react'
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
  const user = useSelector(state => state.user.currentUser)
  const [start, setStart] = useState(false)
  const started = useRef(false)
  const unmounting = useRef(false)
  apiHooks.useCheckAuth(start, started, unmounting).then(data => {
    if (!unmounting.current) {
      start && setStart(false)
    }
  })
  useLayoutEffect(() => {
    if (!unmounting.current && !user && !start) {
      setStart(true)
    }
    return () => {
      unmounting.current = true
    }
  }, [user, start])
  return user ? (
    <>{children}</>
  ) : start ? (
    <Loader size="lg" center content="loading..." />
  ) : (
    <Redirect to="/login" />
  )
})

Auth.displayName = 'Auth'

export default Auth
