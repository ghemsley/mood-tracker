import type { NextPage } from 'next'
import { FlexboxGrid, Panel, Form, ButtonToolbar, Button } from 'rsuite'
import { useDispatch } from 'react-redux'
import { FormEvent, useState } from 'react'
import apiHooks from '../api'
import actions from '../redux/actions'
import User from '../models/user'

const Login: NextPage = () => {
  const [startFetch, setStartFetch] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const { data, error, loading } = apiHooks.useLoginUser(email, password, startFetch)
  const handleSubmit = (checkStatus: boolean, event: FormEvent) => {
    event.preventDefault()
    setStartFetch(true)
  }
  if (data) {
    console.log(data)
    console.log(new User(data.user))
    data.user && dispatch(actions.createUser(new User(data.user)))
  } else if (error) {
    console.error(error)
  }
  return (
    <FlexboxGrid justify="center">
      <FlexboxGrid.Item colspan={12}>
        <Panel header={<h3>Log in</h3>} bordered>
          <Form fluid onSubmit={handleSubmit}>
            <Form.Group>
              <Form.ControlLabel>Email address</Form.ControlLabel>
              <Form.Control
                name="email"
                type="text"
                autoComplete="email"
                onChange={(value) => setEmail(value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Password</Form.ControlLabel>
              <Form.Control
                name="password"
                type="password"
                autoComplete="current-password"
                onChange={(value) => setPassword(value)}
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
