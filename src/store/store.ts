import { configureStore } from "@reduxjs/toolkit";
import userReducer from './slices/user-slice'
import tableDataReducer from './slices/tables-slice'
import snakeBarReducer from "./slices/snake-bar-slice";
import popupReducer from "./slices/popups-slice";
import languageReducer from "./slices/language-slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    tableData: tableDataReducer,
    snakeBar: snakeBarReducer,
    popup: popupReducer,
    language: languageReducer,
  },
  // Performance optimizations
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Disable serializable check for better performance
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE", "analytics/fillAnalytics"],
        ignoredPaths: ["user", "snakeBar", "analytics", "popup", "language", "tableData", "search"],
      },
      // Disable immutable check for better performance
      immutableCheck: {
        ignoredPaths: ["user", "snakeBar", "analytics", "popup", "language", "tableData", "search"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
