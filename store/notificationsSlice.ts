import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AnnouncementCategory } from "@/types/domain";

interface NotificationsState {
  selectedCategory: AnnouncementCategory | "all";
  composerOpen: boolean;
  unreadCount: number;
}

const initialState: NotificationsState = {
  selectedCategory: "all",
  composerOpen: false,
  unreadCount: 3,
};

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setSelectedCategory: (
      state,
      action: PayloadAction<AnnouncementCategory | "all">
    ) => {
      state.selectedCategory = action.payload;
    },
    setComposerOpen: (state, action: PayloadAction<boolean>) => {
      state.composerOpen = action.payload;
    },
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    markAllRead: (state) => {
      state.unreadCount = 0;
    },
  },
});

export const {
  setSelectedCategory,
  setComposerOpen,
  setUnreadCount,
  markAllRead,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
