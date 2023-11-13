import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { Toast, ToastContainer } from 'react-bootstrap';
import './MainPage.css';
import { useAuth } from '../contexts/AuthContext'; // Adjust the path as necessary
import logo from '../imgs/logo.svg';
import bus from '../imgs/bus.png';

export default function MainPage() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            setShowToast(true);
            navigate('/');
        } catch (error) {
            console.error("Failed to log out", error);
            // Handle logout error (e.g., show an error message)
        }
    };

    return (
        <Container className="min-vh-100 d-flex flex-column justify-content-between">
            <div>
                <Row className="mt-5">
                    <Col xs={12} md={4} lg={3} className="text-center text-md-left">
                        <img src={logo} alt="Logo" className="img-fluid" style={{ maxWidth: '120px' }} />
                        <p class="text-Color">· AccessiBus ·</p>
                    </Col>
                    <Col xs={12} md={8} lg={9} className="d-flex align-items-center justify-content-md-end">
                        {!currentUser ? (
                            <>
                                <Link to="/login">
                                    <Button variant="outline-success" className="mx-2">Login</Button>
                                </Link>
                                <Link to="/signup">
                                    <Button variant="outline-success" className="mx-2">Register</Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/findRoute">
                                    <Button variant="outline-success" className="mx-2">FindBus</Button>
                                </Link>
                                <Link to="/favoRoute">
                                    <Button variant="outline-success" className="mx-2">Favorite</Button>
                                </Link>
                                <Link to="/update-profile">
                                    <Button variant="outline-success" className="mx-2">Profile</Button>
                                </Link>
                                <Button variant="outline-danger" className="mx-2" onClick={handleLogout}>Logout</Button>
                            </>
                        )}
                    </Col>
                </Row>
            </div>

            <div className="my-auto">
                <Row className="my-4 text-center">
                    <Col>
                        <h1 className="display-4 text-light">Welcome to AccessiBus</h1>
                        <img src={bus} alt="bus" className="my-3 img-fluid" style={{ maxWidth: '200px' }} />
                        <h2 className="text-dark">---Ensuring accessible bus travel for everyone---</h2>
                    </Col>
                </Row>
            </div>
            <div>
                {/* Toast Container for logout success message */}
                <ToastContainer className="p-3" position="top-end">
                    <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
                        <Toast.Header>
                            <strong className="me-auto">Logout Successful</strong>
                        </Toast.Header>
                        <Toast.Body>You have been logged out.</Toast.Body>
                    </Toast>
                </ToastContainer>
            </div>

            {/* ... other components ... */}
        </Container>
    );
}