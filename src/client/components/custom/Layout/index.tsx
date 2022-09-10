import React from 'react'
import { Container, Nav, Navbar, Button } from 'react-bootstrap'
import { useSession, signIn, signOut } from "next-auth/react"
interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FunctionComponent<LayoutProps> = ({children}) => {
    
    return (
        <>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse className="d-flex justify-content-between" id="basic-navbar-nav">
                        <Nav className="d-flex justify-content-center">
                            <Nav.Link href="#home">Home</Nav.Link>
                            <Nav.Link href="#link">Link</Nav.Link>
                            <Nav.Link href="#link">Link</Nav.Link>
                            <Nav.Link href="#link">Link</Nav.Link>
                        </Nav>
                        <Button type="button" onClick={() => signOut({ redirect: true, callbackUrl: `/api/auth/signin?callbackUrl=${window.location.origin}` })}>Log out</Button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {children}
        </>
    )
}

export default Layout
