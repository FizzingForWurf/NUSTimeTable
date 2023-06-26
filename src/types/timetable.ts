import {
  ClassNo,
  LessonType,
  Module,
  ModuleCode,
  ModuleCondensed,
  ModuleTitle,
  RawLesson,
} from './modules';

// Mapping of module to color index [0, NUM_DIFFERENT_COLORS)
export type ColorIndex = number;
export type ColorMapping = { [moduleCode: string]: ColorIndex };
export type SemesterColorMap = { [semester: string]: ColorMapping };
export type HiddenModulesMap = { [semester: string]: ModuleCode[] };

export type ModuleCodeMap = { [moduleCode: string]: ModuleCondensed };
export type ModulesMap = {
  [moduleCode: string]: Module;
};

/** Stores position of last modified cell to maintain scroll position.
 * Use `className` as descriptor to find the cell in DOM tree.
 */
export type ModifiedCell = {
  className: string;
  position: {
    left: number;
    top: number;
  };
};

/** ModuleLessonConfig is a mapping of lessonType to ClassNo for a module. */
export type ModuleLessonConfig = {
  [lessonType: string]: ClassNo;
};

/** SemTimetableConfig is the timetable data for each semester. */
export type SemTimetableConfig = {
  [moduleCode: string]: ModuleLessonConfig;
};

/** Lesson stores moduleCode and title together with RawLesson details */
export type Lesson = RawLesson & {
  moduleCode: ModuleCode;
  title: ModuleTitle;
};

export type ColoredLesson = Lesson & {
  colorIndex: ColorIndex;
};

type Modifiable = {
  isModifiable?: boolean;
  isAvailable?: boolean;
  isActive?: boolean;
  colorIndex: ColorIndex;
};

export type ModifiableLesson = ColoredLesson & Modifiable;
//  The array of Lessons must belong to that lessonType.
export type ModuleLessonConfigWithLessons = {
  [lessonType: string]: Lesson[];
};

/** SemTimetableConfig is the timetable data for each semester with lessons data.
 * ```
 * {
 *    "CS2040":
 *        "Lecture": [Lesson1, Lesson2, Lesson3]
 *        "Lab": [Lesson1, Lesson2]
 *        "Tutorial": [Lesson1]
 *    "CS2030":
 *        "Lecture": [Lesson1]
 * }
 * ```
 */
export type SemTimetableConfigWithLessons = {
  [moduleCode: string]: ModuleLessonConfigWithLessons;
};

// TimetableConfig is the timetable data for the whole academic year.
export type TimetableConfig = {
  [semester: string]: SemTimetableConfig;
};

// TimetableDayFormat is timetable data grouped by DayText.
export type TimetableDayFormat = {
  [dayText: string]: ColoredLesson[];
};

// TimetableDayArrangement is the arrangement of lessons on the timetable within a day.
export type TimetableDayArrangement = ModifiableLesson[][];

// TimetableArrangement is the arrangement of lessons on the timetable for a week.
export type TimetableArrangement = {
  [dayText: string]: TimetableDayArrangement;
};

// Represents the lesson which the user is currently hovering over.
// Used to highlight lessons which have the same classNo
export type HoverLesson = {
  readonly classNo: ClassNo;
  readonly moduleCode: ModuleCode;
  readonly lessonType: LessonType;
};
