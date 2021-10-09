import type { NextPage } from 'next'
import { FlexboxGrid, Panel, Form, ButtonToolbar, Button } from 'rsuite'
import { useDispatch } from 'react-redux'
import apiHooks from '../api'
import actions from '../redux/actions'

const Home: NextPage = () => {
  const dispatch = useDispatch()
  const { data, error, loading } = apiHooks.useFetchUserByEmail('user@example.com')
  return (
    <FlexboxGrid justify="center">
      <FlexboxGrid.Item colspan={12}>
        <Panel header={<h3>Login</h3>} bordered>
          <Form fluid>
            <Form.Group>
              <Form.ControlLabel>Username or email address</Form.ControlLabel>
              <Form.Control name="name" />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Password</Form.ControlLabel>
              <Form.Control name="password" />
            </Form.Group>
            <Form.Group>
              <ButtonToolbar>
                <Button appearance="primary">Sign in</Button>
                <Button appearance="link">Forgot password?</Button>
              </ButtonToolbar>
            </Form.Group>
          </Form>
        </Panel>
      </FlexboxGrid.Item>
    </FlexboxGrid>
  )
}
