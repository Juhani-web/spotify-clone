import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import SpotifyCallback from './pages/SpotifyCallback';
import Dashboard from './components/Dashboard/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Playlist from './pages/Playlist';
import Library from './pages/Library';

function App({ spotifyApi }) {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/callback" element={<SpotifyCallback />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard spotifyApi={spotifyApi} />
        </ProtectedRoute>
      }>
        <Route index element={<Home />} />
        <Route path="playlist/:id" element={<Playlist spotifyApi={spotifyApi} />} />
        <Route path="library" element={<Library spotifyApi={spotifyApi} />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;
