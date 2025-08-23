import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SpotifyWebApi from "spotify-web-api-js";
import Login from "./pages/Login";
import SpotifyCallback from "./pages/Callback";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Playlist from "./pages/Playlist";
import Library from "./pages/Library";

function App() {
  const spotifyApi = new SpotifyWebApi();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/callback" element={<SpotifyCallback />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard spotifyApi={spotifyApi} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="playlist/:id" element={<Playlist spotifyApi={spotifyApi} />} />
          <Route path="library" element={<Library spotifyApi={spotifyApi} />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
