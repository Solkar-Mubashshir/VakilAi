import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/layout/Navbar';

import HomePage      from './components/pages/HomePage';
import LoginPage     from './components/pages/LoginPage';
import RegisterPage  from './components/pages/RegisterPage';
import UploadPage    from './components/pages/UploadPage';
import DocumentsPage from './components/pages/DocumentsPage';
import AnalysisPage  from './components/pages/AnalysisPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-layout">
          <Navbar />
          <main className="page-content">
            <Routes>
              <Route path="/"         element={<HomePage />} />
              <Route path="/login"    element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/upload"   element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
              <Route path="/documents" element={<ProtectedRoute><DocumentsPage /></ProtectedRoute>} />
              <Route path="/documents/:id" element={<ProtectedRoute><AnalysisPage /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
        <ToastContainer
          position="top-right" autoClose={3500}
          toastStyle={{ fontFamily: 'var(--font-body)', borderRadius: 10 }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;