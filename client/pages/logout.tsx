import type { NextPage } from 'next'
import { useRouter } from 'next/dist/client/router'
import { memo, useEffect, useState } from 'react'
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
  useEffect(() => {
    !start && !done && setStart(true)
  }, [start, done])
  apiHooks.useLogoutUser(!done && start).then(data => setDone(true))
  return done ? (
    <Redirect to="/login" />
  ) : (
    <Auth>
      <Loader size="lg" center content="logging out..." />
    </Auth>
  )
})

Logout.displayName = 'Logout'
export default Logout
