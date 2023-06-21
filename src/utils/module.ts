import axios from 'axios';
import { Module, SemesterDataCondensed } from '../types/modules';

const semesterString = [
  'Semester 1',
  'Semester 2',
  'Special Term I',
  'Special Term II',
];

export const getMainSemester = (
  currentSem: number,
  semesterData: SemesterDataCondensed[]
) => {
  // Check if module is offered in curent semester
  const isOfferedCurrentSem = semesterData.some(
    (sem) => sem.semester === currentSem
  );

  // Show main button with current semester if offered currently
  // Or show first other semester offered
  const mainSemester = isOfferedCurrentSem
    ? currentSem
    : semesterData[0].semester;

  // Return name of mainSemester
  return semesterString[mainSemester - 1];
};

export const getOtherSemesters = (
  mainSemester: string,
  semesterData: SemesterDataCondensed[]
) => {
  // Get the names of other semesters offered
  const otherSemesters = semesterData.map((sem) => {
    return semesterString[sem.semester - 1];
  });

  // Remove mainSemester from list of alternative semester selection
  return otherSemesters.filter((sem) => sem !== mainSemester);
};

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
