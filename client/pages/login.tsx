import type { NextPage } from 'next'
import { FlexboxGrid, Panel, Form, ButtonToolbar, Button, Message, Loader } from 'rsuite'
import { useSelector } from 'react-redux'
import { FormEvent, memo, useState } from 'react'
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
  apiHooks.useLoginUser(email, password, start).then(data => {
    if (user) {
      start && setStart(false)
      !done && setDone(true)
    } else {
      if (data && (data as { errors: { message: string } })?.errors) {
        const { errors } = data as { errors: { message: string }[] }
        start && setStart(false)
        setErrors(errors)
        !done && setDone(true)
      }
    }
  })
  const handleSubmit = (checkStatus: boolean, event: FormEvent) => {
    event.preventDefault()
    done && setDone(false)
    !start && setStart(true)
  }

  return done && !!user ? (
    <Redirect to="/calendar" />
  ) : start && !user && !errors ? (
    <Loader center size="lg" content="logging in..." />
  ) : !user ? (
    <FlexboxGrid justify="center">
      <FlexboxGrid.Item colspan={12}>
        <Panel header={<h3>Log in</h3>} bordered>
          {errors && (
            <Message showIcon closable type="error" header="Error">
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
                  errors && setErrors(undefined)
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
                  errors && setErrors(undefined)
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
  ) : (
    <p>Error</p>
  )
})

Login.displayName = 'Login'

export default Login
