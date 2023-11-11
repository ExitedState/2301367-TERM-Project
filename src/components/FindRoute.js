// filename: FindRoute.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext'; // adjust the path as necessary
import { collection, addDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { firestore } from '../config/firebase'; // adjust the path as necessary

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

    return (
        <div>
            <h1>Find Routes</h1>
            <button onClick={handleUseCurrentLocation}>Use Current Location</button>
            <input
                type="text"
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
                placeholder="Start Location"
                aria-label="Start Location"
            />
            <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Destination"
                aria-label="Destination"
            />
            <button onClick={handleFindRoute}>Find Route</button>
            <div>
                <h2>Recent Searches</h2>
                <ul>
                    {recentSearches.map((search, index) => (
                        <li key={index}>{`Start: ${search.startLocation}, Destination: ${search.destination}`}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default FindRoutes;
