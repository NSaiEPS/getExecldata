import { createSlice } from "@reduxjs/toolkit";

const TodoSlice = createSlice({
  name: "fddffdfdd",
  initialState: {
    TodoLidt: [],
    name: "",
  },

  reducers: {
    setTodo: (state, action) => {
      // console.log(action.payload, "payload");

      state.TodoLidt = [...state.TodoLidt, action.payload];
    },
    setDelete: (state, action) => {
      console.log(action.payload, "payload");
      let data = [...state.TodoLidt];
      data.splice(action.payload, 1);
      state.TodoLidt = data;
    },
    setEdit: (state, action) => {
      let data = [...state.TodoLidt];
      data[action.payload.editIndex] = action.payload.editInput;
      // data[action.payload.editIndex] = "sai";
      // state.TodoLidt = [
      //   ...data.slice(0, action.payload.editIndex),
      //   action.payload.editInput,
      //   ...data.slice(action.payload.editIndex + 1, state.TodoLidt.length),
      // ];
      state.TodoLidt = data;
    },
  },
});

export const { setTodo, setDelete, setEdit } = TodoSlice.actions;
export default TodoSlice.reducer;
