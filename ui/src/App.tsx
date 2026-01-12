import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import './index.css';

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <Navbar />
    <main className="container mx-auto px-4 py-8 flex-grow">{children}</main>
    <footer className="py-6 text-center text-gray-400 text-sm border-t border-gray-100 bg-white">
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
            <Route path="/" element={<div className="text-center py-20"><h2 className="text-3xl font-bold text-gray-800">Ready to find your next stay?</h2></div>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;
