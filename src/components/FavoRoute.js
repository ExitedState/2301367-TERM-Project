import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { firestore } from '../config/firebase';
import { ListGroup, Card } from 'react-bootstrap';
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

    return (
        <div>
            <h1>Favorite Routes</h1>
            <Card className="my-3 mx-auto" style={{ maxWidth: '888px' }}>
                <Card.Body>
                    <ListGroup>
                        {favoriteRoutes.map((route, index) => (
                            <ListGroup.Item
                                key={route.id || index}
                                action
                                onClick={() => redirectToGoogleMaps(route.startLocation, route.destination)}
                                className="d-flex justify-content-between align-items-center"
                            >
                                <div className="me-auto">
                                    <div className="fw-bold">From: <GeoAltFill /> {route.startLocation}</div>
                                    <div>To: <GeoAltFill /> {route.destination}</div>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card.Body>
            </Card>
        </div>
    );
};

export default FavoRoutes;
