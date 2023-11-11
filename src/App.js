import React from 'react';
import AppRoutes from './routes/Routes';
import { AuthProvider } from './contexts/AuthContext';
// import { Container } from 'react-bootstrap';

function App() {
    return (
        <AuthProvider>
            <div>
                <AppRoutes />
            </div>
        </AuthProvider>
    );
}

export default App;
