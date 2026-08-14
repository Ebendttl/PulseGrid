import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";

interface ScheduleState {
  selectedDay: DayOfWeek;
  showConflictsOnly: boolean;
}

const initialState: ScheduleState = {
  selectedDay: "Monday",
  showConflictsOnly: false,
};

export const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    setSelectedDay: (state, action: PayloadAction<DayOfWeek>) => {
      state.selectedDay = action.payload;
    },
    setShowConflictsOnly: (state, action: PayloadAction<boolean>) => {
      state.showConflictsOnly = action.payload;
    },
  },
});

export const { setSelectedDay, setShowConflictsOnly } = scheduleSlice.actions;

export default scheduleSlice.reducer;
