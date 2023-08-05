import { ClassNo, RawLesson } from './modules';

/** Mapping of each module to the `classNo`s offered with `Lesson` details*/
export type TimetableClassesWithLessons = {
  [moduleCode: string]: ModuleClassesWithLessons;
};

/** Mapping of `lessonType` to the `ClassNo` and `Lesson`s associated
 * Used by `ModuleClassesWithLessons`
 */
export type ModuleClassesWithLessons = {
  [lessonType: string]: ModuleClassesLessons;
};

/** Mapping of each `ClassNo` to the `Lesson`s associated
 * Used by `ModuleClassesWithLessons`
 */
export type ModuleClassesLessons = {
  [classNo: string]: RawLesson[];
};

/** ModuleCode_LessonType_ClassNo */
export type codeTypeClassNode = {
  moduleCode: string;
  lessonType: string;
  classNo: string;
};

/** ModuleCode_LessonType node */
export type codeTypeNode = {
  moduleCode: string;
  lessonType: string;
};

export type GraphAdjList = {
  [code_type_class: string]: GraphNeighbour;
};

export type GraphNeighbour = {
  [code_type: string]: ClassNo[];
};

export type AdjMatrixMapping = {
  [code_type_class: string]: number;
};

export type LessonTypeMapping = {
  [code_type: string]: number;
};

/** ModuleCode_LessonType: ClassNo */
export type LessonTypeClass = {
  [code_type: string]: string;
};

export type Condition = {
  startTime?: Date;
  endTime?: Date;
  Monday: boolean;
  Tuesday: boolean;
  Wednesday: boolean;
  Thursday: boolean;
  Friday: boolean;
  Saturday: boolean;
};
