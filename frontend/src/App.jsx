import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import TrackBus from './pages/TrackBus';
import TrackComplaint from './pages/TrackComplaint';
import AdminDashboard from './pages/AdminDashboard';
import LiveTracking from './pages/LiveTracking';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/live-map" element={<LiveTracking />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/track/:busId" element={<TrackBus />} />
              <Route path="/complaint-status" element={<TrackComplaint />} />
              <Route path="/complaint-status/:id" element={<TrackComplaint />} />
              {/* Admin Routes - Protected */}
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
          <footer className="bg-dark text-white text-center py-4">
            &copy; {new Date().getFullYear()} Smart Bus Tracker. All rights reserved.
          </footer>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
