import type { NextPage } from 'next'
import { FlexboxGrid, Panel, Form, ButtonToolbar, Button } from 'rsuite'
import { useDispatch } from 'react-redux'
import apiHooks from '../api'
import actions from '../redux/actions'
import { useState } from 'react'

const Signup: NextPage = () => {
  const [startFetch, setStartFetch] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const dispatch = useDispatch()
  const { data, error, loading } = apiHooks.useSignupUser(
    email,
    password,
    confirmPassword,
    startFetch
  )
  const handleSubmit = (event: Event) => {
    event.preventDefault()
    setStartFetch(true)
  }
  if (!stop && !loading && !error) {
    data && data.user && dispatch(actions.createUser(data.user))
  }
  return (
    <FlexboxGrid justify="center">
      <FlexboxGrid.Item colspan={12}>
        <Panel header={<h3>Sign up</h3>} bordered>
          <Form fluid>
            <Form.Group>
              <Form.ControlLabel>Email address</Form.ControlLabel>
              <Form.Control name="email" />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Password</Form.ControlLabel>
              <Form.Control name="password" />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Confirm password</Form.ControlLabel>
              <Form.Control name="confirmPassword" />
            </Form.Group>
            <Form.Group>
              <ButtonToolbar>
                <Button appearance="primary">Sign up</Button>
              </ButtonToolbar>
            </Form.Group>
          </Form>
        </Panel>
      </FlexboxGrid.Item>
    </FlexboxGrid>
  )
}

export default Signup
