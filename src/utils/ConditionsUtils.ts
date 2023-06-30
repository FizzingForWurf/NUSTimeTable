import { ModulesMap, SemTimetableConfig } from 'types/timetable';
import { groupBy, isEmpty, mapValues, max, min, size } from 'lodash';
import { getModuleRawLessons } from './moduleUtils';
import {
  AdjMatrixMapping,
  GraphAdjList,
  LessonTypeMapping,
  ModuleClassesLessons,
  ModuleClassesWithLessons,
  TimetableClassesWithLessons,
  appendClassNo,
  convertClassNodeToLessonType,
  deserialiseCodeTypeClassNode,
  deserialiseCodeTypeNode,
  serialiseCodeTypeClassNode,
  serialiseCodeTypeNode,
} from 'types/conditions';
import { RawLesson } from 'types/modules';
import { doLessonsOverlap } from './timetableUtils';

/**
 * Converts a module to ModuleClassesWithLesson, grouped by class numbers
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
function doClassesOverlap(class1: RawLesson[], class2: RawLesson[]) {
  for (const lesson1 in class1) {
    for (const lesson2 in class2) {
      if (doLessonsOverlap(class1[lesson1], class2[lesson2])) return true;
    }
  }
  return false;
}

/**
 * Find the first 2 overlapping lesson types within the permutation
 * @param adjMatrix
 * @param adjMatrixMap
 * @param permutation
 * @returns 2 overlapping lesson types in an array. Empty array if no overlap found
 */
const getOverlapInPermutation =
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

