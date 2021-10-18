import type { NextPage } from 'next'
import { FlexboxGrid, Panel, Form, ButtonToolbar, Button, Message, Loader } from 'rsuite'
import { useDispatch, useSelector } from 'react-redux'
import { FormEvent, useState } from 'react'
import apiHooks from '../api'
import actions from '../redux/actions'
import User, { UserObject } from '../models/user'
import { useRouter } from 'next/dist/client/router'

const Login: NextPage = () => {
  const user: UserObject | undefined = useSelector((state) => state.user.currentUser)
  const router = useRouter()
  const [startFetch, setStartFetch] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const { data, error, loading } = apiHooks.useLoginUser(email, password, startFetch)
  const handleSubmit = (checkStatus: boolean, event: FormEvent) => {
    event.preventDefault()
    setStartFetch(true)
  }
  if (data?.user && !user?.id) {
    dispatch(actions.setAuthenticated(data.user))
  }
  if (user?.id) {
    router.push('/calendar')
  }
  if (error) {
    console.error(error)
  }
  return loading ? (
    <Loader center size="lg" content="loading..." />
  ) : (
    <FlexboxGrid justify="center">
      <FlexboxGrid.Item colspan={12}>
        <Panel header={<h3>Log in</h3>} bordered>
          {data?.errors && (
            <Message showIcon closable type="error" header="Error">
              {data.errors.map((error: { message: string }, i: number) => (
                <p key={error.message}>{error.message}</p>
              ))}
            </Message>
          )}
          <Form fluid onSubmit={handleSubmit}>
            <Form.Group>
              <Form.ControlLabel>Email address</Form.ControlLabel>
              <Form.Control
                name="email"
                type="text"
                autoComplete="email"
                onChange={(value) => {
                  setStartFetch(false)
                  setEmail(value)
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Password</Form.ControlLabel>
              <Form.Control
                name="password"
                type="password"
                autoComplete="current-password"
                onChange={(value) => {
                  setStartFetch(false)
                  setPassword(value)
                }}
              />
            </Form.Group>
            <Form.Group>
              <ButtonToolbar>
                <Button appearance="primary" type="submit">
                  Log in
                </Button>
                <Button appearance="link">Forgot password?</Button>
              </ButtonToolbar>
            </Form.Group>
          </Form>
        </Panel>
      </FlexboxGrid.Item>
    </FlexboxGrid>
  )
}

export default Login
