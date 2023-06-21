import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Module } from '../types/modules';
import {
  HiddenModulesMap,
  Lesson,
  ModulesMap,
  TimetableConfig,
} from '../types/timetable';
import { randomModuleLessonConfig } from '../utils/timetable';

const initialState = {
  semester: 1,
  activeLesson: null as Lesson | null,
  modules: {} as ModulesMap,
  lessons: {} as TimetableConfig,
  hidden: {} as HiddenModulesMap,
};

const timetableSlice = createSlice({
  name: 'timetable',
  initialState,
  reducers: {
    changeSemester: (state, action: PayloadAction<number>) => {
      state.semester = action.payload;
    },
    addModule: (state, action) => {
      const { semester, module }: { semester: number; module: Module } =
        action.payload;

      const moduleCode = module.moduleCode;
      state.modules[moduleCode] = module; // Add module to redux

      const curSemData =
        module.semesterData.find((sem) => sem.semester === semester) ||
        module.semesterData[0];

      const lessonData = randomModuleLessonConfig(curSemData.timetable);

      state.lessons[semester] = {
        ...state.lessons[semester],
        [moduleCode]: lessonData,
      };
    },
  },
});

export const { changeSemester, addModule } = timetableSlice.actions;
export default timetableSlice.reducer;
