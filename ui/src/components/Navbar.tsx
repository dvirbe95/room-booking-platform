import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import { resetSearch } from '../store/slices/roomSlice';
import { LogOut, User as UserIcon, Calendar, Search } from 'lucide-react';
import { clsx } from 'clsx';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleSearchClick = () => {
    dispatch(resetSearch());
  };

  const navLinkClass = (path: string) => 
    clsx(
      "flex items-center space-x-1 text-sm font-bold px-4 py-2 rounded-lg transition-all",
      location.pathname === path 
        ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
    );

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" onClick={handleSearchClick} className="flex items-center space-x-2">
          <div className="bg-blue-600 p-1.5 rounded-lg shadow-sm">
            <Calendar className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight hidden xs:block">RoomBooking</span>
        </Link>

        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Hide navigation buttons on Login/Register pages */}
          {!isAuthPage && (
            <>
              {location.pathname !== '/' && (
                <Link to="/" onClick={handleSearchClick} className={navLinkClass('/')}>
                  <Search className="w-4 h-4 mr-1 md:mr-0" />
                  <span className="hidden md:inline">Search</span>
                </Link>
              )}
              
              {isAuthenticated && location.pathname !== '/my-bookings' && (
                <Link to="/my-bookings" className={navLinkClass('/my-bookings')}>
                  <Calendar className="w-4 h-4 mr-1 md:mr-0" />
                  <span className="hidden md:inline">My Bookings</span>
                </Link>
              )}
            </>
          )}
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <div className="hidden lg:flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                <UserIcon className="w-4 h-4 text-blue-500" />
                <span className="font-bold">{user?.name || user?.email}</span>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            !isAuthPage && (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-sm font-bold text-gray-600 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-bold px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-all shadow-sm"
                >
                  Register
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </nav>
  );
};
