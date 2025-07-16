/* eslint-disable simple-import-sort/imports */
// FILE: App.tsx
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from '@app/components/ui/sonner';

import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Recommendations from './pages/Recommendations';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import Login from './pages/Login';
import { useAuth } from './context/AuthContext';
import Register from './pages/Register';
import { useEffect } from 'react';
import LandingPage from './pages/LandingPage';

const App = () => {
  const { isAuthenticated } = useAuth();
  const { user } = useAuth();

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    useEffect(() => {
      console.log('ProtectedRoute: Checking authentication status' + isAuthenticated());
    }, []);
    // return isAuthenticated() ? <>{children}</> : <Navigate to='/login' replace />;
    return isAuthenticated() ? <>{children}</> : <Navigate to='/login' replace />;
  };

  const ProtectedRouteAuth = ({ children }) => {
    useEffect(() => {
      console.log('ProtectedRouteAuth: Checking authentication status' + isAuthenticated());
    }, []);
    return !isAuthenticated() ? <>{children}</> : <Navigate to='/dashboard' replace />;
  };

  return (
    <Router>
      <div className='flex min-h-screen flex-col bg-[#E8F5E9] text-[#2E7D32]'>
        <Navbar />
        <main className='mt-[6%] flex-grow'>
          <Routes>
            <Route
              path='/'
              element={
                // <ProtectedRouteAuth>
                <LandingPage />
                // </ProtectedRouteAuth>
              }
            ></Route>
            <Route
              path='/login'
              element={
                <ProtectedRouteAuth>
                  <Login />
                </ProtectedRouteAuth>
              }
            />
            <Route
              path='/register'
              element={
                <ProtectedRouteAuth>
                  <Register />
                </ProtectedRouteAuth>
              }
            />
            <Route
              path='/dashboard'
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
        <Toaster
          position='top-right'
          richColors
          closeButton={false}
          toastOptions={{
            style: {
              backgroundColor: 'white',
              color: '#2E7D32',
              border: 'none'
            },
          }}
        />
      </div>
    </Router>
  );
};

export default App;
