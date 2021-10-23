import type { NextPage } from 'next'
import { useRouter } from 'next/dist/client/router'
import { memo, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FlexboxGrid, Loader } from 'rsuite'
import apiHooks from '../api'
import helpers from '../api/helpers'
import Auth from '../components/auth'
import Redirect from '../components/redirect'
import actions from '../redux/actions'
import { ThunkAppDispatch } from '../redux/store'

const Logout: NextPage = memo(() => {
  const [done, setDone] = useState(false)
  const [start, setStart] = useState(false)
  const started = useRef(false)
  const unmounting = useRef(false)
  apiHooks.useLogoutUser(!done && start, started, unmounting).then(data => {
    if (!unmounting.current) {
      start && setStart(false)
      !done && setDone(true)
    }
  })
  useLayoutEffect(() => {
    if (!start && !done && !started.current && !unmounting.current) {
      !start && setStart(true)
    }
    return () => {
      unmounting.current = true
    }
  }, [start, done])
  return (
    <Auth>
      {done ? <Redirect to="/login" /> : <Loader size="lg" center content="logging out..." />}
    </Auth>
  )
})

Logout.displayName = 'Logout'
export default Logout
