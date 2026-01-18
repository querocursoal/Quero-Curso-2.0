
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { CoursesProvider } from './context/CoursesContext';
import { SettingsProvider } from './context/SettingsContext';
import CoursesPage from './pages/CoursesPage';
import InstitutionalPage from './pages/InstitutionalPage';
import ContactPage from './pages/ContactPage';
import CourseDetailPage from './pages/CourseDetailPage';
import TermsPage from './pages/TermsPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import StudentDashboard from './pages/Student/StudentDashboard';
import StudentDetail from './components/Admin/StudentDetail';

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <CoursesProvider>
          <HashRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/cursos" element={<CoursesPage />} />
              <Route path="/curso/:courseId" element={<CourseDetailPage />} />
              <Route path="/institucional" element={<InstitutionalPage />} />
              <Route path="/contato" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route
                path="/student-dashboard"
                element={
                  <ProtectedRoute>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/termos-de-inscricao" element={<TermsPage />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/student/:studentId"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <div className="min-h-screen bg-gray-100">
                      <header className="bg-white text-gray-800 shadow-md sticky top-0 z-40">
                        <div className="container mx-auto px-6 py-3">
                          <h1 className="text-2xl font-bold text-[#333fa4]">Painel de Controle</h1>
                        </div>
                      </header>
                      <main className="container mx-auto px-6 py-8">
                        <StudentDetail />
                      </main>
                    </div>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </HashRouter>
        </CoursesProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
