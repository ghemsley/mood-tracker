import { FunctionComponent, memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'
import { Loader } from 'rsuite'
import apiHooks from '../api'
import { ThunkAppDispatch } from '../redux/store'
import actions from '../redux/actions'
import Redirect from './redirect'
import { isUserObject } from '../models/user.guard'
import { UserObject } from '../models/user'
import { AuthenticationType, ErrorType } from '../api/helpers'
import { useMountedState } from 'react-use'

const Auth: FunctionComponent = memo(({ children }) => {
  const [data, errors] = apiHooks.useCheckAuth()
  return data?.user ? (
    <>{children}</>
  ) : errors ? (
    <Redirect to="/login" />
  ) : (
    <Loader size="lg" center content="authenticating..." />
  )
})

Auth.displayName = 'Auth'

export default Auth
