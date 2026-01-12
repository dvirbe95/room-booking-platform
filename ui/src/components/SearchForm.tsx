import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search, MapPin, Calendar as CalendarIcon } from 'lucide-react';
import { searchSchema, SearchFormValues } from '../shared/schemas';
import { Button } from './Button';

interface SearchFormProps {
  onSearch: (data: SearchFormValues) => void;
  isLoading?: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      checkIn: new Date().toISOString().split('T')[0],
      checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    }
  });

  return (
    <form 
      onSubmit={handleSubmit(onSearch)}
      className="bg-white p-4 md:p-6 rounded-2xl shadow-xl border border-gray-100 -mt-12 relative z-10 grid grid-cols-1 md:grid-cols-4 gap-4"
    >
      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
          <MapPin className="w-3 h-3" /> Location
        </label>
        <input
          {...register('location')}
          className="w-full p-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          placeholder="Where are you going?"
        />
        {errors.location && <p className="text-red-500 text-xs">{errors.location.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
          <CalendarIcon className="w-3 h-3" /> Check In
        </label>
        <input
          {...register('checkIn')}
          type="date"
          className="w-full p-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
        {errors.checkIn && <p className="text-red-500 text-xs">{errors.checkIn.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
          <CalendarIcon className="w-3 h-3" /> Check Out
        </label>
        <input
          {...register('checkOut')}
          type="date"
          className="w-full p-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
        {errors.checkOut && <p className="text-red-500 text-xs">{errors.checkOut.message}</p>}
      </div>

      <div className="flex items-end">
        <Button 
          type="submit" 
          className="w-full h-11 flex gap-2 text-base font-bold"
          isLoading={isLoading}
        >
          <Search className="w-5 h-5" /> Search
        </Button>
      </div>
    </form>
  );
};
