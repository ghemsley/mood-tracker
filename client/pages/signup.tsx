import type { NextPage } from 'next'
import { FormEvent, memo, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useMountedState } from 'react-use'
import { Button, ButtonToolbar, FlexboxGrid, Form, Loader, Message, Panel } from 'rsuite'
import apiHooks from '../api'
import { ErrorType } from '../api/helpers'
import Redirect from '../components/redirect'
import { UserObject } from '../models/user'

const Signup: NextPage = memo(() => {
  const user: UserObject | null | undefined = useSelector(state => state.user.currentUser)
  const [start, setStart] = useState(false)
  const [done, setDone] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<ErrorType['errors'] | null>(null)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const isMounted = useMountedState()
  useEffect(() => {
    if (start && isMounted()) {
      setStart(false)
    }
  }, [start, isMounted])
  apiHooks
    .useSignupUser(email, password, confirmPassword, start, setErrors)
    .then(([data, errors]) => {
      if (!done && (data || errors) && isMounted()) setDone(true)
    })
  const displayErrors = (message: string) => {
    setValidationErrors((prev: string[]) => {
      return prev.find(element => element === message) ? prev : [...prev, message]
    })
  }
  const handleSubmit = (checkStatus: boolean, event: FormEvent) => {
    event.preventDefault()
    let emailGood = false
    let passwordMatchGood = false
    let passwordLengthGood = false
    if (/\w+@\w+\.\w+/i.test(email)) {
      emailGood = true
    } else displayErrors('Invalid email address')
    if (password === confirmPassword) {
      passwordMatchGood = true
    } else displayErrors('Passwords must match')
    if (password.length > 7) {
      passwordLengthGood = true
    } else displayErrors('Password must be at least eight characters')
    if (emailGood && passwordMatchGood && passwordLengthGood && done && isMounted()) {
      errors && setErrors(null)
      !start && setStart(true)
      setDone(false)
    }
  }
  return done && user ? (
    <Redirect to="/calendar" />
  ) : !done ? (
    <Loader center size="lg" content="loading..." />
  ) : (
    <FlexboxGrid justify="center">
      <FlexboxGrid.Item colspan={12}>
        <Panel header={<h3>Sign up</h3>} bordered>
          {((errors && errors.length > 0) || validationErrors.length > 0) && (
            <Message
              showIcon
              closable
              type="error"
              header="Error"
              onClose={event => {
                if (event && isMounted()) {
                  setErrors(null)
                  setValidationErrors([])
                }
              }}
            >
              {validationErrors.map(
                (error: string, i: number) => error !== '' && <p key={i * Math.random()}>{error}</p>
              )}
              {errors &&
                errors.map((error, i: number) => <p key={i * Math.random()}>{error.message}</p>)}
            </Message>
          )}
          <Form fluid onSubmit={handleSubmit}>
            <Form.Group>
              <Form.ControlLabel>Email address</Form.ControlLabel>
              <Form.Control
                name="email"
                onChange={value => {
                  if (isMounted()) {
                    setEmail(value)
                  }
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Password</Form.ControlLabel>
              <Form.Control
                name="password"
                type="password"
                onChange={value => {
                  if (isMounted()) {
                    setPassword(value)
                  }
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Confirm password</Form.ControlLabel>
              <Form.Control
                name="confirmPassword"
                type="password"
                onChange={value => {
                  if (isMounted()) {
                    setConfirmPassword(value)
                  }
                }}
              />
            </Form.Group>
            <Form.Group>
              <ButtonToolbar>
                <Button appearance="primary" type="submit">
                  Sign up
                </Button>
              </ButtonToolbar>
            </Form.Group>
          </Form>
        </Panel>
      </FlexboxGrid.Item>
    </FlexboxGrid>
  )
})

Signup.displayName = 'Signup'

export default Signup
