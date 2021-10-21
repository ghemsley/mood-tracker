import type { NextPage } from 'next'
import { FlexboxGrid, Panel, Form, ButtonToolbar, Button, Message, Loader } from 'rsuite'
import { useSelector } from 'react-redux'
import { FormEvent, memo, useEffect, useState } from 'react'
import apiHooks from '../api'
import { UserObject } from '../models/user'
import Redirect from '../components/redirect'

const Login: NextPage = memo(() => {
  const user: UserObject | null | undefined = useSelector(state => state.user.currentUser)
  const [start, setStart] = useState(false)
  const [done, setDone] = useState(false)
  const [errors, setErrors] = useState<{ message: string }[] | undefined>(undefined)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  apiHooks.useLoginUser(email, password, start, done, setErrors).then((data: any) => {
    setStart(false)
    setDone(true)
  })
  const handleSubmit = (checkStatus: boolean, event: FormEvent) => {
    event.preventDefault()
    setErrors(undefined)
    setDone(true)
    setStart(true)
  }

  return done && user ? (
    <Redirect to="/calendar" />
  ) : start && !done && !errors ? (
    <Loader center size="lg" content="logging in..." />
  ) : (
    <FlexboxGrid justify="center">
      <FlexboxGrid.Item colspan={12}>
        <Panel header={<h3>Log in</h3>} bordered>
          {!!errors && (
            <Message
              showIcon
              closable
              type="error"
              header="Error"
              onClose={event => event && setTimeout(() => setErrors(undefined), 300)}
            >
              {errors.map((error: { message: string }, i: number) => (
                <p key={i}>{error.message}</p>
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
                onChange={value => {
                  start && setStart(false)
                  done && setDone(false)
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
                onChange={value => {
                  start && setStart(false)
                  done && setDone(false)
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
})

Login.displayName = 'Login'

export default Login
