import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './assets/logo/inklidox_labs_black.png';
import './styles/LoginNavbarStyle.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function LoginHeader() {
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [username, setUsername] = useState(''); // State to hold the username

    useEffect(() => {
        // Retrieve the username from local storage or wherever it's stored
        const storedUsername = localStorage.getItem('username'); // Replace 'username' with your actual key
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username'); // Also remove username on logout
        navigate('/login');
        setShowLogoutModal(false);
    };

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };

    return (
        <>
            <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="/dashboard">
                        <img
                            src={logo}
                            alt="Inklidox Labs"
                            height="50"
                            className="d-inline-block align-top mr-2" // Added mr-2 for spacing
                        />
                        {username && <span className="mr-3" style={{marginLeft:'35px',marginTop:'20px'}}>Hi, {username.charAt(0).toUpperCase() + username.slice(1)}</span>} {/* Display username if available */}
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                        <Nav>
                            <Nav.Link href="/profile">Profile</Nav.Link>
                            <Nav.Link href="/settings">Settings</Nav.Link>
                            <Nav.Link href="/createurl">Create URL</Nav.Link>
                            <Nav.Link href="/createblog">Create Blogs</Nav.Link>
                            <Nav.Link href="/yourblog">Blogs</Nav.Link>
                            <Nav.Link href="#" className='logout-account-button' onClick={handleLogoutClick}>
                                <FontAwesomeIcon icon={faPowerOff} style={{ color: "#dd0303" }} />
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Modal show={showLogoutModal} onHide={cancelLogout}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Logout</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to logout?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={cancelLogout}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmLogout}>
                        Yes, Logout
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default LoginHeader;