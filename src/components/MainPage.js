import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';

export default function MainPage() {
    return (
        <Container>
            <Row className="justify-content-md-center mt-5">
                <Col md={6} className="text-center">
                    <Card>
                        <Card.Body>
                            <Card.Title as="h1">Welcome to AccessiBus</Card.Title>
                            <Card.Text>
                                Ensuring accessible bus travel for everyone.
                            </Card.Text>
                            <Link to="/login">
                                <Button variant="primary" size="lg" className="m-2">Login</Button>
                            </Link>
                            <Link to="/signup">
                                <Button variant="success" size="lg" className="m-2">Register</Button>
                            </Link>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col md={12}>
                    <Card>
                        <Card.Body>
                            <Card.Title as="h2">About AccessiBus</Card.Title>
                            <Card.Text>
                                AccessiBus is dedicated to providing a comfortable and reliable bus service for people with disabilities. Our services are designed to be inclusive, with features such as...
                            </Card.Text>
                            {/* Add more information as needed */}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {/* Additional sections can be added here */}
        </Container>
    );
}
