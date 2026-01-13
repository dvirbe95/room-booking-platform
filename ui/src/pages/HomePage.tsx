import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SearchForm } from '../components/SearchForm';
import { RoomCard } from '../components/RoomCard';
import { RootState } from '../store';
import { setRooms, setLoading, setError, startSearch } from '../store/slices/roomSlice';
import api from '../api/axios';
import { SearchFormValues } from '../shared/schemas';
import { useNavigate } from 'react-router-dom';
import { Room } from '../types';
import { Button } from '../components/Button';
import { X, Calendar, CheckCircle2 } from 'lucide-react';
import { AppRoutes, ApiEndpoints, ErrorMessages } from '../shared/constants';

export const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { rooms, loading, error, searchParams } = useSelector((state: RootState) => state.rooms);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [bookingLoadingId, setBookingLoadingId] = useState<string | null>(null);
  const [confirmingRoom, setConfirmingRoom] = useState<Room | null>(null);

  const handleSearch = async (data: SearchFormValues) => {
    // Atomic update to prevent flicker
    dispatch(startSearch(data));
    
    try {
      const response = await api.get(ApiEndpoints.ROOMS, {
        params: {
          location: data.location || undefined,
          checkIn: data.checkIn,
          checkOut: data.checkOut,
        },
      });
      dispatch(setRooms(response.data));
    } catch (err: any) {
      dispatch(setError(err.response?.data?.message || ErrorMessages.FETCH_ROOMS_FAILED));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleBookClick = (room: Room) => {
    if (!isAuthenticated) {
      navigate(AppRoutes.LOGIN);
      return;
    }
    setConfirmingRoom(room);
  };

  const executeBooking = async () => {
    if (!confirmingRoom || !searchParams) return;

    setBookingLoadingId(confirmingRoom.id);
    try {
      await api.post(ApiEndpoints.BOOKINGS, {
        roomId: confirmingRoom.id,
        checkIn: searchParams.checkIn,
        checkOut: searchParams.checkOut,
      });
      setConfirmingRoom(null);
      navigate(AppRoutes.MY_BOOKINGS);
    } catch (err: any) {
      alert(err.response?.data?.message || ErrorMessages.BOOKING_FAILED);
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
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full -mr-20 -mt-20 opacity-20" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400 rounded-full -ml-10 -mb-10 opacity-20" />
      </section>

      {/* Search Section */}
      <section className="max-w-5xl mx-auto px-4">
        <SearchForm onSearch={handleSearch} isLoading={loading} />
      </section>

      {/* Results Section */}
      <section className="max-w-6xl mx-auto px-4 min-h-[400px]">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-medium mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-5 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-50 rounded" />
                    <div className="h-4 bg-gray-50 rounded" />
                  </div>
                  <div className="h-10 bg-gray-200 rounded w-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : rooms.length > 0 ? (
          <div className="space-y-6 animate-in fade-in duration-500">
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
                  onBook={() => handleBookClick(room)}
                  isLoading={bookingLoadingId === room.id}
                />
              ))}
            </div>
          </div>
        ) : searchParams ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 animate-in fade-in duration-300">
            <p className="text-gray-400 text-lg font-medium">No rooms found for these dates. Try another search!</p>
          </div>
        ) : (
          <div className="text-center py-20 opacity-40">
            <p className="text-gray-400 text-lg italic">Enter your destination and dates to start searching</p>
          </div>
        )}
      </section>

      {/* Confirmation Modal */}
      {confirmingRoom && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 flex justify-between items-center border-b border-gray-50">
              <h3 className="text-xl font-bold text-gray-900">Confirm Your Booking</h3>
              <button onClick={() => setConfirmingRoom(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6 bg-blue-50 p-4 rounded-2xl">
                <div className="bg-blue-600 p-3 rounded-xl text-white">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-bold uppercase tracking-wider">You've selected</p>
                  <h4 className="text-xl font-extrabold text-gray-900">{confirmingRoom.name}</h4>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mb-1">
                    <Calendar className="w-3 h-3" /> Check In
                  </span>
                  <p className="font-bold text-gray-700">{searchParams?.checkIn}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mb-1">
                    <Calendar className="w-3 h-3" /> Check Out
                  </span>
                  <p className="font-bold text-gray-700">{searchParams?.checkOut}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button 
                  onClick={executeBooking} 
                  className="w-full h-12 text-lg font-bold"
                  isLoading={!!bookingLoadingId}
                >
                  Confirm & Pay ${confirmingRoom.price_per_night}
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setConfirmingRoom(null)}
                  className="w-full text-gray-500"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
