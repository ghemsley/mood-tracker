import { memo } from 'react'
import { Container, Header, Content, Footer, Navbar, Nav, Loader } from 'rsuite'
import 'rsuite/dist/rsuite.min.css'
import NavLink from './navLink'
import { useSelector } from 'react-redux'
import Auth from './auth'

const Layout: React.FunctionComponent = ({ children }) => {
  const currentUser = useSelector((state) => state.user.currentUser)
  return (
    <Container>
      <Header>
        <Navbar appearance="inverse">
          <Nav>
            <Nav.Item as={NavLink} href="/">
              Home
            </Nav.Item>
            <Nav.Item as={NavLink} href="/calendar">
              Calendar
            </Nav.Item>
            {currentUser ? (
              <Nav.Item as={NavLink} href="/logout">
                Log out
              </Nav.Item>
            ) : (
              <>
                <Nav.Item as={NavLink} href="/login">
                  Log in
                </Nav.Item>
                <Nav.Item as={NavLink} href="/signup">
                  Sign up
                </Nav.Item>
              </>
            )}
          </Nav>
        </Navbar>
      </Header>
      <Content>{children}</Content>
      <Footer>Footer</Footer>
    </Container>
  )
}

export default Layout
