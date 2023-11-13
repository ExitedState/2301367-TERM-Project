// filename: FindRoute.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext'; // adjust the path as necessary
import { collection, addDoc, getDocs, query, where, orderBy, limit, updateDoc, doc } from 'firebase/firestore';
import { firestore } from '../config/firebase'; // adjust the path as necessary
import { ListGroup, Button, Row, Col, InputGroup, FormControl, Card } from 'react-bootstrap';
import { Toast, ToastContainer } from 'react-bootstrap';
import { GeoAlt, Map } from 'react-bootstrap-icons';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../imgs/logo.png';
const FindRoutes = () => {
    const { currentUser, logout } = useAuth();
    const [startLocation, setStartLocation] = useState('');
    const [destination, setDestination] = useState('');
    const [recentSearches, setRecentSearches] = useState([]);
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (currentUser) {
            // Create a query against the collection.
            const searchesQuery = query(
                collection(firestore, 'recentSearches'),
                where('userId', '==', currentUser.uid),
                orderBy('timestamp', 'desc'),
                limit(10)
            );

            // Execute the query
            getDocs(searchesQuery)
                .then(querySnapshot => {
                    const searches = querySnapshot.docs.map(doc => ({
                        ...doc.data(),
                        id: doc.id  // Capture the document ID
                    }));
                    setRecentSearches(searches);
                })
                .catch(error => {
                    console.error("Error fetching recent searches: ", error);
                });
        }
    }, [currentUser]);

    const handleFindRoute = async () => {
        const newSearch = {
            userId: currentUser.uid,
            startLocation,
            destination,
            timestamp: new Date(),
            isFavorite: false
        };

        try {
            // Add a new document with a generated id to the "recentSearches" collection
            const docRef = await addDoc(collection(firestore, 'recentSearches'), newSearch);

            // Create a new search object including the id
            const addedSearch = { ...newSearch, id: docRef.id };

            // Update local state with the new search including the id
            setRecentSearches(prevSearches => [addedSearch, ...prevSearches].slice(0, 10));

            // Direct to Google Maps
            redirectToGoogleMaps(startLocation, destination);
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    const handleUseCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const currentLocation = `${position.coords.latitude},${position.coords.longitude}`;
                const googleMapsApiKey = process.env.GOOGLE_MAP_API_KEY;
                const geocodingApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${currentLocation}&key=${googleMapsApiKey}`;
                try {
                    const response = await fetch(geocodingApiUrl);
                    const data = await response.json();
                    const placeName = data.results[0].formatted_address; // Get the formatted address from the first result
                    setStartLocation(placeName);
                } catch (error) {
                    console.error("Error fetching place name: ", error);
                    setStartLocation(currentLocation); // Fallback to coordinates if API call fails
                }
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    };

    const redirectToGoogleMaps = (start, destination) => {
        const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(start)}&destination=${encodeURIComponent(destination)}&travelmode=transit`;
        window.open(googleMapsDirectionsUrl, '_blank');
    };

    const handleRecentSearchSelect = (search) => {
        redirectToGoogleMaps(search.startLocation, search.destination);
    };

    const toggleFavorite = async (search, index) => {
        // Create a reference to the Firestore document
        const searchRef = doc(firestore, 'recentSearches', search.id); // Correct usage of the doc function

        try {
            await updateDoc(searchRef, {
                isFavorite: !search.isFavorite
            });
            // Optimistically update the local state
            setRecentSearches(recentSearches.map((item, idx) =>
                idx === index ? { ...item, isFavorite: !item.isFavorite } : item
            ));
        } catch (error) {
            console.error("Error updating favorite status: ", error);
        }
    };
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
            <Card className="my-3 mx-auto" style={{ maxWidth: '888px' }}>
                <Card.Body>

                    <InputGroup className="mb-3">
                        <FormControl
                            placeholder="Start Location"
                            aria-label="Start Location"
                            value={startLocation}
                            onChange={(e) => setStartLocation(e.target.value)}
                        />
                        <Button variant="outline-secondary" onClick={(e) => {
                            e.preventDefault();  // Prevent default button click behavior
                            handleUseCurrentLocation();
                        }}>
                            <GeoAlt />
                        </Button>
                        <FormControl
                            placeholder="Destination"
                            aria-label="Destination"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                        />
                        <Button variant="primary" onClick={handleFindRoute}>
                            Find Route
                        </Button>
                    </InputGroup>
                    <h2>Recent Searches</h2>
                    <ListGroup>
                        {recentSearches.map((search, index) => (
                            <ListGroup.Item
                                key={search.id || index}
                                className="d-flex justify-content-between align-items-center"
                                style={{ userSelect: 'none' }}
                            >
                                <div onClick={() => handleRecentSearchSelect(search)} style={{ flex: 1, cursor: 'pointer' }}>
                                    <Row className="w-100">
                                        <Col xs={12} md={6} className="d-flex align-items-center">
                                            <div><GeoAlt className="me-2" style={{ fontSize: '1.2rem' }} /></div>
                                            <div className="flex-fill">
                                                <div className="fw-bold">From:</div>
                                                <span>{search.startLocation}</span>
                                            </div>
                                        </Col>
                                        <Col xs={12} md={6} className="d-flex align-items-center mt-2 mt-md-0">
                                            <div><Map className="me-2" style={{ fontSize: '1.2rem' }} /></div>
                                            <div className="flex-fill">
                                                <div className="fw-bold">To:</div>
                                                <span>{search.destination}</span>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                                <Button
                                    variant={search.isFavorite ? "warning" : "outline-warning"}
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent the list item's onClick from being called
                                        toggleFavorite(search, index);
                                    }}
                                >
                                    {search.isFavorite ? 'Unfavorite' : 'Favorite'}
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

export default FindRoutes;