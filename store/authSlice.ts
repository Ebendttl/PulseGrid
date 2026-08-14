import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, Role } from "@/types/domain";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  role: Role;
}

// Initial demo account: default to Admin role for rich exploration, or persistent session
const initialUser: User = {
  id: "u-admin",
  name: "Dr. Eleanor Vance",
  email: "admin@pulsegrid.edu",
  role: "admin",
  avatarUrl:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
};

const initialState: AuthState = {
  user: initialUser,
  isAuthenticated: true,
  role: "admin",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.role = action.payload.role;
    },
    switchRole: (state, action: PayloadAction<Role>) => {
      state.role = action.payload;
      if (action.payload === "admin") {
        state.user = initialUser;
      } else if (action.payload === "teacher") {
        state.user = {
          id: "u-teacher-1",
          name: "Prof. Marcus Thorne",
          email: "teacher@pulsegrid.edu",
          role: "teacher",
          avatarUrl:
            "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
          assignedClassIds: ["cls-101", "cls-102", "cls-201"],
        };
      } else {
        state.user = {
          id: "u-student-1",
          name: "Aria Chen",
          email: "student@pulsegrid.edu",
          role: "student",
          avatarUrl:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          studentId: "std-001",
        };
      }
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, switchRole, logout } = authSlice.actions;
export default authSlice.reducer;
