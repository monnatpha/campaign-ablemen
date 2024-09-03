import { createSlice } from "@reduxjs/toolkit";

const checkSlice = createSlice({
  name: "check",
  initialState: 0,
  reducers: {
    setCheck: (state, action) => action.payload,
  },
});

export const { setCheck } = checkSlice.actions;

export default checkSlice.reducer;
