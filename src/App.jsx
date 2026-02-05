import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { SkipLink } from './components/ui/SkipLink';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

// Code splitting: carrega páginas apenas quando necessário
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CoursePlayer = lazy(() => import('./pages/CoursePlayer'));
const Profile = lazy(() => import('./pages/Profile'));
const Achievements = lazy(() => import('./pages/Achievements'));

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
      <SkipLink />
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/course/:id" element={
              <ProtectedRoute>
                <CoursePlayer />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/achievements" element={
              <ProtectedRoute>
                <Achievements />
              </ProtectedRoute>
            } />
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;

