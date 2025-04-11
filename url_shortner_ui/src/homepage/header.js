import React from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './assets/logo/inklidox_labs_black.png';
import './styles/NavbarStyle.css';

function Header() {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login'); // Navigate to the /login route
    };

    const handleCreateAccountClick = () => {
        navigate('/register'); // Navigate to the /register route (assuming you have one)
    };

    return (
        <>
            <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="/"> {/* Changed to '/' for the home page */}
                        <img
                            src={logo}
                            alt="Inklidox Labs"
                            height="50"
                            className="d-inline-block align-top"
                        />{' '}
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                        <Nav>
                            <Nav.Link href="/blogs">Blogs</Nav.Link> {/* Changed to /blogs */}
                            <Nav.Link href="/pricing">Pricing</Nav.Link> {/* Changed to /pricing */}
                            <Nav.Link href="/about" style={{ marginRight: '10px' }}>About</Nav.Link> {/* Changed to /about */}
                            <Nav.Link
                                href="#"
                                className='create-account-button'
                                style={{ marginRight: '10px' }}
                                onClick={handleCreateAccountClick}
                            >
                                Create Account
                            </Nav.Link>
                            <Nav.Link
                                href="#"
                                className='login-account-button'
                                onClick={handleLoginClick}
                            >
                                Login
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}

export default Header;