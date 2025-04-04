import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import UserPage from './pages/UserPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import QRGenerator from './components/user/QRGenerator';
import QRViewPage from './pages/QRViewPage';

function App() {
  return (
    <BrowserRouter>
      {/* Navigation Bar */}
      <nav style={{ padding: '1rem', background: '#eee' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
        <Link to="/admin" style={{ marginRight: '1rem' }}>Admin</Link>
        <Link to="/user" style={{ marginRight: '1rem' }}>User</Link>
        <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
        <Link to="/register">Register</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/qr/:id" element={<QRViewPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/generate-qr" element={<QRGenerator />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;  // <-- Make sure to export it as default
