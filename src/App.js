import React from 'react';
import AppRoutes from './routes/Routes';
import { AuthProvider } from './contexts/AuthContext';
import { Container } from 'react-bootstrap';

function App() {
    return (
        <AuthProvider>
            <Container
                className="d-flex align-items-center justify-content-center"
                style={{ minHeight: "100vh" }}
            >
                <div className="w-100" style={{ maxWidth: "400px" }}>
                    <AppRoutes />
                </div>
            </Container>
        </AuthProvider>
    );
}

export default App;
