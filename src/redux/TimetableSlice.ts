import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Module } from '../types/modules';
import {
  HiddenModulesMap,
  Lesson,
  ModuleLessonConfig,
  TimetableConfig,
} from '../types/timetable';
import { groupBy, mapValues } from 'lodash';

const initialState = {
  semester: 1,
  activeLesson: null as Lesson | null,
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
      const curSemData =
        module.semesterData.find((sem) => sem.semester === semester) ||
        module.semesterData[0];

      // Group by `lessonType` for `SemTimetableConfig`
      const grpByLessonType = groupBy(
        curSemData.timetable,
        (lesson) => lesson.lessonType
      );
      // Gets the first `classNo` for each `lessonType`
      const lessonData: ModuleLessonConfig = mapValues(
        grpByLessonType,
        (lessons) => lessons[0].classNo
      );
      console.log(lessonData);

      state.lessons[semester] = { [moduleCode]: lessonData };
    },
  },
});

export const { changeSemester, addModule } = timetableSlice.actions;
export default timetableSlice.reducer;