const permutateClasses = (
  startClassNode: string,
  adjList: GraphAdjList,
  hasOverlaps: (p: string[]) => string[]
) => {
  let count = 0;
  const HARD_LIMIT = 1000;
  const overlapLessons: string[] = [];

  const updateAdjListWithCorrectPath = (combinations: string[]) => {
    for (const classNoPath of combinations) {
      const node = deserialiseCodeTypeClassNode(classNoPath);
      const lessonType = convertClassNodeToLessonType(classNoPath);
      const classes = adjList[startClassNode][lessonType];

      if (classes === undefined) continue;
      const classNoIndex = classes.indexOf(node.classNo);
      if (classNoIndex < 1) continue; // Either don't exist or is first index

      classes.splice(classNoIndex, 1);
      classes.unshift(node.classNo);
    }
  };

  /**
   * Traverses all combinations of overlapping lesson types to determine
   * if overlaps can be resolved. If all combinations explored and all has overlaps,
   * conflict cannot be resolved and thus no timetable configuration is available.
   * @param overlap
   * @param memo
   * @returns string[] of classNo paths that has no overlaps. undefined if no configuration
   */
  const overlapTraverse = (
    overlap: Map<string, string[]>,
    memo: string[] = []
  ): string[] | undefined => {
    if (count > HARD_LIMIT) return;
    count += 1;

    if (isEmpty(overlap)) {
      if (isEmpty(hasOverlaps(memo))) {
        updateAdjListWithCorrectPath(memo);
        return memo;
      }
      return;
    }

    for (const [lessonType, classes] of overlap) {
      for (const classNo of classes) {
        const neighbourNode = appendClassNo(lessonType, classNo);
        const newOverlap = new Map(
          Array.from(overlap).filter(([key, _]) => key !== lessonType)
        );

        const result = overlapTraverse(newOverlap, memo.concat(neighbourNode));
        if (result) return result;
      }
    }
  };

  const normalTraverse = (
    node: Map<string, string[]>,
    memo: string[] = []
  ): string[] | undefined => {
    if (count > HARD_LIMIT) return;
    count += 1;

    if (isEmpty(node)) {
      if (isEmpty(hasOverlaps(memo))) return memo;
      return;
    }

    const overlaps = hasOverlaps(memo);
    if (!isEmpty(overlaps)) {
      const first = convertClassNodeToLessonType(overlaps[0]);
      const second = convertClassNodeToLessonType(overlaps[1]);

      if (overlapLessons.includes(first) && overlapLessons.includes(second)) {
        const index1 = overlapLessons.indexOf(first);
        const index2 = overlapLessons.indexOf(second);
        const frontIndex = min([index1, index2]) || 0;
        const backIndex = max([index1, index2]) || 0;

        if (backIndex - frontIndex > 1) {
          const value = overlapLessons[backIndex];
          overlapLessons.splice(backIndex, 1); // Remove backIndex
          overlapLessons.splice(frontIndex + 1, 0, value); // Insert behind frontIndex
        }
      } else if (overlapLessons.includes(first)) {
        const index = overlapLessons.indexOf(first);
        overlapLessons.splice(index + 1, 0, second);
      } else if (overlapLessons.includes(second)) {
        const index = overlapLessons.indexOf(second);
        overlapLessons.splice(index + 1, 0, first);
      } else {
        // Both not in previous overlap
        overlapLessons.push(first);
        overlapLessons.push(second);
      }

      // Converts overlapLesson array to Map type with neighbour nodes for traversal
      const overlapping = new Map<string, string[]>();
      overlapLessons.forEach((lessonType) => {
        overlapping.set(lessonType, adjList[startClassNode][lessonType]);
      });

      // Try to resolve overlapping lesson types. If overlap can be resolved,
      // traverse normally with the remaining lesson types from resolved selection of classes
      const overlapResultMemo = overlapTraverse(overlapping);
      if (overlapResultMemo) {
        const remainingNodes = new Map<string, string[]>();
        Object.entries(adjList[startClassNode]).forEach(
          ([lessonType, classes]) => {
            if (!overlapLessons.includes(lessonType)) {
              remainingNodes.set(lessonType, classes);
            }
          }
        );

        const result = normalTraverse(remainingNodes, overlapResultMemo);
        if (result) return result;
      }
    } else {
      // No overlaps, continue traversing next lesson type
      for (const [lessonType, classes] of node) {
        for (const classNo of classes) {
          const neighbourNode = appendClassNo(lessonType, classNo);
          const newNode = new Map(
            Array.from(node).filter(([key, _]) => key !== lessonType)
          );
          const result = normalTraverse(newNode, memo.concat(neighbourNode));
          if (result) return result;
        }
      }
    }
  };

  const convertAdjList = new Map(Object.entries(adjList[startClassNode]));
  return normalTraverse(convertAdjList);
};

interface PopulateParameters {
  adjList: GraphAdjList;
  adjMatrixMap: AdjMatrixMapping;
  adjMatrix: boolean[][];
  timetable: TimetableClassesWithLessons;
}

const addEdgeToAdjList =
  (adjList: GraphAdjList) =>
  (node: string, neighbourNode: string, classNo: string) => {
    if (adjList[node] === undefined)
      adjList[node] = {
        [neighbourNode]: [classNo],
      };
    else if (adjList[node][neighbourNode] === undefined)
      adjList[node][neighbourNode] = [classNo];
    else adjList[node][neighbourNode].push(classNo);
  };

