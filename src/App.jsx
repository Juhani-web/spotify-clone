// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import SpotifyCallback from './pages/Callback.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';

function App({ spotifyApi }) {
  return (
    <Routes>
      {/* Publika routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/callback" element={<SpotifyCallback />} />

      {/* Skyddad route med alla subroutes */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <Dashboard spotifyApi={spotifyApi} />
          </ProtectedRoute>
        }
      />

      {/* Omdirigera allt annat till dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
