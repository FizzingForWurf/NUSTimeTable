import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Module, Semester } from '../types/modules';
import {
  HiddenModulesMap,
  HoverLesson,
  Lesson,
  ModulesMap,
  TimetableConfig,
} from '../types/timetable';
import { randomModuleLessonConfig } from '../utils/timetableUtils';
import { getModuleSemesterData } from '../utils/moduleUtils';

const initialState = {
  semester: 1,
  activeLesson: null as Lesson | null,
  hoverLesson: null as HoverLesson | null,
  modules: {} as ModulesMap,
  lessons: {} as TimetableConfig,
  hidden: {} as HiddenModulesMap,
};

const timetableSlice = createSlice({
  name: 'timetable',
  initialState,
  reducers: {
    switchSemester: (state, action: PayloadAction<number>) => {
      state.semester = action.payload;
    },
    modifyActiveLesson: (state, action: PayloadAction<Lesson>) => {
      state.activeLesson = action.payload;
    },
    cancelModifyActiveLesson: (state) => {
      state.activeLesson = null;
    },
    setHoverLesson: (state, action: PayloadAction<HoverLesson>) => {
      state.hoverLesson = action.payload;
    },
    clearHoverLesson: (state) => {
      state.hoverLesson = null;
    },
    changeLessonConfig: (
      state,
      action: PayloadAction<{ semester: Semester; newLesson: Lesson }>
    ) => {
      const { semester, newLesson } = action.payload;
      const { moduleCode, lessonType, classNo } = newLesson;

      state.activeLesson = null; // Reset activeLesson
      state.lessons[semester][moduleCode] = {
        ...state.lessons[semester][moduleCode],
        [lessonType]: classNo,
      };
    },
    addModule: (state, action) => {
      const { semester, module }: { semester: Semester; module: Module } =
        action.payload;

      const moduleCode = module.moduleCode;
      state.modules[moduleCode] = module; // Add module to redux

      const curSemData =
        getModuleSemesterData(module, semester) || module.semesterData[0];
      const lessonData = randomModuleLessonConfig(curSemData.timetable);

      state.lessons[semester] = {
        ...state.lessons[semester],
        [moduleCode]: lessonData,
      };
    },
  },
});

export const {
  switchSemester,
  addModule,
  modifyActiveLesson,
  cancelModifyActiveLesson,
  changeLessonConfig,
  setHoverLesson,
  clearHoverLesson,
} = timetableSlice.actions;
export default timetableSlice.reducer;
