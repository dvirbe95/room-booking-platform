import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import './index.css';

// Layout component (to be created)
const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-50">
    <nav className="bg-white shadow-sm p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">RoomBooking</h1>
        {/* Nav items will go here */}
      </div>
    </nav>
    <main className="container mx-auto p-4">{children}</main>
  </div>
);

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<div>Welcome to Room Booking</div>} />
            <Route path="/login" element={<div>Login Page (Coming Soon)</div>} />
            <Route path="/register" element={<div>Register Page (Coming Soon)</div>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;
