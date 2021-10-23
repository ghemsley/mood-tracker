import type { NextPage } from 'next'
import { FlexboxGrid, Panel, Form, ButtonToolbar, Button, Message, Loader } from 'rsuite'
import { useSelector } from 'react-redux'
import { FormEvent, memo, useEffect, useRef, useState } from 'react'
import apiHooks from '../api'
import { UserObject } from '../models/user'
import Redirect from '../components/redirect'

const Login: NextPage = memo(() => {
  const user: UserObject | null | undefined = useSelector(state => state.user.currentUser)
  const [start, setStart] = useState(false)
  const [errors, setErrors] = useState<{ message: string }[]>([])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const started = useRef(false)
  const unmounting = useRef(false)
  apiHooks.useLoginUser(email, password, start, started, unmounting, setErrors).then(() => {
    started.current = false
    if (!unmounting.current) {
      setStart(prev => (prev ? false : prev))
    }
  })
  useEffect(() => {
    return () => {
      unmounting.current = true
    }
  }, [])
  const handleSubmit = (checkStatus: boolean, event: FormEvent) => {
    event.preventDefault()
    if (!unmounting.current) {
      setStart(prev => (!prev ? true : prev))
    }
  }

  return !start && user ? (
    <Redirect to="/calendar" />
  ) : start && errors.length < 1 && !user ? (
    <Loader center size="lg" content="logging in..." />
  ) : (
    <FlexboxGrid justify="center">
      <FlexboxGrid.Item colspan={12}>
        <Panel header={<h3>Log in</h3>} bordered>
          {errors.length > 0 && (
            <Message
              showIcon
              closable
              type="error"
              header="Error"
              onClose={event => event && setTimeout(() => setErrors([]), 300)}
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
