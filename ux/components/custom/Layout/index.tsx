import { useAPI } from '@hooks/useAPI'
import React, { useEffect } from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'

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
                    <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="d-flex justify-content-center">
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#link">Link</Nav.Link>
                        <Nav.Link href="#link">Link</Nav.Link>
                        <Nav.Link href="#link">Link</Nav.Link>
                    </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {children}
        </>
    )
}

export default Layout
