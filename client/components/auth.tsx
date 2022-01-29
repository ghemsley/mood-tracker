import { FunctionComponent, memo, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Loader } from 'rsuite'
import apiHooks from '../api'
import { ThunkAppDispatch } from '../redux/store'
import actions from '../redux/actions'
import Redirect from './redirect'
import { useMountedState, usePromise } from 'react-use'

const Auth: FunctionComponent = memo(({ protectedRoute, children }) => {
  // const dispatch: ThunkAppDispatch = useDispatch()
  // const mounted = usePromise()
  // const isMounted = useMountedState()
  // useEffect(() => {
  //   if (isMounted()) mounted(dispatch(actions.resetAuthChecked()))
  // })
  const [data, errors] = apiHooks.useCheckAuth(protectedRoute)
  return data?.user || (errors && !protectedRoute) ? (
    <>{children}</>
  ) : errors ? (
    <Redirect to="/login" />
  ) : (
    <Loader size="lg" center content="Authenticating..." />
  )
})

Auth.displayName = 'Auth'

export default Auth
