import type { NextPage } from 'next'
import { memo } from 'react'
import { Loader } from 'rsuite'
import apiHooks from '../api'
import Redirect from '../components/redirect'

const Logout: NextPage = memo(() => {
  const [data, errors] = apiHooks.useLogoutUser()
  return data || errors ? (
    <Redirect to="/login" />
  ) : (
    <Loader size="lg" center content="logging out..." />
  )
})

Logout.displayName = 'Logout'
export default Logout
