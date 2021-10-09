import { useState } from 'react'
import Link from 'next/link'
import { Container, Header, Content, Footer, Navbar, Nav } from 'rsuite'
import 'rsuite/dist/rsuite.min.css'
import NavLink from './navLink'

const Layout: React.FunctionComponent = ({ children }) => {
  const [expand, setExpand] = useState(true)
  return (
    <Container>
      <Header>
        <Navbar appearance="inverse">
          <Nav>
            <Nav.Item as={NavLink} href="/">
              Home
            </Nav.Item>
          </Nav>
        </Navbar>
      </Header>
      <Content>{children}</Content>
      <Footer>Footer</Footer>
    </Container>
  )
}

export default Layout