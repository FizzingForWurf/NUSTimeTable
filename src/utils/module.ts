import axios from 'axios';
import { Module, SemesterDataCondensed } from '../types/modules';

export const semesterStringName = [
  '', // 1-based indexing
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
  return isOfferedCurrentSem ? currentSem : semesterData[0].semester;
};

export const getOtherSemesters = (
  mainSemester: number,
  semesterData: SemesterDataCondensed[]
) => {
  // Remove mainSemester from list of alternative semester selection
  const otherSemesters = semesterData.filter(
    (sem) => sem.semester !== mainSemester
  );

  // Return the semester number of other semester offered
  return otherSemesters.map((sem) => sem.semester);
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
