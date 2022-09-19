import React from 'react'
import { Container, Nav, Navbar, Button } from 'react-bootstrap'
import { useSession, signIn, signOut } from "next-auth/react"
import Link from 'next/link'
import { useRouter } from 'next/router';
interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FunctionComponent<LayoutProps> = ({children}) => {
    const router = useRouter()
    return (
        <>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse className="d-flex justify-content-between" id="basic-navbar-nav">
                        <Nav className="d-flex justify-content-center">
                            <Nav.Link href="/" onClick={(e: any) => { e.preventDefault(); router.push(e.target.href) }}>Home</Nav.Link>
                            <Nav.Link href="#link">Link</Nav.Link>
                            <Nav.Link href="#link">Link</Nav.Link>
                            <Nav.Link href="#link">Link</Nav.Link>
                        </Nav>
                        <div>
                            <Button type="button" className="mx-2" onClick={() => router.push('/chat')}>Chat</Button>
                            <Button type="button" onClick={() => signOut({ redirect: true, callbackUrl: `/api/auth/signin?callbackUrl=${window.location.origin}` })}>Log out</Button>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {children}
        </>
    )
}

export default Layout
