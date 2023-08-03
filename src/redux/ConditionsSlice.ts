import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const conditionsSlice = createSlice({
  name: 'conditions',
  initialState,
  reducers: {
    // addCondition: (state, action) => {},
    // removeCondition: (state, action) => {},
  },
});

// export const { addCondition, removeCondition } = conditionsSlice.actions;
export default conditionsSlice;
