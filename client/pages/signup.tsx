import type { NextPage } from 'next'
import { FormEvent, memo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, ButtonToolbar, FlexboxGrid, Form, Loader, Message, Panel } from 'rsuite'
import apiHooks from '../api'
import Redirect from '../components/redirect'
import { UserObject } from '../models/user'

const Signup: NextPage = memo(() => {
  const user: UserObject | undefined = useSelector(state => state.user.currentUser)
  const [start, setStart] = useState(false)
  const [done, setDone] = useState(false)
  const [errors, setErrors] = useState<{ message: string }[] | undefined>(undefined)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [validationErrors, setValidationErrors] = useState(new Array<string>())
  apiHooks
    .useSignupUser(email, password, confirmPassword, start, done, setErrors)
    .then(data => {
      start && setStart(false)
      !done && setDone(true)
      return data
    })
    .then(data => data?.errors && setErrors(data.errors))
  const handleSubmit = (checkStatus: boolean, event: FormEvent) => {
    event.preventDefault()
    let emailGood = false
    let passwordCheckGood = false
    let passwordLengthGood = false
    if (/\w+@\w+\.\w+/i.test(email)) {
      emailGood = true
    } else
      setValidationErrors(prev => {
        const message = 'Invalid email address'
        return prev.find(element => element === message) ? prev : [...prev, message]
      })
    if (password === confirmPassword) {
      passwordCheckGood = true
    } else
      setValidationErrors((prev: string[]) => {
        const message = 'Passwords do not match'
        return prev.find(element => element === message) ? prev : [...prev, message]
      })
    if (password.length >= 8) {
      passwordLengthGood = true
    } else
      setValidationErrors((prev: string[]) => {
        const message = 'Password length must be eight characters or more'
        return prev.find(element => element === message) ? prev : [...prev, message]
      })
    if (emailGood && passwordCheckGood && passwordLengthGood) {
      setErrors(undefined)
      setDone(true)
      setStart(true)
    }
  }
  return done && user ? (
    <Redirect to="/calendar" />
  ) : start && !done && !errors ? (
    <Loader center size="lg" content="loading..." />
  ) : (
    <FlexboxGrid justify="center">
      <FlexboxGrid.Item colspan={12}>
        <Panel header={<h3>Sign up</h3>} bordered>
          {((!!errors && errors.length > 0) || validationErrors.length > 0) && (
            <Message
              showIcon
              closable
              type="error"
              header="Error"
              onClose={event => {
                event && setTimeout(() => setValidationErrors([]), 300)
              }}
            >
              {validationErrors.map(
                (error: string, i: number) => error !== '' && <p key={i * Math.random()}>{error}</p>
              )}
              {errors?.map((error, i: number) => (
                <p key={i * Math.random()}>{error.message}</p>
              ))}
            </Message>
          )}
          <Form fluid onSubmit={handleSubmit}>
            <Form.Group>
              <Form.ControlLabel>Email address</Form.ControlLabel>
              <Form.Control
                name="email"
                onChange={value => {
                  done && setDone(false)
                  start && setStart(false)
                  setEmail(value)
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Password</Form.ControlLabel>
              <Form.Control
                name="password"
                type="password"
                onChange={value => {
                  done && setDone(false)
                  start && setStart(false)
                  setPassword(value)
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Confirm password</Form.ControlLabel>
              <Form.Control
                name="confirmPassword"
                type="password"
                onChange={value => {
                  done && setDone(false)
                  start && setStart(false)
                  setConfirmPassword(value)
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
