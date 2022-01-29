import type { NextPage } from 'next'
import { FlexboxGrid, Panel, Form, Schema, ButtonToolbar, Button, Message, Loader } from 'rsuite'
import { useSelector } from 'react-redux'
import { FormEvent, memo, useEffect, useState } from 'react'
import apiHooks from '../api'
import { UserObject } from '../models/user'
import Redirect from '../components/redirect'
import { useMountedState } from 'react-use'
import { ErrorType } from '../api/helpers'

const model = Schema.Model({
  email: Schema.Types.StringType()
    .isEmail('Please enter a valid email address')
    .isRequired('This field is required'),
  password: Schema.Types.StringType()
    .minLength(8, 'Passwords must be at least eight characters')
    .isRequired('This field is required'),
})

const Login: NextPage = memo(() => {
  const user: UserObject | null = useSelector(state => state.user.currentUser)
  const [errors, setErrors] = useState<ErrorType['errors'] | null>(null)
  const [start, setStart] = useState(false)
  const [done, setDone] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const isMounted = useMountedState()
  useEffect(() => {
    if (start && isMounted()) {
      setStart(false)
    }
  }, [start, isMounted])
  apiHooks.useLoginUser(email, password, start, setErrors).then(([data, errors]) => {
    if (!done && (data || errors) && isMounted()) setDone(true)
  })
  const handleSubmit = (checkStatus: boolean, event: FormEvent) => {
    event.preventDefault()
    const validation = model.check({ email, password })
    let valid = true
    for (const [key, value] of Object.entries(validation)) {
      if (value.hasError) valid = false
      break
    }
    if (valid && checkStatus && done && isMounted()) {
      errors && setErrors(null)
      !start && setStart(true)
      setDone(false)
    }
  }
  return done && user ? (
    <Redirect to="/calendar" />
  ) : !done ? (
    <Loader center size="lg" content="logging in..." />
  ) : (
    <FlexboxGrid justify="center">
      <FlexboxGrid.Item colspan={12}>
        <Panel header={<h3>Log in</h3>} bordered>
          {errors && errors.length > 0 && (
            <Message
              showIcon
              closable
              type="error"
              header="Error"
              onClose={event => {
                if (event && isMounted()) setErrors(null)
              }}
            >
              {errors.map((error: { message: string }, i: number) => (
                <p key={i}>{error.message}</p>
              ))}
            </Message>
          )}
          <Form fluid onSubmit={handleSubmit} model={model}>
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
