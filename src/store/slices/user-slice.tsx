import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { UserInterface } from "@/types/interfaces/common-interfaces";

interface UserState {
  currentUser: UserInterface | null;
  isLoading: boolean;
}

const initialState: UserState = {
  currentUser: null,
  isLoading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setUser: (state, action: PayloadAction<UserInterface | null>) => {
      state.currentUser = action.payload;
    },

    updateUser: (state, action: PayloadAction<Partial<UserInterface>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },

    clearUserData: (state) => {
      state.currentUser = null;
    },
  },
});

export const { setUserLoading, setUser, updateUser, clearUserData } = userSlice.actions;

export default userSlice.reducer;

const selectCurrentUser = () => (state: RootState) => state.user.currentUser;
const selectCurrentUserMainData = () => (state: RootState) => ({user_name: state.user.currentUser?.user_name, id: state.user.currentUser?.id, email: state.user.currentUser?.email})
const selectCurrentUserRoles = () => (state: RootState) => state.user.currentUser?.role?.roles;
const selectUserIsLoading = () => (state: RootState) => state.user.isLoading;

export {
  selectCurrentUserMainData,
  selectCurrentUser,
  selectUserIsLoading,
  selectCurrentUserRoles,
};
