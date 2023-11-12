import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, getDocs, query, where, orderBy, updateDoc, doc } from 'firebase/firestore';
import { firestore } from '../config/firebase';
import { ListGroup, Card, Button } from 'react-bootstrap';
import { GeoAltFill } from 'react-bootstrap-icons';

const FavoRoutes = () => {
    const { currentUser } = useAuth();
    const [favoriteRoutes, setFavoriteRoutes] = useState([]);

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
        const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(start)}&destination=${encodeURIComponent(destination)}&travelmode=driving`;
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
            <h1>Favorite Routes</h1>
            <Card className="my-3 mx-auto" style={{ maxWidth: '888px' }}>
                <Card.Body>
                    <ListGroup>
                        {favoriteRoutes.map((route, index) => (
                            <ListGroup.Item
                                key={route.id || index}
                                className="d-flex justify-content-between align-items-center"
                                style={{ userSelect: 'none' }}
                            >
                                <div className="me-auto" onClick={() => redirectToGoogleMaps(route.startLocation, route.destination)} style={{flex:1,cursor: 'pointer'}}>
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
        </div>
    );
};

export default FavoRoutes;