function populateAdjacencyList({
  adjList,
  adjMatrixMap,
  adjMatrix,
  timetable,
}: PopulateParameters) {
  const addEdge = addEdgeToAdjList(adjList);
  const seenModules = new Set();

  for (const moduleCode1 in timetable) {
    seenModules.add(moduleCode1); // Mark module as seen
    const module1 = timetable[moduleCode1];

    for (const lessonType1 in module1) {
      for (const class1 in module1[lessonType1]) {
        const sameNode = serialiseCodeTypeClassNode(
          moduleCode1,
          lessonType1,
          class1
        );

        // Populate connections between classes of the SAME module
        for (const otherLessonTypes in module1) {
          const sameNeighbourNode = serialiseCodeTypeNode(
            moduleCode1,
            otherLessonTypes
          );

          for (const classNo in module1[otherLessonTypes]) {
            addEdge(sameNode, sameNeighbourNode, classNo);
            const sameOppositeNode = appendClassNo(sameNeighbourNode, classNo);
            // Update edges in adjacency matrix
            const nodeIndex = adjMatrixMap[sameNode];
            const oppositeNodeIndex = adjMatrixMap[sameOppositeNode];
            adjMatrix[nodeIndex][oppositeNodeIndex] = true;
            adjMatrix[oppositeNodeIndex][nodeIndex] = true;
          }
        }

        // Check for overlap with all other modules
        for (const moduleCode2 in timetable) {
          if (seenModules.has(moduleCode2)) continue;
          const module2 = timetable[moduleCode2];

          for (const lessonType2 in module2) {
            for (const class2 in module2[lessonType2]) {
              const overlap = doClassesOverlap(
                module1[lessonType1][class1],
                module2[lessonType2][class2]
              );

              // Add edge to graph: Signify can be connected
              if (!overlap) {
                const node = serialiseCodeTypeClassNode(
                  moduleCode1,
                  lessonType1,
                  class1
                );
                const neighbourNode = serialiseCodeTypeNode(
                  moduleCode2,
                  lessonType2
                );
                addEdge(node, neighbourNode, class2);

                // For bidirectional edges
                const oppositeNode = serialiseCodeTypeClassNode(
                  moduleCode2,
                  lessonType2,
                  class2
                );
                const oppositeNeighbourNode = serialiseCodeTypeNode(
                  moduleCode1,
                  lessonType1
                );
                addEdge(oppositeNode, oppositeNeighbourNode, class1);

                // Update edges in adjacency matrix
                const nodeIndex = adjMatrixMap[node];
                const oppositeNodeIndex = adjMatrixMap[oppositeNode];
                adjMatrix[nodeIndex][oppositeNodeIndex] = true;
                adjMatrix[oppositeNodeIndex][nodeIndex] = true;
              }
            }
          }
        }
      }
    }
  }
}

const isLessonTypeFullyConnected =
  (lessonTypeMap: LessonTypeMapping) =>
  (neighbourLessonType: Record<string, unknown>) => {
    if (!neighbourLessonType) return false;
    return size(neighbourLessonType) === size(lessonTypeMap);
  };

interface FindParameters {
  startLessonType: string;
  startModuleClasses: ModuleClassesLessons;
  adjList: GraphAdjList;
  adjMatrixMap: AdjMatrixMapping;
  adjMatrix: boolean[][];
  lessonTypeMap: LessonTypeMapping;
}

function findSuitableTimetableConfig({
  startLessonType,
  startModuleClasses,
  adjList,
  adjMatrixMap,
  adjMatrix,
  lessonTypeMap,
}: FindParameters) {
  const isConnected = isLessonTypeFullyConnected(lessonTypeMap);

  for (const classNo in startModuleClasses) {
    const startNode = appendClassNo(startLessonType, classNo);
    if (!isConnected(adjList[startNode])) continue;

    // Node is fully connected to all other lessonTypes
    // Check if other lessonTypes have classes that are also fully connected
    const result = permutateClasses(
      startNode,
      adjList,
      getOverlapInPermutation(adjMatrix, adjMatrixMap)
    );
    if (result) return result;
  }
  return {};
}

export function checkConflictModule(
  semester: number,
  modules: ModulesMap,
  timetable: SemTimetableConfig
) {
  if (size(timetable) < 2) return;

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

  populateAdjacencyList({
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

  // Prefer lesson type with least number of classes for DFS to converge
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

  const result = findSuitableTimetableConfig({
    startLessonType: preferredLessonType,
    startModuleClasses: startModule,
    adjList: adjList,
    adjMatrixMap: adjMatrixMap,
    adjMatrix: adjMatrix,
    lessonTypeMap: lessonTypeMap,
  });
  //   console.log(result);
  return result;
}
