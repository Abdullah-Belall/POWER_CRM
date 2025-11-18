import { SnakeBarTypeEnum } from "@/types/enums/common-enums";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface SnakeBarState {
  isOpen: boolean;
  message: string;
  type: SnakeBarTypeEnum;
}

const initialState: SnakeBarState = {
  isOpen: false,
  message: "",
  type: SnakeBarTypeEnum.ERROR,
};

const snakeBarSlice = createSlice({
  name: "snakeBar",
  initialState,
  reducers: {
    openSnakeBar: (state, action: PayloadAction<{ message: string; type?: SnakeBarTypeEnum }>) => {
      state.isOpen = true;
      state.message = action.payload.message;
      state.type = action.payload.type || SnakeBarTypeEnum.ERROR;
    },
    closeSnakeBar: (state) => {
      state.isOpen = false;
      state.message = "";
      state.type = SnakeBarTypeEnum.ERROR;
    },
  },
});

export const { openSnakeBar, closeSnakeBar } = snakeBarSlice.actions;
export const snakeBarState = () => (state: RootState) => {
  return state.snakeBar;
};
export default snakeBarSlice.reducer;
