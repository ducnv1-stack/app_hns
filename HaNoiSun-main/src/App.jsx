import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ToursPage from './pages/ToursPage';
import BookingPage from './pages/BookingPage';
import TourDetailPage from './pages/TourDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import HeaderSimple from './components/layout/HeaderSimple';
import Footer from './components/layout/Footer';
import LoginPage from './pages/LoginPage';
import TestPage from './pages/TestPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import UserDashboard from './pages/UserDashboard';
import ProfilePage from './pages/ProfilePage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminDashboardNew from './pages/admin/AdminDashboard';
import TourManagement from './pages/admin/TourManagement';
import BookingManagement from './pages/admin/BookingManagement';
import TourView from './pages/admin/TourView';
import TourEdit from './pages/admin/TourEdit';
import ServiceNew from './pages/admin/ServiceNew';
import UserManagement from './pages/admin/UserManagement';
import Analytics from './pages/admin/Analytics';
import TestImagePage from './pages/TestImagePage';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import BookingModificationPage from './pages/BookingModificationPage';
import BookingCancellationPage from './pages/BookingCancellationPage';
import BookingDetailPage from './pages/BookingDetailPage';
import NotificationsPage from './pages/NotificationsPage';
import NotificationTest from './components/NotificationTest';
import DebugPage from './pages/DebugPage';
import ApiTest from './components/ApiTest';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import DebugInfo from './components/DebugInfo';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <div className="min-h-screen bg-gray-50">
          <HeaderSimple />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/test" element={<TestPage />} />
              <Route path="/tours" element={<ToursPage />} />
              <Route path="/tours/:slugOrId" element={<TourDetailPage />} />
              <Route path="/tours/country/:country" element={<ToursPage />} />
              <Route path="/booking/:slugOrId" element={<BookingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/dashboard" element={
                <ProtectedRoute roles={["user"]}>
                  <UserDashboard />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute roles={["user", "admin"]}>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/my-bookings" element={
                <ProtectedRoute roles={["user", "admin"]}>
                  <MyBookingsPage />
                </ProtectedRoute>
              } />
              <Route path="/my-bookings/:bookingId" element={
                <ProtectedRoute roles={["user", "admin"]}>
                  <BookingDetailPage />
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute roles={["user", "admin"]}>
                  <NotificationsPage />
                </ProtectedRoute>
              } />
              <Route path="/notification-test" element={
                <ProtectedRoute roles={["user", "admin"]}>
                  <NotificationTest />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminDashboardNew />
                </ProtectedRoute>
              } />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminDashboardNew />
                </ProtectedRoute>
              } />
              <Route path="/admin/tours" element={
                <ProtectedRoute roles={["admin"]}>
                  <TourManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/tours/new" element={
                <ProtectedRoute roles={["admin"]}>
                  <ServiceNew />
                </ProtectedRoute>
              } />
              <Route path="/admin/tours/:slugOrId/edit" element={
                <ProtectedRoute roles={["admin"]}>
                  <TourEdit />
                </ProtectedRoute>
              } />
              <Route path="/admin/tours/:slugOrId" element={
                <ProtectedRoute roles={["admin"]}>
                  <TourView />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute roles={["admin"]}>
                  <UserManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/analytics" element={
                <ProtectedRoute roles={["admin"]}>
                  <Analytics />
                </ProtectedRoute>
              } />
              <Route path="/admin/reports" element={
                <ProtectedRoute roles={["admin"]}>
                  <Analytics />
                </ProtectedRoute>
              } />
              <Route path="/admin/bookings" element={
                <ProtectedRoute roles={["admin"]}>
                  <BookingManagement />
                </ProtectedRoute>
              } />
              <Route path="/payment/:bookingId" element={<PaymentPage />} />
              <Route path="/payment/success" element={<PaymentSuccessPage />} />
              <Route path="/booking/:bookingId/modify" element={
                <ProtectedRoute roles={["user", "admin"]}>
                  <BookingModificationPage />
                </ProtectedRoute>
              } />
              <Route path="/booking/:bookingId/cancel" element={
                <ProtectedRoute roles={["user", "admin"]}>
                  <BookingCancellationPage />
                </ProtectedRoute>
              } />
              <Route path="/api-test" element={<ApiTest />} />
              <Route path="/debug" element={<DebugPage />} />
              <Route path="/test-images" element={<TestImagePage />} />
            </Routes>
          </main>
          <Footer />
          <DebugInfo />
          </div>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;