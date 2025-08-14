// Uppdatera imports om ProtectedRoute använder andra komponenter
// Exempel:
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, token }) => {
	if (!token) {
		return <Navigate to="/login" />;
	}
	return children;
};

export default ProtectedRoute;
