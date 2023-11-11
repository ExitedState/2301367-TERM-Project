import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import { Toast, ToastContainer } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext'; // Adjust the path as necessary

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
        <Container>
            {/* ... other components ... */}

            <Row className="justify-content-md-center mt-5">
                <Col md={6} className="text-center">
                    <Card>
                        <Card.Body>
                            <Card.Title as="h1">Welcome to AccessiBus</Card.Title>
                            <Card.Text>
                                Ensuring accessible bus travel for everyone.
                            </Card.Text>
                            {!currentUser && (
                                <>
                                    <Link to="/login">
                                        <Button variant="primary" size="lg" className="m-2">Login</Button>
                                    </Link>
                                    <Link to="/signup">
                                        <Button variant="success" size="lg" className="m-2">Register</Button>
                                    </Link>
                                </>
                            )}
                            {currentUser && (
                                <>
                                    <Button variant="danger" size="lg" className="m-2" onClick={handleLogout}>Logout</Button>
                                    <Link to="/update-profile">
                                        <Button variant="primary" size="lg" className="m-2">Profile</Button>
                                    </Link>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {/* Toast Container for logout success message */}
            <ToastContainer position="top-start">
                <Toast
                    onClose={() => setShowToast(false)}
                    show={showToast}
                    delay={3000}
                    autohide
                >
                    <Toast.Header>
                        <strong className="me-auto">Logout Successful</strong>
                    </Toast.Header>
                    <Toast.Body>You have been logged out.</Toast.Body>
                </Toast>
            </ToastContainer>
            {/* ... other components ... */}
        </Container>
    );
}
