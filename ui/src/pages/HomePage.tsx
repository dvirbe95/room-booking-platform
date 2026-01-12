import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SearchForm } from '../components/SearchForm';
import { RoomCard } from '../components/RoomCard';
import { RootState } from '../store';
import { setRooms, setLoading, setError, setSearchParams } from '../store/slices/roomSlice';
import api from '../api/axios';
import { SearchFormValues } from '../shared/schemas';
import { useNavigate } from 'react-router-dom';

export const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { rooms, loading, error, searchParams } = useSelector((state: RootState) => state.rooms);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [bookingLoadingId, setBookingLoadingId] = useState<string | null>(null);

  const handleSearch = async (data: SearchFormValues) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    dispatch(setSearchParams(data));
    
    try {
      const response = await api.get('/rooms', {
        params: {
          location: data.location || undefined,
          checkIn: data.checkIn,
          checkOut: data.checkOut,
        },
      });
      dispatch(setRooms(response.data));
    } catch (err: any) {
      dispatch(setError(err.response?.data?.message || 'Failed to fetch rooms'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleBook = async (id: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!searchParams) {
      alert('Please select dates before booking');
      return;
    }

    setBookingLoadingId(id);
    try {
      await api.post('/bookings', {
        roomId: id,
        checkIn: searchParams.checkIn,
        checkOut: searchParams.checkOut,
      });
      navigate('/my-bookings');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to book room');
    } finally {
      setBookingLoadingId(null);
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-blue-600 rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Find the perfect room <br /> for your next trip
          </h2>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto opacity-90">
            Search from over 1,000+ luxury rooms and cozy cabins worldwide.
          </p>
        </div>
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full -mr-20 -mt-20 opacity-20" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400 rounded-full -ml-10 -mb-10 opacity-20" />
      </section>

      {/* Search Section */}
      <section className="max-w-5xl mx-auto px-4">
        <SearchForm onSearch={handleSearch} isLoading={loading} />
      </section>

      {/* Results Section */}
      <section className="max-w-6xl mx-auto px-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        {rooms.length > 0 ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Available Rooms {searchParams && `in ${searchParams.location || 'all locations'}`}
              </h3>
              <span className="text-sm text-gray-500 font-medium">
                {rooms.length} results found
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((room) => (
                <RoomCard 
                  key={room.id} 
                  room={room} 
                  onBook={handleBook}
                  isLoading={bookingLoadingId === room.id}
                />
              ))}
            </div>
          </div>
        ) : searchParams && !loading ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-400 text-lg">No rooms found for these dates. Try another search!</p>
          </div>
        ) : !searchParams ? (
          <div className="text-center py-20 opacity-40">
            <p className="text-gray-400 text-lg italic italic">Enter your destination and dates to start searching</p>
          </div>
        ) : null}
      </section>
    </div>
  );
};
