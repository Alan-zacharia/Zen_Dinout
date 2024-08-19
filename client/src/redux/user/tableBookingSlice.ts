import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface BookingType {
  restaurantId: string;
  restaurantName : string;
  time: string;
  guests: number;
  date: string;
  tableId : string;
  tableRate : string;
  timeSlotId : string;
  tableName : string;
  tableImage : string;
}

interface TableBookinTgState {
  isBookingConfirmed: boolean;
  bookingDetails: BookingType | null;
}

const initialState: TableBookinTgState = {
  isBookingConfirmed: false,
  bookingDetails: null,
};

const tableBookingSlice = createSlice({
  name: "tableBookingSlice",
  initialState,
  reducers: {
    confirmBooking(state, action: PayloadAction<BookingType>) {
      state.isBookingConfirmed = true;
      state.bookingDetails = action.payload;
    },
    resetBooking(state) {
      state.isBookingConfirmed = false;
      state.bookingDetails = null;
    },
  },
});

export const { confirmBooking, resetBooking } = tableBookingSlice.actions;
export default tableBookingSlice.reducer;
