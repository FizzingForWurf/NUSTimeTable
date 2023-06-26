import { ModulesMap, SemTimetableConfig } from 'types/timetable';
import { groupBy, mapValues, omitBy } from 'lodash';
import { getModuleRawLessons } from './moduleUtils';
import {
  AdjMatrixMapping,
  GraphAdjList,
  LessonTypeMapping,
  ModuleClassesLessons,
  ModuleClassesWithLessons,
  TimetableClassesWithLessons,
} from 'types/conditions';
import { RawLesson } from 'types/modules';
import { doLessonsOverlap } from './timetableUtils';

const DELIMITER = '|';

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

function doClassesOverlap(class1: RawLesson[], class2: RawLesson[]) {
  for (const lesson1 in class1) {
    for (const lesson2 in class2) {
      if (doLessonsOverlap(class1[lesson1], class2[lesson2])) return true;
    }
  }
  return false;
}

interface PopulateParameters {
  adjList: GraphAdjList;
  adjMatrixMap: AdjMatrixMapping;
  adjMatrix: boolean[][];
  existing: TimetableClassesWithLessons;
  newModuleCode: string;
  newMod: ModuleClassesWithLessons;
}

function populateAdjacencyList({
  adjList,
  adjMatrixMap,
  adjMatrix,
  existing,
  newModuleCode,
  newMod,
}: PopulateParameters) {
  // Reset adjMatrixMap
  Object.keys(adjMatrixMap).forEach((key) => {
    delete adjMatrixMap[key];
  });

  for (const moduleCode in existing) {
    const existingMod = existing[moduleCode];
    for (const lessonType1 in existingMod) {
      for (const class1 in existingMod[lessonType1]) {
        const node = moduleCode + DELIMITER + lessonType1 + DELIMITER + class1;
        adjMatrixMap[node] = Object.keys(adjMatrixMap).length;

        for (const lessonType2 in newMod) {
          for (const class2 in newMod[lessonType2]) {
            const node =
              newModuleCode + DELIMITER + lessonType2 + DELIMITER + class2;
            if (adjMatrixMap[node] === undefined)
              adjMatrixMap[node] = Object.keys(adjMatrixMap).length;

            const overlap = doClassesOverlap(
              existingMod[lessonType1][class1],
              newMod[lessonType2][class2]
            );

            if (!overlap) {
              // Add edge to graph: Signify can be connected
              const node =
                moduleCode + DELIMITER + lessonType1 + DELIMITER + class1;
              const neighbourNode = newModuleCode + DELIMITER + lessonType2;
              if (adjList[node] === undefined)
                adjList[node] = {
                  [neighbourNode]: [class2],
                };
              else if (adjList[node][neighbourNode] === undefined)
                adjList[node][neighbourNode] = [class2];
              else adjList[node][neighbourNode].push(class2);

              // For bidirectional edges
              const oppositeNode =
                newModuleCode + DELIMITER + lessonType2 + DELIMITER + class2;
              const oppositeNeighbourNode =
                moduleCode + DELIMITER + lessonType1;
              if (adjList[oppositeNode] === undefined)
                adjList[oppositeNode] = {
                  [oppositeNeighbourNode]: [class1],
                };
              else if (
                adjList[oppositeNode][oppositeNeighbourNode] === undefined
              )
                adjList[oppositeNode][oppositeNeighbourNode] = [class1];
              else adjList[oppositeNode][oppositeNeighbourNode].push(class1);

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

const isFullyConnected =
  (lessonTypeMap: LessonTypeMapping) =>
  (moduleCode: string, neighbourLessonType: Record<string, unknown>) => {
    if (!neighbourLessonType) return false;

    const excludeCurMod = omitBy(
      lessonTypeMap,
      (_, lessonType) => moduleCode === lessonType.split(DELIMITER)[0]
    );
    console.log(moduleCode, excludeCurMod);

    return (
      Object.keys(neighbourLessonType).length ===
      Object.keys(excludeCurMod).length
    );
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
  //   adjMatrixMap,
  //   adjMatrix,
  lessonTypeMap,
}: FindParameters) {
  const isConnected = isFullyConnected(lessonTypeMap);

  for (const classNo in startModuleClasses) {
    const node = startLessonType + DELIMITER + classNo;
    if (!isConnected(startLessonType.split(DELIMITER)[0], adjList[node]))
      continue;

    const lessonTypeClassConfig: {
      // ModuleCode_LessonType: ClassNo
      [code_type: string]: string;
    } = {};
    // Node is fully connected to all other lessonTypes
    // Check if other lessonTypes have classes that are also fully connected
    for (const lessonType in lessonTypeMap) {
      if (lessonType === startLessonType) continue;

      let fullyConnectedClassNo = '';
      const classes = adjList[node][lessonType];
      for (const classNo of classes) {
        const neighbourNode = lessonType + DELIMITER + classNo;
        console.log(neighbourNode);
        if (
          isConnected(lessonType.split(DELIMITER)[0], adjList[neighbourNode])
        ) {
          // This neighbour lessonType is valid!
          fullyConnectedClassNo = classNo;
          break;
        }
      }
      console.log(fullyConnectedClassNo);
      // If there are no classes within this lessonType that is valid,
      // Means that this configuration is invalid
      if (!fullyConnectedClassNo) break;
      else lessonTypeClassConfig[lessonType] = fullyConnectedClassNo;
    }

    if (
      isConnected(startLessonType.split(DELIMITER)[0], lessonTypeClassConfig)
    ) {
      lessonTypeClassConfig[startLessonType] = classNo;
      return lessonTypeClassConfig;
    }
  }
  return {};
}

export function checkConflictModule(
  semester: number,
  modules: ModulesMap,
  timetable: SemTimetableConfig
) {
  if (Object.keys(timetable).length < 2) return;

  const adjList: GraphAdjList = {};

  const adjMatrixMap: AdjMatrixMapping = {};
  let adjMatrix: boolean[][] = [];

  // Used to track modules that have been processed for adjList and adjMatrix
  const timetableByClasses: TimetableClassesWithLessons = {};
  const firstModuleCode = Object.keys(timetable)[0];
  const firstModuleClass = convertToModuleClass(
    semester,
    modules,
    firstModuleCode
  );
  timetableByClasses[firstModuleCode] = firstModuleClass;

  let classNoCount = 0;
  const lessonTypeMap: LessonTypeMapping = {};

  for (const moduleCode in timetable) {
    const moduleClasses = convertToModuleClass(semester, modules, moduleCode);

    for (const lessonType in moduleClasses) {
      const node = moduleCode + DELIMITER + lessonType;
      lessonTypeMap[node] = Object.keys(lessonTypeMap).length;

      const classes = moduleClasses[lessonType];
      classNoCount += Object.keys(classes).length;
    }

    // Reset adjMatrix for new module with updated no. of nodes
    // No. of nodes = no. of classes a module has
    adjMatrix = [];
    for (let i = 0; i < classNoCount; i++) {
      adjMatrix[i] = Array(classNoCount).fill(false);
    }

    populateAdjacencyList({
      adjList: adjList,
      adjMatrixMap: adjMatrixMap,
      adjMatrix: adjMatrix,
      existing: timetableByClasses,
      newModuleCode: moduleCode,
      newMod: moduleClasses,
    });

    // Add module to existing timetable tracking
    timetableByClasses[moduleCode] = moduleClasses;
  }
  console.log(adjList);
  console.log(adjMatrixMap);
  console.log(adjMatrix);
  console.log(lessonTypeMap);

  const lessonTypeClassCount: LessonTypeMapping = {};
  for (const moduleCode in timetableByClasses) {
    const module = timetableByClasses[moduleCode];
    for (const lessonType in module) {
      const node = moduleCode + DELIMITER + lessonType;
      lessonTypeClassCount[node] = Object.keys(module[lessonType]).length;
    }
  }

  // Prefer lesson type with least number of classes for DFS to converge
  const preferredLessonType = Object.keys(lessonTypeClassCount).reduce(
    (key, value) =>
      lessonTypeClassCount[value] < lessonTypeClassCount[key] ? value : key
  );

  const split = preferredLessonType.split(DELIMITER);
  const startModule = timetableByClasses[split[0]][split[1]];
  console.log(preferredLessonType, startModule);

  const result = findSuitableTimetableConfig({
    startLessonType: preferredLessonType,
    startModuleClasses: startModule,
    adjList: adjList,
    adjMatrixMap: adjMatrixMap,
    adjMatrix: adjMatrix,
    lessonTypeMap: lessonTypeMap,
  });
  console.log(result);
}
