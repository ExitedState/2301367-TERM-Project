import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, getDocs, query, where, orderBy, updateDoc, doc } from 'firebase/firestore';
import { firestore } from '../config/firebase';
import { ListGroup, Card, Button, Row, Col } from 'react-bootstrap';
import { GeoAltFill } from 'react-bootstrap-icons';
import { Toast, ToastContainer } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../imgs/logo.png';

const FavoRoutes = () => {
    const { currentUser, logout } = useAuth();
    const [favoriteRoutes, setFavoriteRoutes] = useState([]);
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
    useEffect(() => {
        if (currentUser) {
            const favoritesQuery = query(
                collection(firestore, 'recentSearches'),
                where('userId', '==', currentUser.uid),
                where('isFavorite', '==', true),
                orderBy('timestamp', 'desc')
            );

            getDocs(favoritesQuery)
                .then(querySnapshot => {
                    const favs = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setFavoriteRoutes(favs);
                })
                .catch(error => {
                    console.error("Error fetching favorite routes: ", error);
                });
        }
    }, [currentUser]);

    const redirectToGoogleMaps = (start, destination) => {
        const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(start)}&destination=${encodeURIComponent(destination)}&travelmode=transit`;
        window.open(googleMapsDirectionsUrl, '_blank');
    };

    const removeFavorite = async (routeId) => {
        // Create a reference to the Firestore document
        const routeRef = doc(firestore, 'recentSearches', routeId);

        try {
            // Update the 'isFavorite' field to false
            await updateDoc(routeRef, {
                isFavorite: false
            });

            // Optimistically update the local state to remove the route from the UI
            setFavoriteRoutes(favoriteRoutes.filter(route => route.id !== routeId));
        } catch (error) {
            console.error("Error removing favorite route: ", error);
        }
    };
    return (
        <div>
            {/* Header - similar to MainPage */}
            <Row className="mt-5 mx-auto" style={{ maxWidth: '1400px' }}>
                <Col xs={12} md={4} lg={3} className="text-center text-md-left">
                    <img src={logo} alt="Logo" className="img-fluid" style={{ maxWidth: '120px' }} />
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
                            <Link to="/">
                                <Button variant="outline-success" className="mx-2">Home</Button>
                            </Link>
                            <Link to="/findRoute">
                                <Button variant="outline-success" className="mx-2">FindBus</Button>
                            </Link>
                            <Link to="/update-profile">
                                <Button variant="outline-success" className="mx-2">Profile</Button>
                            </Link>
                            <Button variant="outline-danger" className="mx-2" onClick={handleLogout}>Logout</Button>
                            {/* Include Logout Button if needed */}
                        </>
                    )}
                </Col>
            </Row>
            <Card className="my-3 mx-auto" style={{ maxWidth: '888px' }}>
                <Card.Body>
                    <ListGroup>
                        {favoriteRoutes.map((route, index) => (
                            <ListGroup.Item
                                key={route.id || index}
                                className="d-flex justify-content-between align-items-center"
                                style={{ userSelect: 'none' }}
                            >
                                <div className="me-auto" onClick={() => redirectToGoogleMaps(route.startLocation, route.destination)} style={{ flex: 1, cursor: 'pointer' }}>
                                    <div className="fw-bold">From: <GeoAltFill /> {route.startLocation}</div>
                                    <div>To: <GeoAltFill /> {route.destination}</div>
                                </div>
                                <Button variant="danger" onClick={(e) => {
                                    e.stopPropagation()
                                    removeFavorite(route.id)
                                }}>
                                    Remove
                                </Button>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card.Body>
            </Card>
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
        </div>
    );
};

export default FavoRoutes;
