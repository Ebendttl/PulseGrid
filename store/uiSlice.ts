import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  mobileSidebarOpen: boolean;
  activeTab: string;
  isOffline: boolean;
}

const initialState: UiState = {
  mobileSidebarOpen: false,
  activeTab: "dashboard",
  isOffline: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setMobileSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileSidebarOpen = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    setIsOffline: (state, action: PayloadAction<boolean>) => {
      state.isOffline = action.payload;
    },
  },
});

export const { setMobileSidebarOpen, setActiveTab, setIsOffline } =
  uiSlice.actions;

export default uiSlice.reducer;
