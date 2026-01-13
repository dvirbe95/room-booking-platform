import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HomePage } from './pages/HomePage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { ProtectedRoute, PublicRoute } from './components/AuthRoutes';
import { AppRoutes } from './shared/constants';
import './index.css';

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <Navbar />
    <main className="container mx-auto px-4 py-8 flex-grow">{children}</main>
    <footer className="py-6 text-center text-gray-400 text-sm border-t border-gray-100 bg-white mt-12">
      © 2026 RoomBooking Platform. All rights reserved.
    </footer>
  </div>
);

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path={AppRoutes.HOME} element={<HomePage />} />
            
            {/* Auth Routes - Only for non-logged in users */}
            <Route element={<PublicRoute />}>
              <Route path={AppRoutes.LOGIN} element={<LoginPage />} />
              <Route path={AppRoutes.REGISTER} element={<RegisterPage />} />
            </Route>

            {/* Protected Routes - Only for logged in users */}
            <Route element={<ProtectedRoute />}>
              <Route path={AppRoutes.MY_BOOKINGS} element={<MyBookingsPage />} />
            </Route>

            <Route path="*" element={<Navigate to={AppRoutes.HOME} />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;
