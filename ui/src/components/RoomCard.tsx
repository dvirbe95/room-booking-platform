import React from 'react';
import { Room } from '../types';
import { Button } from './Button';
import { MapPin, Users, Info } from 'lucide-react';

interface RoomCardProps {
  room: Room;
  onBook: (id: string) => void;
  isLoading?: boolean;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onBook, isLoading }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="h-48 bg-gray-200 relative">
        {/* Mock image placeholder */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <Info className="w-12 h-12 opacity-20" />
        </div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-blue-600 shadow-sm">
          ${room.price_per_night} / night
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900 leading-tight">{room.name}</h3>
        </div>
        
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{room.description}</p>
        
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{room.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Users className="w-4 h-4 text-gray-400" />
            <span>{room.available_units} units available</span>
          </div>
        </div>

        <Button 
          onClick={() => onBook(room.id)}
          className="w-full font-bold py-2.5"
          variant="outline"
          isLoading={isLoading}
        >
          View Details & Book
        </Button>
      </div>
    </div>
  );
};
