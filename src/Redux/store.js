import { configureStore } from "@reduxjs/toolkit";
import firstSlice from "./firstSlice";
import SecondSlice from "./SecondSlice";
import TodoSlice from "./TodoSlice";

export const store = configureStore({
  reducer: {
    first: firstSlice,
    second: SecondSlice,
    todo: TodoSlice,
  },
});
