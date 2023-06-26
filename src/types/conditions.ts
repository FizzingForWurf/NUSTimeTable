import { ClassNo, RawLesson } from './modules';

// /** Mapping of each module with the classes offered */
// export type TimetableClasses = {
//   [moduleCode: string]: ModuleClasses;
// };

// /** Mapping of lessonType and the ClassNos associated
//  * Used by `ModuleClasses`
//  */
// export type ModuleClasses = {
//   [lessonType: string]: ClassNo[];
// };

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
