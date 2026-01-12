import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Room } from '../../types';

interface RoomState {
  rooms: Room[];
  loading: boolean;
  error: string | null;
  searchParams: {
    location?: string;
    checkIn: string;
    checkOut: string;
  } | null;
}

const initialState: RoomState = {
  rooms: [],
  loading: false,
  error: null,
  searchParams: null,
};

const roomSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    setRooms: (state, action: PayloadAction<Room[]>) => {
      state.rooms = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSearchParams: (state, action: PayloadAction<RoomState['searchParams']>) => {
      state.searchParams = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    startSearch: (state, action: PayloadAction<RoomState['searchParams']>) => {
      state.loading = true;
      state.error = null;
      state.rooms = [];
      state.searchParams = action.payload;
    },
    resetSearch: (state) => {
      state.rooms = [];
      state.searchParams = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setRooms, setSearchParams, setLoading, setError, resetSearch, startSearch } = roomSlice.actions;
export default roomSlice.reducer;
