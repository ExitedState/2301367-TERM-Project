// filename: FindRoute.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext'; // adjust the path as necessary
import { collection, addDoc, getDocs, query, where, orderBy, limit, updateDoc, doc } from 'firebase/firestore';
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
            await addDoc(collection(firestore, 'recentSearches'), newSearch);

            // Update local state
            setRecentSearches(prevSearches => [newSearch, ...prevSearches].slice(0, 8));

            // Direct to Google Maps
            redirectToGoogleMaps(startLocation, destination);
        } catch (error) {
            console.error("Error adding document: ", error);
        }
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
                                key={search.id || index}
                                className="d-flex justify-content-between align-items-center"
                                style={{ userSelect: 'none' }}
                            >
                                <div onClick={() => handleRecentSearchSelect(search)} style={{ flex: 1, cursor: 'pointer' }}>
                                    <Row className="w-100">
                                        <Col xs={12} md={6} className="d-flex align-items-center">
                                            <GeoAlt className="icon-style me-2" />
                                            <div className="flex-fill">
                                                <div className="fw-bold">From:</div>
                                                <span>{search.startLocation}</span>
                                            </div>
                                        </Col>
                                        <Col xs={12} md={6} className="d-flex align-items-center mt-2 mt-md-0">
                                            <Map className="icon-style me-2" />
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
        </div>
    );
};

export default FindRoutes;