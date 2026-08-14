import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AttendanceState {
  selectedClassId: string;
  selectedDate: string; // ISO format YYYY-MM-DD
  searchTerm: string;
  auditDrawerOpen: boolean;
}

const initialState: AttendanceState = {
  selectedClassId: "cls-101",
  selectedDate: new Date().toISOString().split("T")[0] ?? "2026-08-14",
  searchTerm: "",
  auditDrawerOpen: false,
};

export const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    setSelectedClassId: (state, action: PayloadAction<string>) => {
      state.selectedClassId = action.payload;
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setAuditDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.auditDrawerOpen = action.payload;
    },
  },
});

export const {
  setSelectedClassId,
  setSelectedDate,
  setSearchTerm,
  setAuditDrawerOpen,
} = attendanceSlice.actions;

export default attendanceSlice.reducer;
