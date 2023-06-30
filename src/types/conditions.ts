import { ClassNo, RawLesson } from './modules';
import qs from 'querystring';

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

export function deserialiseCodeTypeClassNode(node: string) {
  return qs.parse(node) as codeTypeClassNode;
}

/** ModuleCode_LessonType node */
export type codeTypeNode = {
  moduleCode: string;
  lessonType: string;
};

export function serialiseCodeTypeNode(moduleCode: string, lessonType: string) {
  const node: codeTypeNode = {
    moduleCode: moduleCode,
    lessonType: lessonType,
  };
  return qs.stringify(node);
}

export function convertClassNodeToLessonType(code_type_class: string) {
  const codeTypeClassNode = deserialiseCodeTypeClassNode(code_type_class);
  return serialiseCodeTypeNode(
    codeTypeClassNode.moduleCode,
    codeTypeClassNode.lessonType
  );
}

export function deserialiseCodeTypeNode(node: string) {
  return qs.parse(node) as codeTypeNode;
}

export function appendClassNo(codeType: string, classNo: string) {
  const codeTypeNode = deserialiseCodeTypeNode(codeType);
  return serialiseCodeTypeClassNode(
    codeTypeNode.moduleCode,
    codeTypeNode.lessonType,
    classNo
  );
}

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
