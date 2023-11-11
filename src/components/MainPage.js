import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext'; // Adjust the path as necessary

export default function MainPage() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [logoutError, setLogoutError] = useState("");

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error("Failed to log out", error);
            // Handle logout error (e.g., show an error message)
            setLogoutError("Failed to log out. Please try again.");
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
                                {logoutError && <Alert variant="danger">{logoutError}</Alert>}
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

            {/* ... other components ... */}
        </Container>
    );
}
