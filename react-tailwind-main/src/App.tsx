/* eslint-disable simple-import-sort/imports */
// FILE: App.tsx
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Recommendations from './pages/Recommendations';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import Login from './pages/Login';
import { useAuth } from './context/AuthContext';
import Register from './pages/Register';

const App = () => {
  const { isAuthenticated } = useAuth();

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    // return isAuthenticated() ? <>{children}</> : <Navigate to='/login' replace />;
    return isAuthenticated() ? <>{children}</> : <Navigate to='/login' replace />;
  };

  return (
    <Router>
      <div className='flex min-h-screen flex-col bg-[#E8F5E9] text-[#2E7D32]'>
        {/* Navbar displayed on all pages except Login */}
        <Navbar />
        <main className='flex-grow'>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route
              path='/'
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path='/inventory'
              element={
                <ProtectedRoute>
                  <Inventory />
                </ProtectedRoute>
              }
            />
            <Route
              path='/recommendations'
              element={
                <ProtectedRoute>
                  <Recommendations />
                </ProtectedRoute>
              }
            />
            <Route
              path='/alerts'
              element={
                <ProtectedRoute>
                  <Alerts />
                </ProtectedRoute>
              }
            />
            <Route
              path='/reports'
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
