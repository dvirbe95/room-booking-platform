import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setBookings, setLoading, setError } from '../store/slices/bookingSlice';
import api from '../api/axios';
import { Calendar, MapPin, CheckCircle } from 'lucide-react';
import { ApiEndpoints, ErrorMessages } from '../shared/constants';

export const MyBookingsPage = () => {
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector((state: RootState) => state.bookings);

  useEffect(() => {
    const fetchBookings = async () => {
      dispatch(setLoading(true));
      try {
        const response = await api.get(`${ApiEndpoints.BOOKINGS}/my-bookings`);
        dispatch(setBookings(response.data));
      } catch (err: any) {
        dispatch(setError(err.response?.data?.message || ErrorMessages.FETCH_BOOKINGS_FAILED));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchBookings();
  }, [dispatch]);

  if (loading && bookings.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-medium">
          {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <p className="text-gray-400 text-lg">You haven't made any bookings yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-blue-600 mb-1">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-bold text-sm uppercase tracking-wider">Confirmed</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{booking.room?.name || 'Room Details'}</h3>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{booking.room?.location}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 py-4 md:py-0 border-t md:border-t-0 md:border-l border-gray-100 md:pl-8">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Check In
                  </span>
                  <p className="font-semibold text-gray-700">
                    {new Date(booking.check_in).toLocaleDateString('en-GB')}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Check Out
                  </span>
                  <p className="font-semibold text-gray-700">
                    {new Date(booking.check_out).toLocaleDateString('en-GB')}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-widest">Booked on</p>
                <p className="text-sm text-gray-600 font-medium">
                  {new Date(booking.created_at).toLocaleDateString('en-GB')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
