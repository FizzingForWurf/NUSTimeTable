import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Module } from '../types/modules';

const initialState = {
  semester: 1 as number,
  1: [] as Module[],
  2: [] as Module[],
  3: [] as Module[],
  4: [] as Module[],
};

const timetableSlice = createSlice({
  name: 'timetable',
  initialState,
  reducers: {
    changeSemester: (state, action: PayloadAction<number>) => {
      state.semester = action.payload;
    },
    addModuleCurrentSem: (state, action: PayloadAction<Module>) => {
      switch (state.semester) {
        case 1:
          state[1].push(action.payload);
          break;
        case 2:
          state[2].push(action.payload);
          break;
        case 3:
          state[3].push(action.payload);
          break;
        case 4:
          state[4].push(action.payload);
          break;
      }
    },
    removeModuleCurrentSem: (state, action: PayloadAction<string>) => {
      switch (state.semester) {
        case 1:
          state[1] = state[1].filter(
            (mod) => mod.moduleCode !== action.payload
          );
          break;
        case 2:
          state[2] = state[2].filter(
            (mod) => mod.moduleCode !== action.payload
          );
          break;
        case 3:
          state[3] = state[3].filter(
            (mod) => mod.moduleCode !== action.payload
          );
          break;
        case 4:
          state[4] = state[4].filter(
            (mod) => mod.moduleCode !== action.payload
          );
          break;
      }
    },
  },
});

export const { changeSemester, addModuleCurrentSem, removeModuleCurrentSem } =
  timetableSlice.actions;
export default timetableSlice.reducer;
