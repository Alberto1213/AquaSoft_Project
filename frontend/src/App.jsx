import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import Hotels from './pages/Hotels';
import HotelDetails from './pages/HotelDetails';
import Manager from './pages/Manager'; // Import Manager page

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/hotels" element={<Hotels />} />
      <Route path="/hotels/:id" element={<HotelDetails />} />
      <Route path="/manager" element={<Manager />} />
      {/* Adaugă alte rute aici după cum este necesar */}
    </Routes>
  );
}

export default App;
