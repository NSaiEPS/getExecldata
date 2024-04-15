import { createSlice } from "@reduxjs/toolkit";

const SecondSlice = createSlice({
  name: "fddffdfdd",
  initialState: {
    todoLists: [],
    names: "",
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

export const { setTodoList, setName } = SecondSlice.actions;
export default SecondSlice.reducer;
