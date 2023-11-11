// Filename: Routes.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';
import ForgotPassword from '../components/auth/ForgotPassword';
import PrivateRoute from '../components/shared/PrivateRoute';
import UpdateProfile from '../components/auth/UpdateProfile';
import MainPage from '../components/MainPage';
const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/update-profile" element={
                    <PrivateRoute>
                        <UpdateProfile />
                    </PrivateRoute>
                } />
                <Route path="/" element={<MainPage />} />
                <Route path="*" element={<h1>Not Found</h1>} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
