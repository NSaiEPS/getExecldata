import { createSlice } from "@reduxjs/toolkit";

const firstSlice = createSlice({
  name: "first",
  initialState: {
    todoList: [],
    name: "",
  },

  reducers: {
    setTodoList: (state, action) => {
      state.todoList = [...state.todoList, action.payload];
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
  },
});

export const { setTodoList, setName } = firstSlice.actions;
export default firstSlice.reducer;
