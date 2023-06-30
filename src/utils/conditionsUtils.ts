import { ModulesMap, SemTimetableConfig } from 'types/timetable';
import { groupBy, mapValues, size } from 'lodash';
import { getModuleRawLessons } from './moduleUtils';
import {
  AdjMatrixMapping,
  GraphAdjList,
  LessonTypeMapping,
  ModuleClassesWithLessons,
  TimetableClassesWithLessons,
} from 'types/conditions';
import { RawLesson } from 'types/modules';
import { doLessonsOverlap } from './timetableUtils';
import {
  FindTimetableParameters,
  appendClassNo,
  deserialiseCodeTypeNode,
  populateAdjacencyListMatrix,
  serialiseCodeTypeNode,
} from './generateTimetableUtils';

/**
 * Converts a module to ModuleClassesWithLesson, which is a module with
 * lesson information grouped by lesson type then class numbers
 * @param semester
 * @param modules
 * @param moduleCode
 * @returns
 */
function convertToModuleClass(
  semester: number,
  modules: ModulesMap,
  moduleCode: string
) {
  const module = modules[moduleCode];
  const lessons = getModuleRawLessons(module, semester);

  const lessonTypes = groupBy(lessons, (lesson) => lesson.lessonType);
  const mappedLessons: ModuleClassesWithLessons = mapValues(
    lessonTypes,
    (lessons) => groupBy(lessons, (lesson) => lesson.classNo)
  );
  return mappedLessons;
}

/**
 * Determine if 2 classes overlap since each class can have multiple lessons.
 * Check if lesson of one class overlaps with any lessons of another class.
 * @param class1
 * @param class2
 * @returns
 */
export function doClassesOverlap(class1: RawLesson[], class2: RawLesson[]) {
  for (const lesson1 in class1) {
    for (const lesson2 in class2) {
      if (doLessonsOverlap(class1[lesson1], class2[lesson2])) return true;
    }
  }
  return false;
}

/**
 * Find the first 2 overlapping lesson types within a permutation of class paths
 * @param adjMatrix
 * @param adjMatrixMap
 * @param permutation
 * @returns 2 overlapping lesson types in an array. Empty array if no overlap found
 */
export const getOverlapInPermutation =
  (adjMatrix: boolean[][], adjMatrixMap: AdjMatrixMapping) =>
  (permutation: string[]) => {
    for (let i = 0; i < permutation.length; i++) {
      const class1Index = adjMatrixMap[permutation[i]];
      for (let j = i + 1; j < permutation.length; j++) {
        const class2Index = adjMatrixMap[permutation[j]];
        if (!adjMatrix[class1Index][class2Index]) {
          return [permutation[i], permutation[j]];
        }
      }
    }
    return [];
  };

/**
 * Creates adj
 * @param semester
 * @param modules
 * @param timetable
 * @returns
 */
export function setupTimetableGenerationData(
  semester: number,
  modules: ModulesMap,
  timetable: SemTimetableConfig
) {
  const adjList: GraphAdjList = {};
  const lessonTypeMap: LessonTypeMapping = {};

  const adjMatrix: boolean[][] = [];
  const adjMatrixMap: AdjMatrixMapping = {};

  // Group modules in timetable by their classes to be processed for graph
  const timetableByClasses: TimetableClassesWithLessons = {};
  for (const moduleCode in timetable) {
    const moduleClasses = convertToModuleClass(semester, modules, moduleCode);
    timetableByClasses[moduleCode] = moduleClasses;

    for (const lessonType in moduleClasses) {
      // Populate mapping for all lessonTypes across every module
      const lessonTypeNode = serialiseCodeTypeNode(moduleCode, lessonType);
      lessonTypeMap[lessonTypeNode] = size(lessonTypeMap);

      // Populate mapping for all classes across every module for adjacency matrix
      for (const classNo in moduleClasses[lessonType]) {
        const classNode = appendClassNo(lessonTypeNode, classNo);
        adjMatrixMap[classNode] = size(adjMatrixMap);
      }
    }
  }

  // Populate empty adjMatrix with total no. of classes across all modules
  for (let i = 0; i < size(adjMatrixMap); i++) {
    adjMatrix[i] = Array(size(adjMatrixMap)).fill(false);
  }

  populateAdjacencyListMatrix({
    adjList: adjList,
    adjMatrixMap: adjMatrixMap,
    adjMatrix: adjMatrix,
    timetable: timetableByClasses,
  });

  const lessonTypeClassCount: LessonTypeMapping = {};
  for (const moduleCode in timetableByClasses) {
    const module = timetableByClasses[moduleCode];
    for (const lessonType in module) {
      const node = serialiseCodeTypeNode(moduleCode, lessonType);
      lessonTypeClassCount[node] = size(module[lessonType]);
    }
  }

  // Prefer lesson type with least number of classes for faster convergence
  const preferredLessonType = Object.keys(lessonTypeClassCount).reduce(
    (key, value) =>
      lessonTypeClassCount[value] < lessonTypeClassCount[key] ? value : key
  );

  const startNode = deserialiseCodeTypeNode(preferredLessonType);
  const startModule =
    timetableByClasses[startNode.moduleCode][startNode.lessonType];

  console.log('Adjacency List:', structuredClone(adjList));
  console.log('Adjacency Matrix Map:', adjMatrixMap);
  console.log('Adjacency Matrix:', adjMatrix);
  console.log('Lesson Type Map:', lessonTypeMap);
  console.log('Lesson Type Class Count:', lessonTypeClassCount);
  console.log('Start Lesson Type:', preferredLessonType, startModule);

  const data: FindTimetableParameters = {
    startLessonType: preferredLessonType,
    startModuleClasses: startModule,
    adjList: adjList,
    adjMatrixMap: adjMatrixMap,
    adjMatrix: adjMatrix,
    lessonTypeMap: lessonTypeMap,
  };
  return data;
}
