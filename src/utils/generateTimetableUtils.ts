import { isEmpty, max, min, size } from 'lodash';
import {
  AdjMatrixMapping,
  GraphAdjList,
  LessonTypeMapping,
  ModuleClassesLessons,
  TimetableClassesWithLessons,
  codeTypeClassNode,
  codeTypeNode,
} from 'types/conditions';
import { doClassesOverlap, getOverlapInPermutation } from './conditionsUtils';
import qs from 'querystring';

/** Serialise moduleCode, lessonType & classNo.
 * Used to deserialised later for reference
 */
export function serialiseCodeTypeClassNode(
  moduleCode: string,
  lessonType: string,
  classNo: string
) {
  const node: codeTypeClassNode = {
    moduleCode: moduleCode,
    lessonType: lessonType,
    classNo: classNo,
  };
  return qs.stringify(node);
}

/** Converts string to CodeTypeClassNode object with moduleCode, lessonType & classNo */
export function deserialiseCodeTypeClassNode(node: string) {
  return qs.parse(node) as codeTypeClassNode;
}

/** Serialise moduleCode & lessonType. Used to deserialised later for reference */
export function serialiseCodeTypeNode(moduleCode: string, lessonType: string) {
  const node: codeTypeNode = {
    moduleCode: moduleCode,
    lessonType: lessonType,
  };
  return qs.stringify(node);
}

/** Converts string to codeTypeNode object with moduleCode & lessonType */
export function deserialiseCodeTypeNode(node: string) {
  return qs.parse(node) as codeTypeNode;
}

/** Obtain `ModuleCode_LessonType` string from `ModuleCode_LessonType_ClassNo` string.
 * Used to get lessonType string from a particular class path
 */
export function convertClassNodeToLessonType(code_type_class: string) {
  const codeTypeClassNode = deserialiseCodeTypeClassNode(code_type_class);
  return serialiseCodeTypeNode(
    codeTypeClassNode.moduleCode,
    codeTypeClassNode.lessonType
  );
}

/** Adds classNo to back of lessonType string to form CodeTypeClass string.
 * `ModuleCode_LessonType + ClassNo = ModuleCode_LessonType_ClassNo`
 */
export function appendClassNo(codeType: string, classNo: string) {
  const codeTypeNode = deserialiseCodeTypeNode(codeType);
  return serialiseCodeTypeClassNode(
    codeTypeNode.moduleCode,
    codeTypeNode.lessonType,
    classNo
  );
}

const permutateClasses = (
  startClassNode: string,
  adjList: GraphAdjList,
  hasOverlaps: (p: string[]) => string[]
) => {
  let count = 0;
  const MAX_TRAVERSAL_COUNT = 1000;
  const overlapLessons: string[] = [];

  const updateAdjListWithCorrectPath = (combinations: string[]) => {
    for (const classNoPath of combinations) {
      const node = deserialiseCodeTypeClassNode(classNoPath);
      const lessonType = convertClassNodeToLessonType(classNoPath);
      const classes = adjList[startClassNode][lessonType];

      if (classes === undefined) continue;
      const classNoIndex = classes.indexOf(node.classNo);
      // Ignore if class don't exist or is already the first index
      if (classNoIndex < 1) continue;

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
    if (count > MAX_TRAVERSAL_COUNT) return;
    count += 1;

    if (isEmpty(overlap)) {
      if (isEmpty(hasOverlaps(memo))) {
        updateAdjListWithCorrectPath(memo);
        return memo;
      }
      return;
    }

    console.log('OVERLAP TRAVERSE:', memo);
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
    if (count > MAX_TRAVERSAL_COUNT) return;
    count += 1;

    if (isEmpty(node)) {
      if (isEmpty(hasOverlaps(memo))) return memo;
      return;
    }

    const overlaps = hasOverlaps(memo);
    if (!isEmpty(overlaps)) {
      console.log('OVERLAP FOUND:', overlaps);
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
        const deleteAmt = size(overlapLessons) - index - 1;
        overlapLessons.splice(index + 1, deleteAmt, second);
      } else if (overlapLessons.includes(second)) {
        const index = overlapLessons.indexOf(second);
        const deleteAmt = size(overlapLessons) - index - 1;
        overlapLessons.splice(index + 1, deleteAmt, first);
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
      console.log('OVERLAP RESULT:', overlapResultMemo);
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
      console.log('TRAVERSE:', memo);
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

/**
 * Update edges in adjacency matrix
 * @param adjMatrix
 * @param adjMatrixMap
 * @returns
 */
const addEdgeToAdjMatrix =
  (adjMatrix: boolean[][], adjMatrixMap: AdjMatrixMapping) =>
  (node: string, oppositeNode: string) => {
    const nodeIndex = adjMatrixMap[node];
    const oppositeNodeIndex = adjMatrixMap[oppositeNode];
    adjMatrix[nodeIndex][oppositeNodeIndex] = true;
    adjMatrix[oppositeNodeIndex][nodeIndex] = true;
  };

/**
 * Update edges in adjacency list
 * @param adjList
 * @returns
 */
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

/**
 * Create adjacency list and adjacency matrix for timetable generation traversal
 * @param param0
 */
export function populateAdjacencyListMatrix({
  adjList,
  adjMatrixMap,
  adjMatrix,
  timetable,
}: {
  adjList: GraphAdjList;
  adjMatrixMap: AdjMatrixMapping;
  adjMatrix: boolean[][];
  timetable: TimetableClassesWithLessons;
}) {
  const addAdjList = addEdgeToAdjList(adjList);
  const addAdjMatrix = addEdgeToAdjMatrix(adjMatrix, adjMatrixMap);
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
            addAdjList(sameNode, sameNeighbourNode, classNo);
            const sameOppositeNode = appendClassNo(sameNeighbourNode, classNo);
            addAdjMatrix(sameNode, sameOppositeNode);
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
                addAdjList(node, neighbourNode, class2);

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
                addAdjList(oppositeNode, oppositeNeighbourNode, class1);

                // Update edges in adjacency matrix
                addAdjMatrix(node, oppositeNode);
              }
            }
          }
        }
      }
    }
  }
}

export interface FindTimetableParameters {
  startLessonType: string;
  startModuleClasses: ModuleClassesLessons;
  adjList: GraphAdjList;
  adjMatrixMap: AdjMatrixMapping;
  adjMatrix: boolean[][];
  lessonTypeMap: LessonTypeMapping;
}

export function findSuitableTimetableConfig({
  startLessonType,
  startModuleClasses,
  adjList,
  adjMatrixMap,
  adjMatrix,
  lessonTypeMap,
}: FindTimetableParameters) {
  for (const classNo in startModuleClasses) {
    const startNode = appendClassNo(startLessonType, classNo);
    // Ignore classes that aren't connected to every other lesson types
    if (size(adjList[startNode]) !== size(lessonTypeMap)) continue;

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
