import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Module, Semester } from '../types/modules';
import {
  HiddenModulesMap,
  HoverLesson,
  Lesson,
  ModifiedCell,
  ModulesMap,
  SemTimetableConfig,
  SemesterColorMap,
  TimetableConfig,
} from '../types/timetable';
import { randomModuleLessonConfig } from '../utils/timetableUtils';
import { getModuleSemesterData } from '../utils/moduleUtils';
import { fillColorMapping } from 'utils/colorUtils';

const initialState = {
  /** Currently viewed semester */
  semester: 1,
  /** Active lesson awaiting to be modified */
  activeLesson: null as Lesson | null,
  /** Currently hovered lesson. Used to show same classes as currently hovered class */
  hoverLesson: null as HoverLesson | null,
  /** Position of last modified cell. Used to maintain scroll position */
  modifiedCell: {} as ModifiedCell | null,
  /** All selected modules across all semesters */
  modules: {} as ModulesMap,
  /** Selected lesson configuration for each selected module across all semesters */
  lessons: {} as TimetableConfig,
  /** Modules that are hidden by user */
  hidden: {} as HiddenModulesMap,
  /** Colors of each module shown in timetable */
  colors: {} as SemesterColorMap,
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
    changeLessonConfig: (state, action: PayloadAction<Lesson>) => {
      const currentSem = state.semester;
      const { moduleCode, lessonType, classNo } = action.payload;

      state.activeLesson = null; // Reset activeLesson
      state.lessons[currentSem][moduleCode] = {
        ...state.lessons[currentSem][moduleCode],
        [lessonType]: classNo,
      };
    },
    addModule: (
      state,
      action: PayloadAction<{ semester: Semester; module: Module }>
    ) => {
      const { semester, module } = action.payload;

      const moduleCode = module.moduleCode;
      state.modules[moduleCode] = module; // Add module to redux

      const curSemData =
        getModuleSemesterData(module, semester) || module.semesterData[0];
      const lessonData = randomModuleLessonConfig(curSemData.timetable);

      state.lessons[semester] = {
        ...state.lessons[semester],
        [moduleCode]: lessonData,
      };

      state.colors[semester] = fillColorMapping(
        state.lessons[semester] || {},
        state.colors[semester] || {}
      );
    },
    deleteModule: (
      state,
      action: PayloadAction<{
        semester: Semester;
        moduleCode: string;
      }>
    ) => {
      const { semester, moduleCode } = action.payload;
      delete state.lessons[semester][moduleCode];
    },
    setHoverLesson: (state, action: PayloadAction<HoverLesson>) => {
      state.hoverLesson = action.payload;
    },
    clearHoverLesson: (state) => {
      state.hoverLesson = null;
    },
    setModifiedCell: (state, action: PayloadAction<ModifiedCell>) => {
      state.modifiedCell = action.payload;
    },
    clearModifiedCell: (state) => {
      state.modifiedCell = null;
    },
    /** Imports new timetable config into current semester */
    importTimetable: (state, action: PayloadAction<SemTimetableConfig>) => {
      state.lessons[state.semester] = action.payload;
    },
  },
});

export const {
  switchSemester,
  addModule,
  deleteModule,
  modifyActiveLesson,
  cancelModifyActiveLesson,
  changeLessonConfig,
  setHoverLesson,
  clearHoverLesson,
  setModifiedCell,
  clearModifiedCell,
  importTimetable,
} = timetableSlice.actions;
export default timetableSlice.reducer;
