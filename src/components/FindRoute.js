// filename: FindRoute.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext'; // adjust the path as necessary
import { collection, addDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { firestore } from '../config/firebase'; // adjust the path as necessary
import { ListGroup, Button, Row, Col, InputGroup, FormControl, Card } from 'react-bootstrap';
import { GeoAlt, Map } from 'react-bootstrap-icons';
const FindRoutes = () => {
    const { currentUser } = useAuth();
    const [startLocation, setStartLocation] = useState('');
    const [destination, setDestination] = useState('');
    const [recentSearches, setRecentSearches] = useState([]);

    useEffect(() => {
        if (currentUser) {
            // Create a query against the collection.
            const searchesQuery = query(
                collection(firestore, 'recentSearches'),
                where('userId', '==', currentUser.uid),
                orderBy('timestamp', 'desc'),
                limit(5)
            );

            // Execute the query
            getDocs(searchesQuery)
                .then(querySnapshot => {
                    const searches = querySnapshot.docs.map(doc => doc.data());
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
            timestamp: new Date()
        };

        try {
            // Add a new document with a generated id to the "recentSearches" collection
            await addDoc(collection(firestore, 'recentSearches'), newSearch);

            // Update local state
            setRecentSearches(prevSearches => [newSearch, ...prevSearches].slice(0, 5));

            // Direct to Google Maps
            const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${startLocation}&destination=${destination}&travelmode=driving`;
            window.open(googleMapsDirectionsUrl, '_blank');
        } catch (error) {
            console.error("Error adding document: ", error);
        }
        redirectToGoogleMaps(startLocation, destination);
    };

    const handleUseCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const currentLocation = `${position.coords.latitude},${position.coords.longitude}`;
                setStartLocation(currentLocation);
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    };

    const redirectToGoogleMaps = (start, destination) => {
        const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(start)}&destination=${encodeURIComponent(destination)}&travelmode=driving`;
        window.open(googleMapsDirectionsUrl, '_blank');
    };

    const handleRecentSearchSelect = (search) => {
        redirectToGoogleMaps(search.startLocation, search.destination);
    };

    return (
        <div>
            <h1>Find Routes</h1>
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
                                key={index}
                                action
                                onClick={() => handleRecentSearchSelect(search)}
                                className="d-flex align-items-center"
                            >
                                <Row noGutters className="w-100">
                                    <Col xs={12} className="d-flex align-items-center">
                                        <GeoAlt className="me-2" />
                                        <div className="flex-fill">
                                            <div className="fw-bold">From:</div>
                                            <span>{search.startLocation}</span>
                                        </div>
                                    </Col>
                                    <Col xs={12} className="d-flex align-items-center my-2">
                                        <Map className="me-2" />
                                        <div className="flex-fill">
                                            <div className="fw-bold">To:</div>
                                            <span>{search.destination}</span>
                                        </div>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card.Body>
            </Card>
        </div>
    );
};

export default FindRoutes;