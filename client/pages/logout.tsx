import type { NextPage } from 'next'
import { useRouter } from 'next/dist/client/router'
import { memo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FlexboxGrid, Loader } from 'rsuite'
import apiHooks from '../api'
import helpers from '../api/helpers'
import actions from '../redux/actions'
import { ThunkAppDispatch } from '../redux/store'

const Logout: NextPage = memo(() => {
  const user = useSelector((state) => state.user.currentUser)
  const dispatch: ThunkAppDispatch = useDispatch()
  const router = useRouter()
  const { data, loading, error } = apiHooks.useLogoutUser(user)
  data?.token &&
    user &&
    (() => {
      helpers.deleteToken()
      dispatch(actions.clearDays())
      dispatch(actions.setUnauthenticated()).then(() => router.push('/'))
    })()
  if (loading) {
    return <Loader size="lg" center content="loading..." />
  } else if (error) {
    return (
      <FlexboxGrid justify="center" align="middle">
        <FlexboxGrid.Item colspan={100}>
          <p>{JSON.stringify(error)}</p>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    )
  } else
    return (
      <FlexboxGrid justify="center" align="middle">
        <FlexboxGrid.Item colspan={100}>
          <p>Logged out</p>
          <p>{data && JSON.stringify(data)}</p>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    )
})

Logout.displayName = 'Logout'
export default Logout
