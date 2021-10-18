import type { NextPage } from 'next'
import { FlexboxGrid, Panel, Form, ButtonToolbar, Button, Message, Loader } from 'rsuite'
import { useDispatch, useSelector } from 'react-redux'
import apiHooks from '../api'
import actions from '../redux/actions'
import { FormEvent, useState } from 'react'
import { UserObject } from '../models/user'
import { useRouter } from 'next/dist/client/router'

const Signup: NextPage = () => {
  const user: UserObject | undefined = useSelector((state) => state.user.currentUser)
  const router = useRouter()
  const [startFetch, setStartFetch] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [validationErrors, setValidationErrors] = useState(new Array<string>())
  const { data, error, loading } = apiHooks.useSignupUser(
    email,
    password,
    confirmPassword,
    startFetch
  )
  const dispatch = useDispatch()
  const handleSubmit = (checkStatus: boolean, event: FormEvent) => {
    event.preventDefault()
    let emailGood = false
    let passwordCheckGood = false
    let passwordLengthGood = false
    if (/\w+@\w+\.\w+/i.test(email)) {
      emailGood = true
    } else
      setValidationErrors((prev) => {
        const message = 'Invalid email address'
        return prev.find((element) => element === message) ? prev : [...prev, message]
      })
    if (password === confirmPassword) {
      passwordCheckGood = true
    } else
      setValidationErrors((prev: string[]) => {
        const message = 'Passwords do not match'
        return prev.find((element) => element === message) ? prev : [...prev, message]
      })
    if (password.length >= 8) {
      passwordLengthGood = true
    } else
      setValidationErrors((prev: string[]) => {
        const message = 'Password length must be eight characters or more'
        return prev.find((element) => element === message) ? prev : [...prev, message]
      })
    if (emailGood && passwordCheckGood && passwordLengthGood) setStartFetch(true)
  }
  if (data?.user && !user?.id) {
    dispatch(actions.setAuthenticated(data.user))
  }
  if (user?.id) {
    router.push('/calendar')
  }
  if (error) {
    console.log('error', error)
  }
  return loading ? (
    <Loader center size="lg" content="loading..." />
  ) : (
    <FlexboxGrid justify="center">
      <FlexboxGrid.Item colspan={12}>
        <Panel header={<h3>Sign up</h3>} bordered>
          {(data?.errors || validationErrors.length > 0) && (
            <Message showIcon closable type="error" header="Error">
              {validationErrors.map(
                (error: string, i: number) => error !== '' && <p key={i}>{error}</p>
              )}
              {data?.errors.map((error: { message: string }, i: number) => (
                <p key={-i}>{error.message}</p>
              ))}
            </Message>
          )}
          <Form fluid onSubmit={handleSubmit}>
            <Form.Group>
              <Form.ControlLabel>Email address</Form.ControlLabel>
              <Form.Control
                name="email"
                onChange={(value) => {
                  setValidationErrors([])
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
                onChange={(value) => {
                  setValidationErrors([])
                  setStartFetch(false)
                  setPassword(value)
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Confirm password</Form.ControlLabel>
              <Form.Control
                name="confirmPassword"
                type="password"
                onChange={(value) => {
                  setValidationErrors([])
                  setStartFetch(false)
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
}

export default Signup
