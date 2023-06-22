import axios from 'axios';
import {
  Module,
  ModuleCode,
  RawLesson,
  Semester,
  SemesterData,
  SemesterDataCondensed,
} from '../types/modules';
import { Lesson } from '../types/timetable';
import { toSingaporeTime } from './timify';
import { format } from 'date-fns';
import { get } from 'lodash';

export const semesterStringName = [
  '', // 1-based indexing
  'Semester 1',
  'Semester 2',
  'Special Term I',
  'Special Term II',
];

export const getModuleInfo = async (
  moduleCode: string,
  setLoading: (state: boolean) => void
) => {
  try {
    setLoading(true);
    const response = await axios.get(
      `https://api.nusmods.com/v2/2022-2023/modules/${moduleCode}.json`
    );
    setLoading(false);
    return response.data as Module;
  } catch (error) {
    console.error(error);
    setLoading(false);
  }
};

/**
 * Returns semesterData of a module for a given semester
 * @param module
 * @param semester
 * @returns
 */
export function getModuleSemesterData(
  module: Module,
  semester: Semester
): SemesterData | undefined {
  return module.semesterData.find(
    (semData: SemesterData) => semData.semester === semester
  );
}

/**
 * Returns RawLessons[] of a module for a given semester.
 * @param module
 * @param semester
 * @returns
 */
export function getModuleRawLessons(
  module: Module,
  semester: Semester
): RawLesson[] {
  return get(getModuleSemesterData(module, semester), 'timetable', []);
}

/**
 * Determine if two lessons belong to the same class
 * @param lesson1
 * @param lesson2
 * @returns
 */
export function areLessonsSameClass(lesson1: Lesson, lesson2: Lesson): boolean {
  return (
    lesson1.moduleCode === lesson2.moduleCode &&
    lesson1.classNo === lesson2.classNo &&
    lesson1.lessonType === lesson2.lessonType
  );
}

/**
 * Convert exam in ISO format to 12-hour date/time format.
 */
export function formatExamDate(examDate: string | null | undefined): string {
  if (!examDate) return 'No Exam';

  const localDate = toSingaporeTime(examDate);
  return format(localDate, 'dd-MMM-yyyy p');
}

// export function getExamDate(module: Module, semester: Semester): string | null {
//   return _.get(getModuleSemesterData(module, semester), 'examDate') || null;
// }

// export function getExamDuration(
//   module: Module,
//   semester: Semester
// ): number | null {
//   return _.get(getModuleSemesterData(module, semester), 'examDuration') || null;
// }

// export function getFormattedExamDate(
//   module: Module,
//   semester: Semester
// ): string {
//   const examDate = getExamDate(module, semester);
//   return formatExamDate(examDate);
// }

/**
 * Returns the current semester if it is found in semesters,
 * or the first semester where it is available
 * @param semesters
 * @param current
 * @returns
 */
export function getFirstAvailableSemester(
  semesters: readonly SemesterDataCondensed[],
  current: Semester
): Semester {
  const availableSemesters = semesters.map(
    (semesterData) => semesterData.semester
  );
  // Assume there is at least 1 semester
  return availableSemesters.includes(current)
    ? current
    : Math.min(...availableSemesters);
}

/**
 * Returns all the semester numbers offered for a module.
 * Option to remove semester from the result array
 * @param module
 * @param remove
 * @returns
 */
export function getSemestersOffered(
  semesters: SemesterDataCondensed[] | SemesterData[],
  exclude?: Semester
): Semester[] {
  const sems = semesters.map((semesterData) => semesterData.semester).sort();

  return sems.filter((sem) => sem !== exclude);
}

// export function renderMCs(moduleCredits: number | string) {
//   const credit =
//     typeof moduleCredits === 'string'
//       ? parseFloat(moduleCredits)
//       : moduleCredits;
//   return `${credit}${NBSP}${credit === 1 ? 'MC' : 'MCs'}`;
// }

// export function renderExamDuration(examDuration: number) {
//   if (examDuration < 60 || examDuration % 30 !== 0) {
//     return noBreak(`${examDuration} mins`);
//   }
//   const hours = examDuration / 60;
//   return noBreak(`${hours} ${hours === 1 ? 'hr' : 'hrs'}`);
// }

export function subtractAcadYear(acadYear: string): string {
  return acadYear.replace(/\d+/g, (year) => String(parseInt(year, 10) - 1));
}

export function addAcadYear(acadYear: string): string {
  return acadYear.replace(/\d+/g, (year) => String(parseInt(year, 10) + 1));
}

export function isOffered(module: {
  semesterData?: readonly (SemesterData | SemesterDataCondensed)[];
}): boolean {
  if (module.semesterData) return module.semesterData.length > 0;
  return false;
}

export function offsetAcadYear(year: string, offset: number) {
  let i = offset;
  let currentYear = year;

  while (i !== 0) {
    if (offset < 0) {
      currentYear = subtractAcadYear(currentYear);
      i += 1;
    } else {
      currentYear = addAcadYear(currentYear);
      i -= 1;
    }
  }

  return currentYear;
}

export function getYearsBetween(minYear: string, maxYear: string): string[] {
  if (minYear > maxYear)
    throw new Error('minYear should be less than or equal to maxYear');

  const years = [];
  let nextYear = minYear;
  while (nextYear !== maxYear) {
    years.push(nextYear);
    nextYear = addAcadYear(nextYear);
  }
  years.push(maxYear);
  return years;
}

export function isGraduateModule(module: { moduleCode: ModuleCode }): boolean {
  return Boolean(/[A-Z]+(5|6)\d{3}/i.test(module.moduleCode));
}
