import { memo } from 'react'
import { Container, Header, Content, Footer, Navbar, Nav, Loader } from 'rsuite'
import 'rsuite/dist/rsuite.min.css'
import NavLink from './navLink'
import { useSelector } from 'react-redux'
import Auth from './auth'
import { useRouter } from 'next/router'

const Layout: React.FunctionComponent = memo(({ children }) => {
  const currentUser = useSelector(state => state.user.currentUser)
  const router = useRouter()
  const protectedRoutes = new Set(['/calendar', '/logout'])
  return (
    <Container>
      <Header>
        <Navbar appearance="inverse">
          <Nav>
            <Nav.Item as={NavLink} href="/">
              Home
            </Nav.Item>
            {currentUser ? (
              <>
                <Nav.Item as={NavLink} href="/dayform">
                  Add mood entry
                </Nav.Item>
                <Nav.Item as={NavLink} href="/calendar">
                  Calendar
                </Nav.Item>
                <Nav.Item as={NavLink} href="/logout">
                  Log out
                </Nav.Item>
              </>
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
      <Content>{protectedRoutes.has(router.pathname) ? <Auth>{children}</Auth> : children}</Content>
      <Footer>Footer</Footer>
    </Container>
  )
})

Layout.displayName = 'Layout'

export default Layout
